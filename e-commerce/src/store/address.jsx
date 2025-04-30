import { createSlice } from "@reduxjs/toolkit";
// Created for user addres store
const addRess = createSlice({
    name: 'address',
    initialState: {
        items: [],
    }, reducers: {
        // Add new address
        addAddress(state, action) {
            // Get information about a user's address and pass it to the new Address variable
            const newAddress = action.payload
            const existingItem = state.items.find(item => item.streetAddress === newAddress.streetAddress);
            // İf not a existing item will be to a push state.items
            if (!existingItem) {
                state.items.push({
                    district: newAddress.district,
                    addressName: newAddress.addressName,
                    streetAddress: newAddress.streetAddress,
                    city: newAddress.city,
                    zipCode: newAddress.zipCode,
                    country: newAddress.country
                })
                const updateAddres = [...state.items];
                // Add to session storage
                sessionStorage.setItem('address', JSON.stringify(updateAddres))
            } else {
            }
        },
        // Will be select address 
        selectAddressRedux(state, action) {
            state.selectedAddressDefault = action.payload
        },
        // Remove address
        removeAddress(state, action) {
            const address = action.payload;
            // if item.streetaddress field not equal addres.streetaddress find
            state.items = state.items.filter(items => items.streetAddress !== address.streetAddress)
            // Update session storage
            sessionStorage.setItem('address', JSON.stringify(state.items))
        }
    }
})
// Export to use 
export const { addAddress, selectAddressRedux, removeAddress } = addRess.actions;
export default addRess.reducer