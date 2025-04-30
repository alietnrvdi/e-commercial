import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import creditCardReducer from './creditCartSlice'
import addressReducer from './address'
import orderReducer from './orderSlice'

const savedCards = sessionStorage.getItem('credit');
const initialCards = savedCards ? JSON.parse(savedCards) : [];

const savedAddress = sessionStorage.getItem('address');
const initialAddress = savedAddress ? JSON.parse(savedAddress) : [];

// İnitial to be made when starting redux
const store = configureStore({
    reducer: {
        // All redux store 
        cart: cartReducer,
        credit: creditCardReducer,
        address: addressReducer,
        order: orderReducer,
    },
    // İnitial in page get be session storage
    preloadedState: {
        credit: {
            items: Array.isArray(initialCards) ? initialCards : [],
        },
        address: {
            items: Array.isArray(initialAddress) ? initialAddress : [],
        }
    }
});

export default store;