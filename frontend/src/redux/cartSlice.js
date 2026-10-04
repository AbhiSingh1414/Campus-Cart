import { createSlice } from '@reduxjs/toolkit';

const loadCartItems = () => {
  try {
    const savedItems = localStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  } catch {
    return [];
  }
};

const initialState = {
  cartItems: loadCartItems(),
};

const persistCart = (cartItems) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch {
    // The cart still works for the current session if storage is unavailable.
  }
};

const getId = (item) => item._id ?? item.id;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Adds one unit, or increments the quantity if the item is already present.
    addToCart: (state, action) => {
      const product = action.payload;
      const productId = getId(product);
      const existingItem = state.cartItems.find(
        (item) => String(getId(item)) === String(productId),
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity ?? 1) + 1;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }

      persistCart(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => String(getId(item)) !== String(productId),
      );
      persistCart(state.cartItems);
    },

    // Set a quantity directly; zero or a negative value removes the item.
    setCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      if (!Number.isFinite(quantity) || quantity <= 0) {
        state.cartItems = state.cartItems.filter(
          (item) => String(getId(item)) !== String(productId),
        );
      } else {
        const item = state.cartItems.find(
          (cartItem) => String(getId(cartItem)) === String(productId),
        );
        if (item) item.quantity = Math.floor(quantity);
      }

      persistCart(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      persistCart(state.cartItems);
    },
  },
});

export const { addToCart, removeFromCart, setCartItemQuantity, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartItemCount = (state) =>
  state.cart.cartItems.reduce((total, item) => total + (item.quantity ?? 1), 0);
export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce(
    (total, item) => total + Number(item.price ?? 0) * (item.quantity ?? 1),
    0,
  );

export default cartSlice.reducer;
