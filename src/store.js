import { configureStore } from '@reduxjs/toolkit'
import restaurantReducer from './redux/slices/restaurantSlice'

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
  },
})