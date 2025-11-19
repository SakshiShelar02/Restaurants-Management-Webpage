import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import filterReducer from './filterSlice';

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) return undefined;
    return JSON.parse(serializedCart);
  } catch (err) {
    return undefined;
  }
};

const preloadedState = {
  cart: loadCartFromLocalStorage() || { items: [] }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    filter: filterReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const cart = store.getState().cart;
  localStorage.setItem('cart', JSON.stringify(cart));
});

export { store };
export default store;