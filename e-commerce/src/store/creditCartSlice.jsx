import { createSlice } from "@reduxjs/toolkit";

// Credit cart Redux Store
const creditCardSlice = createSlice({
    name: 'credit',
    initialState: {
        // İnitial state is a empty array in items variable
        items: [],
    },
    reducers: {
        // Add the new credit cart value
        addCreditCard(state, action) {
            // Transfered in newCart variable
            const newCart = action.payload;
            // if array to find cardNumber
            if (Array.isArray(state.items)) {
                const existingItem = state.items.find(item => item.cardNumber === newCart.cardNumber);
                // İf not exist to push
                if (!existingItem) {
                    state.items.push({
                        cardNumber: newCart.cardNumber,
                        cardholderName: newCart.cardholderName,
                        expirationDate: newCart.expirationDate,
                        cvc: newCart.cvc,
                    });
                }
                // Transfered updateCards with the rest operator
                const updateCards = [...state.items]
                // Add or update credit cart sesssion storage with updateCards variable
                sessionStorage.setItem('credit', JSON.stringify(updateCards))
            } else {
            }
        },
        // Remove the credit cart in redux store
        removeCreditCart(state, action) {
            const cart = action.payload
            // To be find not equal cardNumber
            state.items = state.items.filter(items => !(items.cardNumber === cart.cardNumber))
            // Update 'credit' session storage
            sessionStorage.setItem('credit', JSON.stringify(state.items))
        }
    }
})
// Export to use
export const { addCreditCard, removeCreditCart } = creditCardSlice.actions;
export default creditCardSlice.reducer;