import { createSlice } from "@reduxjs/toolkit"
import { processDoneMessage } from "../toasts";

const initialState = {
    purchasesCount: 0,
    purchasesInfo: [],
}

const purchasesAnalysis = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push({ ...action.payload, quantity: 1 });
            state.isEmpty = false;
            processDoneMessage('Added To Cart');
        },
        increaseProductQuantity: (state, action) => {
            const productIndex = state.cart.findIndex(p => p.id === action.payload.id);
            const currentProduct = state.cart[productIndex];
            const new_quantity = Math.min(currentProduct.quantity + 1, action.payload.quantity);

            state.cart[productIndex] = {
                ...currentProduct,
                quantity: new_quantity,
                price: (currentProduct.price / currentProduct.quantity) * (new_quantity),
            }
        },
        decreaseProductQuantity: (state, action) => {
            const productIndex = state.cart.findIndex(p => p.id === action.payload);
            const currentProduct = state.cart[productIndex];
            const new_quantity = Math.max(currentProduct.quantity - 1, 1);

            state.cart[productIndex] = {
                ...currentProduct,
                quantity: new_quantity,
                price: (currentProduct.price / currentProduct.quantity) * (new_quantity),
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(p => p.id !== action.payload);
            state.isEmpty = state.cart.length === 0;
            processDoneMessage('Removed From Cart');
        },
        clearCart: state => {
            // state.cart = initialState.cart;
            // state.isEmpty = initialState.isEmpty;
            state.cart = [];
            state.isEmpty = true;
            processDoneMessage('Now cart is empty');
        },
    }
});

export const { addToCart, increaseProductQuantity, decreaseProductQuantity, removeFromCart, clearCart } = purchasesAnalysis.actions;
export default purchasesAnalysis.reducer;