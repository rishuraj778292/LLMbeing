import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../feature/auth/authSlice'
export const store = configureStore({
  reducer: {
    auth: userReducer
  },
})