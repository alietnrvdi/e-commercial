import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Form, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTruck } from '@fortawesome/free-solid-svg-icons';
import { clearCart, removeToCart, uptadeQuantity } from '../store/cartSlice';

const Basket = () => {
    // Get redux 'cart'
    const cartItems = useSelector((state) => state.cart.items);
    const isCartEmpty = cartItems.length === 0;
    // get redux states
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Create shipping, message and grand Total variable for show Total
    const [shipping, setShipping] = useState(10);
    const [message, setMessage] = useState(null)
    const [grandTotal, setGrandTotal] = useState(0);

    // Calculate discount percent price
    const calculateDiscountPercentNinety = (price) => price - (price * 0.10);
    const calculateDiscountPercentTen = (price) => price - (price * 0.90)
    // Total amount discount and total amount
    const calculateTotals = (cartItems) => {
        const updatedProducts = cartItems.map(product => {
            const discountPrice = calculateDiscountPercentNinety(product.price);
            const discauntPersent = calculateDiscountPercentTen(product.price) * product.quantity
            const totalPrice = discountPrice * product.quantity;
            return {
                ...product,
                discountPrepare: discauntPersent.toFixed(2),
                totalPrice: totalPrice.toFixed(2)
            };
        });
        // Get a totalPrice with reduce methot and calculate sub Total
        const subTotal = updatedProducts.reduce((acc, product) => acc + parseFloat(product.totalPrice), 0).toFixed(2);
        // Get a discount price with reduce methot and calculate discount Total
        const discountTotal = updatedProducts.reduce((acc, product) => acc + product.price * 0.10 * (product.quantity), 0).toFixed(2);
        // return 0 if shipping amount is greater than 50 or return 10 if less
        let shipping = subTotal > 50 ? 0 : 10;
        // grandTotal subTotal+shipping
        const grandTotalx = parseFloat(subTotal) + parseFloat(shipping);
        return { updatedProducts, subTotal, discountTotal, shipping, grandTotalx };
    };
    // Destructuring to assignment use
    const { updatedProducts, discountTotal, subTotal } = calculateTotals(cartItems)

    // Side effect managament grandTotalx and shipping if amount changes to render set shipping and grandTotal
    useEffect(() => {
        const { shipping, grandTotalx } = calculateTotals(cartItems)
        setShipping(shipping);
        setGrandTotal(grandTotalx);
        // İf shipping equal zero return message 
        if (shipping === 0) {
            setMessage(

                <div className='d-flex justify-content-end align-items-center'>
                    <FontAwesomeIcon icon={faTruck} style={{ color: "#74C0FC", }} className='me-2' />
                    Free Shipping!</div>

            )
        } else {
            // Shipping is not free
            setMessage(
                <div >
                    <FontAwesomeIcon icon={faTruck} style={{ color: "#74C0FC", }} />
                    Free Shipping! When you spend over USD 50, shipping is free!
                </div>
            )
        }
    }, [cartItems])
    // Basket items remove
    const handleRemoveItem = (item) => {
        if (item && item.id && item.size) {
            // using dispatch in the removeToCart 'redux cart slice'
            dispatch(removeToCart({
                id: item.id,
                size: item.size
            }))
        }
    }

    const handleAllClear = () => {
        dispatch(clearCart())
    }

    const handleQuantityChange = (e, item) => {
        const newQuantity = parseInt(e.target.value)
        if (item && item.id && item.size) {
            dispatch(uptadeQuantity({
                id: item.id,
                size: item.size,
                quantity: newQuantity
            }))
        }
    }
    return (
        <div className="my-5">
            <Row>
                {/* Ürünler Tablosu */}
                <Col md={8} >
                    <h4>Product</h4>
                    <Table responsive className="align-middle">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {updatedProducts.map((item, idx) => {
                                return (<tr key={idx}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                style={{ width: '120px', height: '120px', objectFit: 'cover ', cursor: 'pointer' }}
                                                className="img-fluid"
                                                onClick={() =>
                                                    navigate(`/product/${item.slug}?size=${item.size}&color=${item.color}`)
                                                }
                                            />
                                            <div className='ms-1 p-2' >
                                                <h6>{item.name}</h6>
                                                <p>Color: {item.color}</p>
                                                <p>Size: {item.size}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {!item.discountPrepare < item.price && (
                                            <div>
                                                <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>{''}
                                                <span className="d-flex text-danger">${item.discountPrepare}</span>
                                            </div>
                                        )}
                                        {!item.discountPrepare && <span>${item.price}</span>}
                                    </td>
                                    <td>
                                        <Form.Control
                                            as="select"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(e, item)}
                                            style={{ width: '60px' }}
                                        >
                                            {[...Array(10).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </td>
                                    <td>${item.totalPrice}</td>
                                    <td>
                                        <Button variant="outline-danger" onClick={() => handleRemoveItem(item)}>
                                            <FontAwesomeIcon icon={faTrash} style={{ color: "#000", }} />
                                        </Button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <div className='d-flex justify-content-end align-items-center '>
                        <Button
                            className='d-flex align-items-center'
                            variant='danger'
                            onClick={() => handleAllClear()}>Clear All
                            <FontAwesomeIcon icon={faTrash} style={{ color: "#000", marginLeft: '15px' }} />
                        </Button>
                    </div>

                </Col>

                {/* Order Summary */}
                <Col md={4}>
                    <div className="border p-4 rounded">
                        <h4>Order Summary</h4>
                        <div className="d-flex justify-content-between">
                            <p>Sub Total</p>
                            <p>${subTotal}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p>Total Discount</p>
                            <p className="text-danger">${discountTotal}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p >Shipping</p>
                            <p >${shipping}</p>
                        </div>
                        {message}
                        <hr />
                        <div className="d-flex justify-content-between">
                            <h5>Grand Total</h5>
                            <h5>${grandTotal}</h5>
                        </div>

                        <Button
                            disabled={isCartEmpty}
                            className="mt-3 w-100" variant="primary" as={Link} to="/basket/payment">
                            Proceed to Checkout
                        </Button>
                        <div className='d-flex mt-2 justify-content-center text-danger'>
                            {isCartEmpty ? 'Bag is cannot be empty    ' : ''}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Basket;
