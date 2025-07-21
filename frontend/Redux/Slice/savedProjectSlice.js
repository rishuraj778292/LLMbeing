import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import savedProjectService from '../../src/services/savedProjectService';

// Async Thunks for Saved Project Operations

// Get user's saved projects
export const fetchSavedProjects = createAsyncThunk(
    'savedProjects/fetchSavedProjects',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await savedProjectService.getUserSavedProjects(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Toggle save/unsave project
export const toggleSaveProject = createAsyncThunk(
    'savedProjects/toggleSaveProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await savedProjectService.toggleSaveProject(projectId);
            return { projectId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Remove a specific saved project
export const removeSavedProject = createAsyncThunk(
    'savedProjects/removeSavedProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await savedProjectService.removeSavedProject(projectId);
            return { projectId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Remove all saved projects
export const removeAllSavedProjects = createAsyncThunk(
    'savedProjects/removeAllSavedProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await savedProjectService.removeAllSavedProjects();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial State
const initialState = {
    savedProjects: [],
    savedProjectIds: [], // For quick lookups, now array for serializability
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    page: 1,
    totalPages: 0,
    total: 0,
    hasMore: false,
    loadingMore: false,
    toggleLoading: {}, // Track loading state for individual project toggles
};

// Saved Projects Slice
const savedProjectsSlice = createSlice({
    name: 'savedProjects',
    initialState,
    reducers: {
        // Reset saved projects state
        resetSavedProjects: (state) => {
            state.savedProjects = [];
            state.savedProjectIds = [];
            state.page = 1;
            state.totalPages = 0;
            state.total = 0;
            state.hasMore = false;
            state.status = 'idle';
            state.error = null;
        },

        // Set loading state for specific project toggle
        setToggleLoading: (state, action) => {
            const { projectId, loading } = action.payload;
            if (loading) {
                state.toggleLoading[projectId] = true;
            } else {
                delete state.toggleLoading[projectId];
            }
        },

        // Clear errors
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Saved Projects
            .addCase(fetchSavedProjects.pending, (state, action) => {
                const isLoadMore = action.meta.arg?.page > 1;
                state.status = isLoadMore ? 'succeeded' : 'loading';
                state.loadingMore = isLoadMore;
                state.error = null;
            })
            .addCase(fetchSavedProjects.fulfilled, (state, action) => {
                const { data } = action.payload;
                const { projects, pagination } = data;
                const isLoadMore = action.meta.arg?.page > 1;

                state.status = 'succeeded';
                state.loadingMore = false;
                state.page = pagination.currentPage;
                state.totalPages = pagination.totalPages;
                state.total = pagination.totalCount;
                state.hasMore = pagination.hasNext;

                if (isLoadMore) {
                    // Append new projects for load more
                    state.savedProjects = [...state.savedProjects, ...projects];
                } else {
                    // Replace projects for new fetch
                    state.savedProjects = projects;
                }

                // Update savedProjectIds array for quick lookups
                state.savedProjectIds = state.savedProjects.map(item => item.project._id || item.project.id);
            })
            .addCase(fetchSavedProjects.rejected, (state, action) => {
                state.status = 'failed';
                state.loadingMore = false;
                state.error = action.payload;
            })

            // Toggle Save Project
            .addCase(toggleSaveProject.pending, (state, action) => {
                const projectId = action.meta.arg;
                state.toggleLoading[projectId] = true;
            })
            .addCase(toggleSaveProject.fulfilled, (state, action) => {
                const { projectId, data } = action.payload;
                const { action: saveAction } = data;
                delete state.toggleLoading[projectId];

                if (saveAction === 'saved') {
                    // Project was saved
                    if (!state.savedProjectIds.includes(projectId)) {
                        state.savedProjectIds.push(projectId);
                    }
                } else if (saveAction === 'unsaved') {
                    // Project was unsaved
                    state.savedProjectIds = state.savedProjectIds.filter(id => id !== projectId);
                    // Remove from saved projects list if it exists
                    state.savedProjects = state.savedProjects.filter(
                        item => (item.project._id || item.project.id) !== projectId
                    );
                    state.total = Math.max(0, state.total - 1);
                }
            })
            .addCase(toggleSaveProject.rejected, (state, action) => {
                const projectId = action.meta.arg;
                delete state.toggleLoading[projectId];
                state.error = action.payload;
            })

            // Remove Saved Project
            .addCase(removeSavedProject.pending, (state, action) => {
                const projectId = action.meta.arg;
                state.toggleLoading[projectId] = true;
            })
            .addCase(removeSavedProject.fulfilled, (state, action) => {
                const { projectId } = action.payload;
                delete state.toggleLoading[projectId];

                // Remove from saved projects list and IDs array
                state.savedProjects = state.savedProjects.filter(
                    item => (item.project._id || item.project.id) !== projectId
                );
                state.savedProjectIds = state.savedProjectIds.filter(id => id !== projectId);
                state.total = Math.max(0, state.total - 1);
            })
            .addCase(removeSavedProject.rejected, (state, action) => {
                const projectId = action.meta.arg;
                delete state.toggleLoading[projectId];
                state.error = action.payload;
            })

            // Remove All Saved Projects
            .addCase(removeAllSavedProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeAllSavedProjects.fulfilled, (state) => {
                state.status = 'succeeded';
                state.savedProjects = [];
                state.savedProjectIds = [];
                state.total = 0;
                state.page = 1;
                state.totalPages = 0;
                state.hasMore = false;
            })
            .addCase(removeAllSavedProjects.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetSavedProjects, setToggleLoading, clearError } = savedProjectsSlice.actions;
export default savedProjectsSlice.reducer;
