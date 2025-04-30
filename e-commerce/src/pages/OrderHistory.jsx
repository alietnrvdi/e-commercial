import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../store/Firebase';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
    // useAuth custom hook
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setOrders([]);
                setLoading(false);
                return;
            }
            try {
                const orderRef = collection(db, 'users', user.uid, 'orders');
                const querySnapshot = await getDocs(orderRef);
                const orderList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(orderList);
            } catch (error) {
                console.error(`Error fetching orders: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleProductClick = (item) => {
        const { slug, color, selectedSize } = item;
        navigate(`/product/${slug}?size=${selectedSize}&color=${color}`)
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {orders.map((order) => (
                <Row key={order.id} className='d-flex p-3 justify-content-center'>

                    <Col sm={6} md={4} lg={4} className=' border rounded bg-light p-4'>

                        <p className='text-custom'>Order ID </p>
                        <p className='d-flex ' >#{order.id.substring(0, 15)}</p>
                        <div className="line"></div>
                        <div className='mt-2 p-2'>
                            <p className='text-custom'>Date </p>
                            <span>{new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="line"></div>
                        <div className='my-2 py-2'>
                            <p className='text-custom'>Total Amount</p>
                            <p className='justify-content-end'>${order.totalPrice}</p>
                        </div>
                        <div className="line"></div>

                        <div className='d-flex justify-content-between p-1'>
                            <p className='text-custom'>Order Status</p>
                            <p className={`text-${order.status === 'Delivered' ? 'danger' : 'success'}`}>{order.status}</p>
                        </div>
                    </Col>

                    <Col sm={6} md={8} lg={8} className='d-flex flex-column justify-content-center border rounded p-3'>
                        {order.items.map((subItem, sIdx) => (
                            <Row key={sIdx} className='mb-4'>
                                <Col md={6} lg={3}
                                    className='d-flex justify-content-center'>
                                    <img
                                        src={subItem.variantImageUrl}
                                        width={150} height={'auto'} alt={sIdx}
                                        style={{ backgroundColor: '#E0E0E0' }}
                                        className='img-fluid'
                                    />
                                </Col>
                                <Col md={6} lg={9} className='mb-'>
                                    <div className='d-flex justify-content-between'>
                                        <p className='fw-bold'>{subItem.name}  </p>
                                        <p>  ${subItem.price}  </p>
                                    </div>
                                    <p> Color: {subItem.color} </p>
                                    <p>Size: {subItem.selectedSize}</p>
                                    <Button
                                        variant='link'
                                        className='text-decoration-none'
                                        onClick={() => handleProductClick(subItem)}>
                                        View Product
                                    </Button>

                                </Col>
                            </Row>
                        ))}
                        <div className="line"></div>
                        <Row className="mt-2">
                            <Col className="d-flex gap-3">
                                <div style={{ height: '2px', backgroundColor: 'red', margin: '1rem' }} />

                            </Col>
                        </Row>
                    </Col>
                </Row>
            ))}

        </>
    );
}

export default OrderHistory;
