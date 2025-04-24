import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated :false,
    user: null,
    loading:false,
}

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state,action) => {
            state.user = action.payload;
            state.isAuthenticated=true;
            state.loading=false;
        },
        logout:(state)=>{
            state.user = null;
            state.isAuthenticated=false;
            state.loading=false;
        },
        loading:(state,action)=>{

        }
    },
})

// Action creators are generated for each case reducer function
export const { login , logout , loading } = userSlice.actions

export default userSlice.reducer