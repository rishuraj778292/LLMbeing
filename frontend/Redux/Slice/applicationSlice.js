// src/redux/slices/applicationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../src/services/applicationService';

// Utility function to handle API errors
const handleApiError = (error) => {
    const message =
        error.response?.data?.message || error.message || 'Something went wrong';
    throw new Error(message);
};

// Async Thunks

// Apply to project
export const applyToProject = createAsyncThunk(
    'applications/applyToProject',
    async ({ projectId, applicationData }, thunkAPI) => {
        try {
            const response = await applicationService.applyToProject(projectId, applicationData);
            return { projectId, application: response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Edit application
export const editApplication = createAsyncThunk(
    'applications/editApplication',
    async ({ applicationId, applicationData }, thunkAPI) => {
        try {
            const response = await applicationService.editApplication(applicationId, applicationData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Withdraw application
export const withdrawApplication = createAsyncThunk(
    'applications/withdrawApplication',
    async (applicationId, thunkAPI) => {
        try {
            const response = await applicationService.withdrawApplication(applicationId);
            return { applicationId, ...response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Get user applications
export const getUserApplications = createAsyncThunk(
    'applications/getUserApplications',
    async (params, thunkAPI) => {
        try {
            const response = await applicationService.getUserApplications(params);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Submit project
export const submitProject = createAsyncThunk(
    'applications/submitProject',
    async ({ applicationId, submissionData }, thunkAPI) => {
        try {
            const response = await applicationService.submitProject(applicationId, submissionData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Accept proposal (Client)
export const acceptProposal = createAsyncThunk(
    'applications/acceptProposal',
    async ({ applicationId, acceptanceData }, thunkAPI) => {
        try {
            const response = await applicationService.acceptProposal(applicationId, acceptanceData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Reject proposal (Client)
export const rejectProposal = createAsyncThunk(
    'applications/rejectProposal',
    async ({ applicationId, rejectionData }, thunkAPI) => {
        try {
            const response = await applicationService.rejectProposal(applicationId, rejectionData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Get project applications (Client)
export const getProjectApplications = createAsyncThunk(
    'applications/getProjectApplications',
    async ({ projectId, params }, thunkAPI) => {
        try {
            const response = await applicationService.getProjectApplications(projectId, params);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Get client applications
export const getClientApplications = createAsyncThunk(
    'applications/getClientApplications',
    async (params, thunkAPI) => {
        try {
            const response = await applicationService.getClientApplications(params);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Approve completion (Client)
export const approveCompletion = createAsyncThunk(
    'applications/approveCompletion',
    async ({ applicationId, approvalData }, thunkAPI) => {
        try {
            const response = await applicationService.approveCompletion(applicationId, approvalData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleApiError(error));
        }
    }
);

// Initial state
const initialState = {
    applications: [],
    currentApplication: null,
    userApplications: [],
    projectApplications: [],
    clientApplications: [],
    appliedProjectIds: [], // Track applied project IDs for filtering
    status: 'idle',
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    },
    filters: {
        status: '',
        projectId: ''
    },
    submitStatus: null, // For tracking application submission
};

// Create slice
const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        clearApplicationError: (state) => {
            state.error = null;
        },
        clearSubmitStatus: (state) => {
            state.submitStatus = null;
        },
        setApplicationFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetApplications: (state) => {
            state.applications = [];
            state.pagination = initialState.pagination;
        },
        // Add applied project ID to track what user has applied to
        addAppliedProjectId: (state, action) => {
            if (!state.appliedProjectIds.includes(action.payload)) {
                state.appliedProjectIds.push(action.payload);
            }
        },
        // Remove applied project ID when withdrawn
        removeAppliedProjectId: (state, action) => {
            state.appliedProjectIds = state.appliedProjectIds.filter(id => id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Apply to project
            .addCase(applyToProject.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.submitStatus = 'submitting';
            })
            .addCase(applyToProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.submitStatus = 'success';
                state.appliedProjectIds.push(action.payload.projectId);
                state.userApplications.unshift(action.payload.application);
            })
            .addCase(applyToProject.rejected, (state, action) => {
                state.status = 'failed';
                state.submitStatus = 'error';
                state.error = action.payload?.message || 'Failed to submit application';
            })

            // Edit application
            .addCase(editApplication.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(editApplication.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.userApplications.findIndex(app => app._id === action.payload._id);
                if (index !== -1) {
                    state.userApplications[index] = action.payload;
                }
            })
            .addCase(editApplication.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to edit application';
            })

            // Withdraw application
            .addCase(withdrawApplication.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(withdrawApplication.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { applicationId } = action.payload;
                // Find the application before removing it to get project ID
                const application = state.userApplications.find(app => app._id === applicationId);
                if (application) {
                    // Remove from applied project IDs - handle both populated and non-populated project
                    const projectId = application.project._id || application.project;
                    state.appliedProjectIds = state.appliedProjectIds.filter(id => id !== projectId);
                }
                // Remove the application from the list
                state.userApplications = state.userApplications.filter(app => app._id !== applicationId);
            })
            .addCase(withdrawApplication.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to withdraw application';
            })

            // Get user applications
            .addCase(getUserApplications.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUserApplications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userApplications = action.payload.applications;
                state.pagination = action.payload.pagination;
                // Update applied project IDs - only include active applications (not withdrawn or rejected)
                state.appliedProjectIds = action.payload.applications
                    .filter(app => !['withdrawn', 'rejected'].includes(app.status))
                    .map(app => app.project._id);
            })
            .addCase(getUserApplications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch applications';
            })

            // Submit project
            .addCase(submitProject.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.userApplications.findIndex(app => app._id === action.payload._id);
                if (index !== -1) {
                    state.userApplications[index] = action.payload;
                }
            })
            .addCase(submitProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to submit project';
            })

            // Get project applications (Client)
            .addCase(getProjectApplications.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getProjectApplications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projectApplications = action.payload.applications;
                state.pagination = action.payload.pagination;
            })
            .addCase(getProjectApplications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch project applications';
            })

            // Accept/Reject proposals
            .addCase(acceptProposal.fulfilled, (state, action) => {
                const index = state.projectApplications.findIndex(app => app._id === action.payload._id);
                if (index !== -1) {
                    state.projectApplications[index] = action.payload;
                }
            })
            .addCase(rejectProposal.fulfilled, (state, action) => {
                const index = state.projectApplications.findIndex(app => app._id === action.payload._id);
                if (index !== -1) {
                    state.projectApplications[index] = action.payload;
                }
            })

            // Get client applications
            .addCase(getClientApplications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.clientApplications = action.payload.applications;
                state.pagination = action.payload.pagination;
            });
    },
});

export const {
    clearApplicationError,
    clearSubmitStatus,
    setApplicationFilters,
    resetApplications,
    addAppliedProjectId,
    removeAppliedProjectId
} = applicationSlice.actions;

export default applicationSlice.reducer;
