import { createSlice } from '@reduxjs/toolkit'
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

const getInitialCart = () => {
    // Get initializion and get cookie 'cart'
    const cookieCart = cookies.get('cart');
    if (cookieCart) {
        return cookieCart
    } else {
        return [];
    }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: getInitialCart(),
        totalQuantity: getInitialCart().reduce((acc, item) => acc + item.quantity, 0),
        // Uniqie id number
        uniqueItemCount: new Set(getInitialCart().map(item => `${item.id}-${item.size}-${item.color}`)).size,

    }
    ,
    reducers: {
        // Product and values add for cookie
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item =>
                item.id === newItem.id &&
                item.size === newItem.size &&
                item.color === newItem.color)
            console.log(newItem)
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    slug: newItem.slug,
                    price: newItem.price,
                    size: newItem.size,
                    color: newItem.color,
                    quantity: newItem.quantity || 1,
                    variantImageUrl: newItem.variantImageUrl,
                    thumbnail: newItem.thumbnail
                });
            }

            const limitedData = state.items;

            state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.uniqueItemCount = new Set(state.items.map(item => `${item.id}-${item.size}-${item.color}`)).size
            // Save cookies
            cookies.set('cart', JSON.stringify(limitedData), {
                path: '/', expires:
                    new Date(Date.now() + 604800000)
            })
        },
        // Delete product basket and cookie and return empty array
        removeToCart(state, action) {
            const { id, size } = action.payload
            state.items = state.items.filter(item => !(item.id === id && item.size === size));
            const limitedData = state.items.map(item => ({
                id: item.id,
                name: item.name,
                size: item.size,
                color: item.color,
                imageUrl: item.imageUrl,
                quantity: item.quantity,
            }));

            state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.uniqueItemCount = new Set(state.items.map(item => `${item.id}-${item.size}-${item.color}`)).size;
            // Save cookies
            cookies.set('cart', JSON.stringify(limitedData), { path: '/', expires: new Date(Date.now() + 604800000) });
        },
        // Reduce product quantity
        uptadeQuantity(state, action) {
            const { id, size, quantity } = action.payload;
            const item = state.items.find(item => item.id === id && item.size === size)
            if (item) {
                item.quantity = quantity;
            }
            // Save Cookie
            cookies.set('cart', JSON.stringify(state.items), {
                path: '/', expires:
                    new Date(Date.now() + 604800000)
            })
        },
        // Delete all product,cookie and return empty array
        clearCart(state) {
            state.items = []
            state.totalQuantity = 0
            state.uniqueItemCount = 0
            cookies.remove('cart')
        }
    },
});
// export to all redux funcinality
export const { addToCart, removeToCart, clearCart, uptadeQuantity } = cartSlice.actions;
export default cartSlice.reducer;