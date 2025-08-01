import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../src/services/applicationService';

// Async Thunks for Application Operations

// Apply to project (Freelancer only)
export const applyToProject = createAsyncThunk(
    'application/applyToProject',
    async ({ projectId, applicationData }, { rejectWithValue }) => {
        try {
            const response = await applicationService.applyToProject(projectId, applicationData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Edit application (Freelancer only)
export const editApplication = createAsyncThunk(
    'application/editApplication',
    async ({ applicationId, applicationData }, { rejectWithValue }) => {
        try {
            const response = await applicationService.editApplication(applicationId, applicationData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Withdraw application (Freelancer only)
export const withdrawApplication = createAsyncThunk(
    'application/withdrawApplication',
    async (applicationId, { rejectWithValue }) => {
        try {
            const response = await applicationService.withdrawApplication(applicationId);
            return { ...response, applicationId }; // Include applicationId in the response
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get user's applications (Freelancer only)
export const getUserApplications = createAsyncThunk(
    'application/getUserApplications',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await applicationService.getUserApplications(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Submit project (Freelancer only)
export const submitProject = createAsyncThunk(
    'application/submitProject',
    async ({ applicationId, submissionData }, { rejectWithValue }) => {
        try {
            const response = await applicationService.submitProject(applicationId, submissionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Accept application (Client only)
export const acceptApplication = createAsyncThunk(
    'application/acceptApplication',
    async ({ applicationId, acceptanceData }, { rejectWithValue }) => {
        try {
            const response = await applicationService.acceptApplication(applicationId, acceptanceData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Reject application (Client only)
export const rejectApplication = createAsyncThunk(
    'application/rejectApplication',
    async ({ applicationId, rejectionData }, { rejectWithValue }) => {
        try {
            const response = await applicationService.rejectApplication(applicationId, rejectionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get project applications (Client only)
export const getProjectApplications = createAsyncThunk(
    'application/getProjectApplications',
    async ({ projectId, params = {} }, { rejectWithValue }) => {
        try {
            const response = await applicationService.getProjectApplications(projectId, params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get client applications (Client only)
export const getClientApplications = createAsyncThunk(
    'application/getClientApplications',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await applicationService.getClientApplications(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Approve completion (Client only)
export const approveCompletion = createAsyncThunk(
    'application/approveCompletion',
    async ({ applicationId, approvalData }, { rejectWithValue }) => {
        try {
            const response = await applicationService.approveCompletion(applicationId, approvalData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    userApplications: [],
    projectApplications: [],
    clientApplications: [],
    appliedProjectIds: [],
    selectedApplication: null,
    loading: false,
    error: null,
    success: null,
    lastInteraction: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    }
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        setSelectedApplication: (state, action) => {
            state.selectedApplication = action.payload;
        },
        clearSelectedApplication: (state) => {
            state.selectedApplication = null;
        },
        resetApplicationState: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Apply to project
            .addCase(applyToProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyToProject.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Application submitted successfully!';
                state.userApplications.unshift(action.payload.data);
                const projectId = action.payload.data.project?._id || action.payload.data.project;
                if (projectId && !state.appliedProjectIds.includes(projectId)) {
                    state.appliedProjectIds.push(projectId);
                }

                // Store projectId for potential use by other components
                state.lastInteraction = {
                    projectId,
                    type: 'apply',
                    timestamp: Date.now()
                };
            })
            .addCase(applyToProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to submit application';
            })

            // Edit application
            .addCase(editApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Application updated successfully!';
                const index = state.userApplications.findIndex(app => app._id === action.payload.data._id);
                if (index !== -1) {
                    state.userApplications[index] = action.payload.data;
                }
                if (state.selectedApplication?._id === action.payload.data._id) {
                    state.selectedApplication = action.payload.data;
                }
            })
            .addCase(editApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update application';
            })

            // Withdraw application
            .addCase(withdrawApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Application withdrawn successfully!';
                const withdrawnApp = state.userApplications.find(app => app._id === action.payload.applicationId);
                state.userApplications = state.userApplications.filter(app => app._id !== action.payload.applicationId);

                // Remove from applied project IDs
                if (withdrawnApp) {
                    const projectId = withdrawnApp.project?._id || withdrawnApp.project;
                    if (projectId) {
                        state.appliedProjectIds = state.appliedProjectIds.filter(id => id !== projectId);
                    }
                }

                if (state.selectedApplication?._id === action.payload.applicationId) {
                    state.selectedApplication = null;
                }
            })
            .addCase(withdrawApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to withdraw application';
            })

            // Get user applications
            .addCase(getUserApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserApplications.fulfilled, (state, action) => {
                state.loading = false;

                // The API might return data in different formats
                console.log('Processing getUserApplications response:', action.payload);

                let applications = [];
                let pagination = {};

                // Format 1: { data: { applications: [], pagination: {} } }
                if (action.payload?.data && action.payload.data.applications) {
                    console.log('Format 1 detected');
                    applications = action.payload.data.applications;
                    pagination = action.payload.data.pagination || {};
                }
                // Format 2: { applications: [], pagination: {} }
                else if (action.payload?.applications) {
                    console.log('Format 2 detected');
                    applications = action.payload.applications;
                    pagination = action.payload.pagination || {};
                }
                // Format 3: { data: [] }
                else if (action.payload?.data && Array.isArray(action.payload.data)) {
                    console.log('Format 3 detected');
                    applications = action.payload.data;
                }
                // Format 4: Direct array []
                else if (Array.isArray(action.payload)) {
                    console.log('Format 4 detected');
                    applications = action.payload;
                }
                // Format 5: Standard API response with data property
                else if (action.payload && typeof action.payload === 'object') {
                    console.log('Format 5 detected');
                    applications = action.payload.data || [];
                    pagination = action.payload.pagination || state.pagination;
                }

                console.log('Processed applications:', applications);

                state.userApplications = applications;
                // Format and deduplicate applied project IDs
                const processedIds = applications
                    .map(app => {
                        // Handle different project reference formats
                        if (!app.project) return null;
                        if (typeof app.project === 'string') return app.project;
                        if (app.project._id) return app.project._id;
                        return null;
                    })
                    .filter(Boolean);

                // Deduplicate IDs
                state.appliedProjectIds = [...new Set(processedIds)];
                state.pagination = pagination;

                console.log('Updated appliedProjectIds:', state.appliedProjectIds);
            })
            .addCase(getUserApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch applications';
            })

            // Submit project
            .addCase(submitProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitProject.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Project submitted successfully!';
                const index = state.userApplications.findIndex(app => app._id === action.payload.data._id);
                if (index !== -1) {
                    state.userApplications[index] = action.payload.data;
                }
                if (state.selectedApplication?._id === action.payload.data._id) {
                    state.selectedApplication = action.payload.data;
                }
            })
            .addCase(submitProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to submit project';
            })

            // Accept application
            .addCase(acceptApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Application accepted successfully!';
                const index = state.projectApplications.findIndex(app => app._id === action.payload.data._id);
                if (index !== -1) {
                    state.projectApplications[index] = action.payload.data;
                }
                if (state.selectedApplication?._id === action.payload.data._id) {
                    state.selectedApplication = action.payload.data;
                }
            })
            .addCase(acceptApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to accept application';
            })

            // Reject application
            .addCase(rejectApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Application rejected successfully!';
                const index = state.projectApplications.findIndex(app => app._id === action.payload.data._id);
                if (index !== -1) {
                    state.projectApplications[index] = action.payload.data;
                }
                if (state.selectedApplication?._id === action.payload.data._id) {
                    state.selectedApplication = action.payload.data;
                }
            })
            .addCase(rejectApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to reject application';
            })

            // Get project applications
            .addCase(getProjectApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectApplications.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.data || action.payload || [];
                state.projectApplications = Array.isArray(data) ? data : [];
                state.pagination = action.payload.pagination || state.pagination;
            })
            .addCase(getProjectApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch project applications';
            })

            // Get client applications
            .addCase(getClientApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClientApplications.fulfilled, (state, action) => {
                state.loading = false;
                // The API might return either { data: applications, pagination: {...} } 
                // or directly { applications: [...], pagination: {...} }
                let applications = [];
                let pagination = {};

                if (action.payload.data && action.payload.data.applications) {
                    applications = action.payload.data.applications;
                    pagination = action.payload.data.pagination || {};
                } else if (action.payload.applications) {
                    applications = action.payload.applications;
                    pagination = action.payload.pagination || {};
                } else if (Array.isArray(action.payload)) {
                    applications = action.payload;
                } else if (Array.isArray(action.payload.data)) {
                    applications = action.payload.data;
                }

                state.clientApplications = applications;
                state.pagination = pagination;
            })
            .addCase(getClientApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch client applications';
            })

            // Approve completion
            .addCase(approveCompletion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveCompletion.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Project completion approved successfully!';
                const index = state.clientApplications.findIndex(app => app._id === action.payload.data._id);
                if (index !== -1) {
                    state.clientApplications[index] = action.payload.data;
                }
                if (state.selectedApplication?._id === action.payload.data._id) {
                    state.selectedApplication = action.payload.data;
                }
            })
            .addCase(approveCompletion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to approve completion';
            });
    }
});

export const {
    clearError,
    clearSuccess,
    setSelectedApplication,
    clearSelectedApplication,
    resetApplicationState
} = applicationSlice.actions;

export default applicationSlice.reducer;