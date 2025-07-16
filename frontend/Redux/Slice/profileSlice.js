import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../UTILS/axiosInstance';

// Utility to extract error message
const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  return message;
};

// ───── Profile Async Thunks ─────

// Get Profile
export const getProfile = createAsyncThunk('profile/getProfile', async (userId = null, thunkAPI) => {
  try {
    const url = userId ? `/api/v1/user/profile/${userId}` : '/api/v1/user/profile';
    const response = await axiosInstance.get(url, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Update Profile
export const updateProfile = createAsyncThunk('profile/updateProfile', async (profileData, thunkAPI) => {
  try {
    const response = await axiosInstance.put('/api/v1/user/profile', profileData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Upload Profile Picture
export const uploadProfilePicture = createAsyncThunk('profile/uploadProfilePicture', async (file, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axiosInstance.post('/api/v1/user/profile/upload-picture', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Experience Operations
export const addExperience = createAsyncThunk('profile/addExperience', async (experienceData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/experience', experienceData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const updateExperience = createAsyncThunk('profile/updateExperience', async ({ experienceId, experienceData }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/api/v1/user/experience/${experienceId}`, experienceData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const deleteExperience = createAsyncThunk('profile/deleteExperience', async (experienceId, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/user/experience/${experienceId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Education Operations
export const addEducation = createAsyncThunk('profile/addEducation', async (educationData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/education', educationData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const updateEducation = createAsyncThunk('profile/updateEducation', async ({ educationId, educationData }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/api/v1/user/education/${educationId}`, educationData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const deleteEducation = createAsyncThunk('profile/deleteEducation', async (educationId, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/user/education/${educationId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Certification Operations
export const addCertification = createAsyncThunk('profile/addCertification', async (certificationData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/certification', certificationData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const updateCertification = createAsyncThunk('profile/updateCertification', async ({ certificationId, certificationData }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/api/v1/user/certification/${certificationId}`, certificationData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const deleteCertification = createAsyncThunk('profile/deleteCertification', async (certificationId, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/user/certification/${certificationId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Portfolio Operations
export const addPortfolioItem = createAsyncThunk('profile/addPortfolioItem', async (portfolioData, thunkAPI) => {
  try {
    const formData = new FormData();

    // Append text fields
    Object.keys(portfolioData).forEach(key => {
      if (key !== 'images' && portfolioData[key] !== undefined) {
        if (Array.isArray(portfolioData[key])) {
          portfolioData[key].forEach(item => formData.append(key, item));
        } else {
          formData.append(key, portfolioData[key]);
        }
      }
    });

    // Append images
    if (portfolioData.images && portfolioData.images.length > 0) {
      portfolioData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await axiosInstance.post('/api/v1/user/portfolio', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const updatePortfolioItem = createAsyncThunk('profile/updatePortfolioItem', async ({ portfolioId, portfolioData }, thunkAPI) => {
  try {
    const formData = new FormData();

    // Append text fields
    Object.keys(portfolioData).forEach(key => {
      if (key !== 'images' && portfolioData[key] !== undefined) {
        if (Array.isArray(portfolioData[key])) {
          portfolioData[key].forEach(item => formData.append(key, item));
        } else {
          formData.append(key, portfolioData[key]);
        }
      }
    });

    // Append new images
    if (portfolioData.images && portfolioData.images.length > 0) {
      portfolioData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await axiosInstance.put(`/api/v1/user/portfolio/${portfolioId}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const deletePortfolioItem = createAsyncThunk('profile/deletePortfolioItem', async (portfolioId, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/user/portfolio/${portfolioId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Language Operations
export const addLanguage = createAsyncThunk('profile/addLanguage', async (languageData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/language', languageData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const updateLanguage = createAsyncThunk('profile/updateLanguage', async ({ languageId, languageData }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/api/v1/user/language/${languageId}`, languageData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const deleteLanguage = createAsyncThunk('profile/deleteLanguage', async (languageId, thunkAPI) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/user/language/${languageId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Verification Operations
export const sendEmailVerification = createAsyncThunk('profile/sendEmailVerification', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/verify-email', {}, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

export const sendPhoneVerification = createAsyncThunk('profile/sendPhoneVerification', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/v1/user/verify-phone', {}, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// Get Profile Completion
export const getProfileCompletion = createAsyncThunk('profile/getProfileCompletion', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/api/v1/user/profile-completion', {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleApiError(error));
  }
});

// ───── Initial State ─────

const initialState = {
  profile: null,
  profileCompletion: {
    completionPercentage: 0,
    completedItems: 0,
    totalItems: 0,
    missingFields: []
  },

  // Loading states
  loading: false,
  uploading: false,

  // Operation specific loading states
  profileLoading: false,
  experienceLoading: false,
  educationLoading: false,
  certificationLoading: false,
  portfolioLoading: false,
  languageLoading: false,
  verificationLoading: false,

  // Error states
  error: null,
  profileError: null,
  experienceError: null,
  educationError: null,
  certificationError: null,
  portfolioError: null,
  languageError: null,
  verificationError: null,

  // Success states
  lastAction: null,
  actionSuccess: false,
};

// ───── Slice ─────

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.profileError = null;
      state.experienceError = null;
      state.educationError = null;
      state.certificationError = null;
      state.portfolioError = null;
      state.languageError = null;
      state.verificationError = null;
    },
    clearActionSuccess: (state) => {
      state.actionSuccess = false;
      state.lastAction = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // ───── Get Profile ─────
      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileLoading = false;
        state.profileError = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })

      // ───── Update Profile ─────
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
        state.actionSuccess = true;
        state.lastAction = 'updateProfile';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───── Upload Profile Picture ─────
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.uploading = false;
        state.error = null;
        state.actionSuccess = true;
        state.lastAction = 'uploadProfilePicture';
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })

      // ───── Experience Operations ─────
      .addCase(addExperience.pending, (state) => {
        state.experienceLoading = true;
        state.experienceError = null;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.experienceLoading = false;
        state.experienceError = null;
        state.actionSuccess = true;
        state.lastAction = 'addExperience';
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.experienceLoading = false;
        state.experienceError = action.payload;
      })

      .addCase(updateExperience.pending, (state) => {
        state.experienceLoading = true;
        state.experienceError = null;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.experienceLoading = false;
        state.experienceError = null;
        state.actionSuccess = true;
        state.lastAction = 'updateExperience';
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.experienceLoading = false;
        state.experienceError = action.payload;
      })

      .addCase(deleteExperience.pending, (state) => {
        state.experienceLoading = true;
        state.experienceError = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.experienceLoading = false;
        state.experienceError = null;
        state.actionSuccess = true;
        state.lastAction = 'deleteExperience';
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.experienceLoading = false;
        state.experienceError = action.payload;
      })

      // ───── Education Operations ─────
      .addCase(addEducation.pending, (state) => {
        state.educationLoading = true;
        state.educationError = null;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.educationLoading = false;
        state.educationError = null;
        state.actionSuccess = true;
        state.lastAction = 'addEducation';
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.educationLoading = false;
        state.educationError = action.payload;
      })

      .addCase(updateEducation.pending, (state) => {
        state.educationLoading = true;
        state.educationError = null;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.educationLoading = false;
        state.educationError = null;
        state.actionSuccess = true;
        state.lastAction = 'updateEducation';
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.educationLoading = false;
        state.educationError = action.payload;
      })

      .addCase(deleteEducation.pending, (state) => {
        state.educationLoading = true;
        state.educationError = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.educationLoading = false;
        state.educationError = null;
        state.actionSuccess = true;
        state.lastAction = 'deleteEducation';
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.educationLoading = false;
        state.educationError = action.payload;
      })

      // ───── Certification Operations ─────
      .addCase(addCertification.pending, (state) => {
        state.certificationLoading = true;
        state.certificationError = null;
      })
      .addCase(addCertification.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.certificationLoading = false;
        state.certificationError = null;
        state.actionSuccess = true;
        state.lastAction = 'addCertification';
      })
      .addCase(addCertification.rejected, (state, action) => {
        state.certificationLoading = false;
        state.certificationError = action.payload;
      })

      .addCase(updateCertification.pending, (state) => {
        state.certificationLoading = true;
        state.certificationError = null;
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.certificationLoading = false;
        state.certificationError = null;
        state.actionSuccess = true;
        state.lastAction = 'updateCertification';
      })
      .addCase(updateCertification.rejected, (state, action) => {
        state.certificationLoading = false;
        state.certificationError = action.payload;
      })

      .addCase(deleteCertification.pending, (state) => {
        state.certificationLoading = true;
        state.certificationError = null;
      })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.certificationLoading = false;
        state.certificationError = null;
        state.actionSuccess = true;
        state.lastAction = 'deleteCertification';
      })
      .addCase(deleteCertification.rejected, (state, action) => {
        state.certificationLoading = false;
        state.certificationError = action.payload;
      })

      // ───── Portfolio Operations ─────
      .addCase(addPortfolioItem.pending, (state) => {
        state.portfolioLoading = true;
        state.portfolioError = null;
      })
      .addCase(addPortfolioItem.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.portfolioLoading = false;
        state.portfolioError = null;
        state.actionSuccess = true;
        state.lastAction = 'addPortfolioItem';
      })
      .addCase(addPortfolioItem.rejected, (state, action) => {
        state.portfolioLoading = false;
        state.portfolioError = action.payload;
      })

      .addCase(updatePortfolioItem.pending, (state) => {
        state.portfolioLoading = true;
        state.portfolioError = null;
      })
      .addCase(updatePortfolioItem.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.portfolioLoading = false;
        state.portfolioError = null;
        state.actionSuccess = true;
        state.lastAction = 'updatePortfolioItem';
      })
      .addCase(updatePortfolioItem.rejected, (state, action) => {
        state.portfolioLoading = false;
        state.portfolioError = action.payload;
      })

      .addCase(deletePortfolioItem.pending, (state) => {
        state.portfolioLoading = true;
        state.portfolioError = null;
      })
      .addCase(deletePortfolioItem.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.portfolioLoading = false;
        state.portfolioError = null;
        state.actionSuccess = true;
        state.lastAction = 'deletePortfolioItem';
      })
      .addCase(deletePortfolioItem.rejected, (state, action) => {
        state.portfolioLoading = false;
        state.portfolioError = action.payload;
      })

      // ───── Language Operations ─────
      .addCase(addLanguage.pending, (state) => {
        state.languageLoading = true;
        state.languageError = null;
      })
      .addCase(addLanguage.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.languageLoading = false;
        state.languageError = null;
        state.actionSuccess = true;
        state.lastAction = 'addLanguage';
      })
      .addCase(addLanguage.rejected, (state, action) => {
        state.languageLoading = false;
        state.languageError = action.payload;
      })

      .addCase(updateLanguage.pending, (state) => {
        state.languageLoading = true;
        state.languageError = null;
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.languageLoading = false;
        state.languageError = null;
        state.actionSuccess = true;
        state.lastAction = 'updateLanguage';
      })
      .addCase(updateLanguage.rejected, (state, action) => {
        state.languageLoading = false;
        state.languageError = action.payload;
      })

      .addCase(deleteLanguage.pending, (state) => {
        state.languageLoading = true;
        state.languageError = null;
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.languageLoading = false;
        state.languageError = null;
        state.actionSuccess = true;
        state.lastAction = 'deleteLanguage';
      })
      .addCase(deleteLanguage.rejected, (state, action) => {
        state.languageLoading = false;
        state.languageError = action.payload;
      })

      // ───── Verification Operations ─────
      .addCase(sendEmailVerification.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.verificationLoading = false;
        state.verificationError = null;
        state.actionSuccess = true;
        state.lastAction = 'sendEmailVerification';
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload;
      })

      .addCase(sendPhoneVerification.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(sendPhoneVerification.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.verificationLoading = false;
        state.verificationError = null;
        state.actionSuccess = true;
        state.lastAction = 'sendPhoneVerification';
      })
      .addCase(sendPhoneVerification.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload;
      })

      // ───── Profile Completion ─────
      .addCase(getProfileCompletion.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileCompletion.fulfilled, (state, action) => {
        state.profileCompletion = action.payload;
        state.loading = false;
      })
      .addCase(getProfileCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearActionSuccess, setProfile } = profileSlice.actions;
export default profileSlice.reducer;
