import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slice/authSlice'
import projectReducer from './Slice/projectSlice'
import profileReducer from './Slice/profileSlice'
import applicationReducer from './Slice/applicationSlice'
import gigReducer from './Slice/gigSlice'
console.log('store loaded');
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    profile: profileReducer,
    applications: applicationReducer,
    gigs: gigReducer,
  },
})