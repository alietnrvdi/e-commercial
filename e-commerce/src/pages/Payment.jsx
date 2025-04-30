import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Modal, Offcanvas, Row } from 'react-bootstrap'
import CreditCart from '../components/CreditCart'
import ExistingCreditCard from '../components/ExistingCreditCard'
import { useSelector } from 'react-redux'
import ExistingAddress from '../components/ExistingAddress'
import Address from '../components/Address'
import useAuth from "../hooks/useAuth"
import { db } from '../store/Firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
function Payment() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const cartItems = useSelector(state => state.cart.items);
    const uniqueItemCount = useSelector((state) => state.cart.uniqueItemCount);

    const [selectedCard, setSelectedCard] = useState(() => {
        const savedCard = sessionStorage.getItem('credit');
        return savedCard ? JSON.parse(savedCard) : '';
    })
    const [selectedAddress, setSelectedAddres] = useState(() => {
        const savedAddress = sessionStorage.getItem('address')
        return savedAddress ? JSON.parse(savedAddress) : '';
    }
    );
    const [uniqueItem, setUniqueItem] = useState([]);
    const [shipping, setShipping] = useState(50);

    const [isAgreed, setIsAgreed] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showA, setShowA] = useState(false);
    const [contentA, setContentA] = useState('initialA');

    const [showB, setShowB] = useState(false)
    const [contentB, setContentB] = useState('initialB');

    const [showModals, setShowModals] = useState(false);
    const handleShowModals = () => setShowModals(true);
    const handleCloseModals = () => setShowModals(false);

    const [messages, setMessage] = useState('')
    const [contrantTerms, setContratTerms] = useState();

    useEffect(() => {
        fetch('../agreements/DistanceSalesAggrements.md')
            .then(response => response.text())
            .then(text => {
                const htmlContent = marked(text);
                setContratTerms(htmlContent)
            })
            .catch(error => console.log('Error Markdown Files', error))
    }, [])
    useEffect(() => {
        const calculateTotalPrice = () => {
            const newTotalPrice = cartItems.reduce((acc, item) => {
                return acc + item.price * item.quantity
            }, 0);
            setTotalPrice(newTotalPrice.toFixed(2))
        };
        calculateTotalPrice();
    }, [cartItems])


    useEffect(() => {
        const subTotal = cartItems.length > 0 ?
            cartItems.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
        console.log(subTotal)
        if (subTotal > 50) {
            setShipping(0);
            setMessage(
                <p><span className='text-success'>Free </span> <s className='fw-bold text-custom'>{shipping}</s></p>
            )
        } else {
            setShipping(10);
        }
    }, [cartItems])
    console.log(shipping)

    const handleSelectedCard = (card) => {
        if (!user) {
            alert('Please a log in')
            return
        } else {
            setSelectedCard(card)
            sessionStorage.setItem('credit', JSON.stringify(card))
            handleCloseA()
        }
    }

    const handleAddressSelected = (adress) => {
        setSelectedAddres(adress)
        sessionStorage.setItem('address', JSON.stringify(adress))
        handleCloseB()

    }

    const handleCloseA = () => {
        setContentA('initialA')
        setShowA(false)
    }
    const handleShowA = () => {
        if (!user) {
            alert('Please a login')
            return
        }
        else {
            setShowA(true)
        }
    }
    const handeBackToInitialA = () => {
        setContentA('initialA')
        setShowA(true)
    }

    const handleShowB = () => {
        if (!user) {
            alert('Please a login')
            return
        } else {
            setShowB(true)
        }
    }
    const handleCloseB = () => {
        setContentB('initialB')
        setShowB(false)
    }
    const handeBackToInitialB = () => {
        setContentB('initialB')
        setShowB(true)
    }


    const handleCheckboxChange = () => {
        setIsAgreed(!isAgreed)
    }

    const addOrder = async () => {
        if (!user) {
            alert('Please a login')
            return;
        }
        if (selectedAddress && selectedCard) {
            try {
                const orderRef = collection(db, 'users', user.uid, 'orders')
                console.log(orderRef)
                const orderDetails = {
                    items: cartItems,
                    orderDate: new Date(),
                    totalPrice,
                    status: 'completed',
                    address: selectedAddress,
                    card: selectedCard,
                }
                const newDocRef = await addDoc(orderRef, orderDetails)
                navigate('/order-successful', {
                    state: {
                        orderId: newDocRef.id,
                        totalPrice,
                    }
                }
                )
            }
            catch (error) {
                console.log('Order add error:', error)
            }
        } else if (!isAgreed) {
            setMessage('Please distance sales agreement must be confirmed.')
        } else {
            setMessage('');
        }
        setMessage('Please choose card and address')
    }


    return (
        <Container>
            <Row >
                <Col md={12} lg={8} >
                    <Card className='w-100'>
                        <Col md={10} lg={10}>
                            <Card.Body className='border rounded mt-3 h-100 '>
                                <h3 >Credit Card</h3>
                                {selectedCard ? (
                                    <div className='justify-content-end'>
                                        <p>Cardholder: {selectedCard.cardholderName}</p>
                                        <p>Card Number:  {selectedCard.cardNumber}</p>
                                        <p>Expiration Date: {selectedCard.expirationDate}</p>
                                    </div>
                                ) : (
                                    <div className=''>
                                        <div className='d-flex '>
                                            <label htmlFor="creditCard" className='w-100'>Choose a credit cart: </label>
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                            <p className='w-100 text-end text-warning justify-content-end'
                                onClick={handleShowA}>
                                Add or Select
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    size='2xl'
                                    className='rotate ms-2'
                                />
                            </p>
                        </Col>

                        <Col md={10} lg={10} className='mt-5'>
                            <Card.Body className='border rounded h-100 w-100'>
                                <h3>Billing Address</h3>
                                {selectedAddress ? (
                                    <div>
                                        <div>
                                            <p>Adress Line {selectedAddress.streetAddress}</p>
                                            <p>City **** {selectedAddress.city}</p>
                                            <p>Zip Code: {selectedAddress.zipCode}</p>
                                            <p>Country {selectedAddress.country}</p>
                                        </div>
                                        <div className='text-end text-warning'>
                                            <p onClick={handleShowB}>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                    </div>
                                )}
                            </Card.Body >
                            <p
                                className='w-100 text-end text-warning'
                                onClick={handleShowB}>
                                Select Addres
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    size='2xl'
                                    className='rotate ms-2'
                                />
                            </p>
                        </Col>
                    </Card>
                </Col>

                <Col md={12} lg={4} className='mb-5'>
                    <Card className='h-75 w-100 p-2'>
                        <div className='me-auto'>
                            <h2 className='text-danger'>Invoice total</h2>
                            <h5 className='fs-4'>${totalPrice}</h5>
                        </div>

                        <Form >
                            <Button
                                variant={!isAgreed ? 'outline-danger' : 'danger'}
                                disabled={!isAgreed}
                                onClick={() => addOrder()}
                                className='d-flex mx-auto m-3'>
                                Complete Shopping
                            </Button>

                            <div className="d-flex align-items-start">
                                <Form.Check
                                    type='checkbox'
                                    checked={isAgreed}
                                    onChange={handleCheckboxChange}
                                />
                                <Form.Label
                                    className='ms-1'
                                >
                                    By clicking 'Confirm Order', I acknowledge that I have read
                                    and agreed to the terms and conditions outlined in the
                                    pre-information form and the
                                    <span
                                        className='fw-bold ms-1'
                                        onClick={handleShowModals}>distance sales contract</span>.</Form.Label>
                            </div>
                        </Form>
                    </Card>
                    <Card className='h-auto w-100 d-flex justif-content-between border'>
                        <div className='d-flex justify-content-between w-100 p-2'>
                            <h4 className=''>Products  </h4>
                            <h4>${totalPrice}</h4>
                        </div>
                        <div className='d-flex justify-content-between w-100 p-2'>
                            <h4>Shipping</h4>
                            <h4>{shipping === 0 ? <s>{shipping}</s> : shipping}</h4>
                        </div>
                    </Card>
                </Col >


                <Offcanvas show={showA} onHide={handleCloseA} placement='end'>
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body>
                        {contentA === 'initialA' && (
                            <div >
                                <div className='d-flex align-items-center'>
                                    <Button variant='outline-warning'
                                        size='xl'
                                        onClick={() => setContentA('newA')}>
                                        + Add New Cart</Button>
                                    <Offcanvas.Title className='ms-auto'>My Cart</Offcanvas.Title>
                                </div>

                                <div>
                                    <ExistingCreditCard onSelectedCart={handleSelectedCard} />
                                </div>
                            </div>
                        )}
                        {contentA === 'newA' && (
                            <CreditCart onBackToOffCanvasMenuA={handeBackToInitialA} />
                        )}
                    </Offcanvas.Body>
                </Offcanvas>

                <Offcanvas show={showB} onHide={handleCloseB} placement='end'>
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body>
                        {contentB === 'initialB' && (
                            <div >
                                <div className='d-flex align-items-center'>
                                    <Button variant='outline-warning'
                                        size='lg'
                                        onClick={() => setContentB('newB')}>
                                        + Add New Address</Button>
                                    <Offcanvas.Title className='ms-auto'>My Address</Offcanvas.Title>
                                </div>

                                <div>
                                    <ExistingAddress onSelectedAddress={handleAddressSelected} />
                                </div>
                            </div>
                        )}
                        {contentB === 'newB' && (
                            <Address onBackToOffCanvasMenuB={handeBackToInitialB} />
                        )}
                    </Offcanvas.Body>
                </Offcanvas>

                <Modal
                    show={showModals}
                    onHide={handleCloseModals}
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Distance Sales Agreement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div
                            style={{ maxHeight: '400px', overflowY: 'auto' }}
                            dangerouslySetInnerHTML={{ __html: contrantTerms }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModals}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Row >
        </Container >
    )
}

export default Payment