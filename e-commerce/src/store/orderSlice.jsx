import { createSlice } from "@reduxjs/toolkit";

// User orders  page
const orderSlice = createSlice({
    name: "order-history",
    initialState: {
        items: [],
    }, reducers: {
        setOrders(state, action) {
            state.items = action.payload;
        }
    }
})

export const { setOrders } = orderSlice.actions
export default orderSlice.reducer;