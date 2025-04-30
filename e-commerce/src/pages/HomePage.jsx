import React, { useEffect, useState } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function HomePage() {
    // fade-in animations states
    const [isShown, setIsShown] = useState(false)

    useEffect(() => {
        setIsShown(true)
    }, [])
    return (
        <div >
            <Container fluid >
                <Row
                    className='align-items-center '
                    style={{ background: '#F9F9F9' }}
                >
                    <Col sm={12} md={4} lg={4} className='d-flex'>
                        <div className='first-col mx-auto '>
                            Lorem İpsum 😍
                            <h2>Trendy <br /> <span className='fs-1'>Collection </span></h2>
                            <p className='w-75 text-custom mb-3'>Seedily say has suitable disposal and boy Exerise joy man chidren rejoiced</p>
                            <div className='mt-4 mx-auto'>
                                <Button
                                    as={Link}
                                    to={'/category/men/all'}
                                    variant='danger'
                                    className='p-4 border rounded'>Start Shopping</Button>
                            </div>
                            <div className='d-flex gap-5 w-100 mt-4'>
                                <div>
                                    <h1>100K</h1>
                                    <p>Happy Castomer</p>
                                </div>
                                <div>
                                    <h1>1.6M</h1>
                                    <p>Month Traffic</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={4} lg={4} >
                        <Link to={`product/mens-sports-shoes-whiteblack`}>
                            <img
                                className='d-flex img-fluid'
                                src="https://image.hm.com/assets/hm/00/0c/000c9a34bc107c1043970c9dbc18d4fdbc65de94.jpg?imwidth=564"
                                alt="" />
                        </Link>
                    </Col>
                    <Col sm={12} md={4} lg={4} className='d-flex flex-column justfy-content-evenly'>
                        <div className='mx-auto mb-5'>
                            <Card className='mb-4 h-auto '>
                                <h1 className='text-danger '>14K +</h1>
                                <p>Worldwide Product</p>
                                <p>Sale Per Year</p>
                            </Card>
                        </div>
                        <div className='ms-3'>
                            <h3 className='ms-2'>Special Offer</h3>
                            <h2>Fashion <br />Sale</h2>
                        </div>
                    </Col>
                </Row>

                <Row className={`position-relative w-100 d-flex ${isShown ? `fade-in` : ''}`}>

                    <div className="horizontal-divider"></div>
                    {/* Left Side */}
                    <Col md={6} lg={6} className="product-section ">
                        <img
                            src="https://image.hm.com/assets/hm/22/6c/226c8564dbe8a170df267ff540cd07b906382a54.jpg?imwidth=564"
                            alt="Men Trousers"
                            className="w-100"
                        />
                        <div className="product-info">
                            <h2>MEN TROUSERS</h2>
                            <Button
                                variant="outline-dark"
                                as={Link}
                                to={`/product/loose-fit-sweatshirt`}
                                className="mt-3">
                                See product <FontAwesomeIcon className='ms-2 ' icon={faArrowRight} size='lg' />
                            </Button>
                        </div>
                    </Col>
                    {/* Right Side */}
                    <div className="horizontal-divider"></div>

                    <Col md={6} lg={6} className="product-section">
                        <div className="image-container">
                            <img
                                src="https://static.zara.net/assets/public/746b/0f7a/9d7e49e99290/bbc92ab7ed44/02142140401-e1/02142140401-e1.jpg?ts=1725275203963&w=850"
                                alt="Man Jacket"
                                className="w-100"
                            />
                            <div className="product-info">
                                <h2>Women Dress</h2>
                                <Button
                                    variant="outline-dark"
                                    as={Link}
                                    to={`/product/pleated-knitwear-mini-dress-12162024-0101`}
                                    className="mt-3">
                                    See product <FontAwesomeIcon className='ms-2 ' icon={faArrowRight} size='lg' />
                                </Button>
                            </div>
                        </div>
                    </Col>

                    {/* Ortadaki Dikey Çizgi */}
                    <div className="vertical-divider"></div>
                </Row>

            </Container>
        </div>
    )
}

export default HomePage