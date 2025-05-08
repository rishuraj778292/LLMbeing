import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../UTILS/axiosInstance';

console.log('authSlice loaded');

// Utility to extract error message
const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  throw new Error(message);
};

// ───── Async Thunks ─────

// Signup
export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/register', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Login
export const login = createAsyncThunk('auth/login', async (userCredentials, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/login', userCredentials, {
      withCredentials: true,
    });
    return response.data.data.response;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  console.log("recieved from navbar")
  try {
    await axiosInstance.get('/api/v1/user/logout', { withCredentials: true });
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Verify User
export const verifyme = createAsyncThunk('auth/verifyme', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/api/v1/user/verifyUser', {
      withCredentials: true,
    });
    return response.data.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// ───── Initial State ─────

const initialState = {
  user: null,
  isAuthenticated: false,

  // Statuses
  loginStatus: 'idle',
  signupStatus: 'idle',
  verifyStatus: 'idle',
  logoutStatus: 'idle',

  // Errors
  loginError: null,
  signupError: null,
  verifyError: null,
  logoutError: null,
};

// ───── Slice ─────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ───── Login ─────
      .addCase(login.pending, (state) => {
        state.loginStatus = 'loading';
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginStatus = 'succeeded';
        state.loginError = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.loginError = action.payload;
        state.isAuthenticated = false;
      })

      // ───── Signup ─────
      .addCase(signup.pending, (state) => {
        state.signupStatus = 'loading';
        state.signupError = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.signupStatus = 'succeeded';
        state.signupError = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupStatus = 'failed';
        state.signupError = action.payload;
      })

      // ───── VerifyMe ─────
      .addCase(verifyme.pending, (state) => {
        state.verifyStatus = 'loading';
        state.verifyError = null;
      })
      .addCase(verifyme.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.verifyStatus = 'succeeded';
        state.verifyError = null;
      })
      .addCase(verifyme.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.verifyStatus = 'failed';
        state.verifyError = action.payload;
      })

      // ───── Logout ─────
      .addCase(logout.pending, (state) => {
        state.logoutStatus = 'loading';
        state.logoutError = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.logoutStatus = 'succeeded';
        state.logoutError = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = 'failed';
        state.logoutError = action.payload;
      });
  },
});

export default authSlice.reducer;
