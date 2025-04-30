import React, { useEffect } from 'react'
import { Alert, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { clearCart } from '../store/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function OrderSuccessfull() {
    const location = useLocation()
    const { orderId, totalPrice } = location.state || {};
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(clearCart())
    }, [dispatch])
    return (
        <>
            <div className='successful-container'>
                <div className='vh-100 d-flex align-items-center'>
                    <Alert className='w-75 h-25  mx-auto align-items-center customGradiant'>
                        <div>
                            <p className='text-center'>
                                Order Successfull
                                <FontAwesomeIcon icon={faCheck}
                                    className='ms-3 '
                                    size='2xl'
                                    style={{ color: "#FFB43B", }} />
                            </p>
                            <p>Order ID: {orderId}</p>
                            <p>Total Price: {totalPrice}</p>
                            <div className='d-flex'>
                                <Link to={'/order-history'} className='mx-auto'>
                                    <Button type='button'
                                        className=''>Go check to order status</Button>
                                </Link>
                            </div>
                        </div>
                    </Alert>
                </div>
            </div>
        </>
    )
}

export default OrderSuccessfull