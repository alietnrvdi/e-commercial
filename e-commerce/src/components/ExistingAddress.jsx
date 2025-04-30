import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { removeAddress } from '../store/address';
import { Button } from 'react-bootstrap';

function ExistingAddress({ onSelectedAddress }) {
    // If more than one address is available for address selection, state to select among them.
    const [selectedAddress, setSelectedAddres] = useState('');
    // Get a address store check redux 
    const creditItems = useSelector(state => state.address.items);
    const dispatch = useDispatch();

    // Select address 
    const handleAddressSelected = (address) => {
        setSelectedAddres(address.streetAddress);
        onSelectedAddress(address)
    }
    // Remove address
    const handleRemoveAddress = (item) => {
        // Remove address in the redux store
        dispatch(removeAddress(item))
        // İf remove  address redux store.  delete session storage remove address field
        sessionStorage.removeItem('address');
        if (selectedAddress === item.streetAddress) {
            setSelectedAddres('')
        }

    }
    return (
        <>
            <ul className='list-unstyled'>
                {creditItems.map((item, index) => (
                    <li key={index} className="border rounded  mt-2 p-2">
                        <div className="d-flex" >
                            <div className="">
                                <input type="radio"
                                    id={`address-${index}`}
                                    name="selectedAddress"
                                    value={item.selectAddress}
                                    checked={selectedAddress === item.streetAddress}
                                    onChange={() => handleAddressSelected(item)}
                                    className='' />
                            </div>

                            <p className="mx-auto text-primary ">
                                {item.addressName}
                            </p>

                            <p className='me-2 p-1'>
                                <span>{item.district}/</span>
                                <span>{item.city}</span>
                                <span className='d-flex ms-2 fw-1'>{item.country}</span>
                                <Button onClick={() => handleRemoveAddress(item)}>delete</Button>
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </>

    )
}

export default ExistingAddress