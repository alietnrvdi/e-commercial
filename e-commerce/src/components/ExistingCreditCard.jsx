import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import '../css/Card.css'
import { useState } from "react"
import { removeCreditCart } from "../store/creditCartSlice"

const ExistingCreditCard = ({ onSelectedCart }) => {
    // If more than one credit cart is available for cart selection, state to select among them.
    const [selected, setSelected] = useState('');
    // Get a redux store for credit cart 
    const creditItems = useSelector(state => state.credit.items);
    const dispatch = useDispatch()

    // Choosen Credit Cart
    const handleCartSelected = (item) => {
        setSelected(item.cardNumber);
        onSelectedCart(item)
    }

    // Redux credit cart and Session Storage both remove and delete
    const handleRemoveCreditCard = (item) => {
        // Get credit cart store removeCreditCart variable for remove a credit cart. 
        dispatch(removeCreditCart(item))
        sessionStorage.removeItem('credit')
        if (selected === item.cardholderName) {
            setSelected('')
        }
    }
    return (
        <ul className='list-unstyled'>
            {creditItems.map((item, index) => (
                <li key={index} className="border rounded  mt-2 p-2">
                    <div className="d-flex" >
                        <div className="">
                            <input type="radio"
                                id={`card-${index}`}
                                name="selectedCard"
                                checked={selected === item.cardNumber}
                                onChange={() => handleCartSelected(item)}
                                className='' />
                        </div>

                        <p className="mx-auto card-number">
                            {item.cardNumber.replace(/\d{14}/, '**************').slice(-19)
                                .replace(/\D/g, '*').replace(/(.{4})/g, '$1 ')}
                        </p>

                        <p>
                            <span>{item.expirationDate}</span>
                            <span className='d-flex ms-2 fw-1'>{item.cardholderName}</span>
                        </p>
                        <div className="ms-auto">
                            <Button
                                variant="outline-danger"
                                onClick={() => handleRemoveCreditCard(item)} >X</Button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>

    )

}

export default ExistingCreditCard