// Development helpers for testing loading states

export const addDevDelay = (ms = 2000) => {
    if (import.meta.env.DEV) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    return Promise.resolve();
};

// Usage example:
// In your API calls:
// export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
//   try {
//     await addDevDelay(2000); // 2 second delay in development
//     const response = await axiosInstance.post('/api/v1/user/register', userData, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(handleApiError(error));
//   }
// });
