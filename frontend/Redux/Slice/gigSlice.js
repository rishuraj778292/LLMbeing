import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gigService from '../../src/services/gigService';

// Async Thunks for Gig Operations

// Get all gigs with filters
export const fetchGigs = createAsyncThunk(
    'gig/fetchGigs',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await gigService.getAllGigs(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get gig by ID
export const fetchGigById = createAsyncThunk(
    'gig/fetchGigById',
    async (gigId, { rejectWithValue }) => {
        try {
            const response = await gigService.getGigById(gigId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Create new gig
export const createGig = createAsyncThunk(
    'gig/createGig',
    async (gigData, { rejectWithValue }) => {
        try {
            const response = await gigService.createGig(gigData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update gig
export const updateGig = createAsyncThunk(
    'gig/updateGig',
    async ({ gigId, gigData }, { rejectWithValue }) => {
        try {
            const response = await gigService.updateGig(gigId, gigData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete gig
export const deleteGig = createAsyncThunk(
    'gig/deleteGig',
    async (gigId, { rejectWithValue }) => {
        try {
            const response = await gigService.deleteGig(gigId);
            return { gigId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get user's gigs
export const fetchUserGigs = createAsyncThunk(
    'gig/fetchUserGigs',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await gigService.getUserGigs(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Search gigs
export const searchGigs = createAsyncThunk(
    'gig/searchGigs',
    async ({ searchQuery, filters = {} }, { rejectWithValue }) => {
        try {
            const response = await gigService.searchGigs(searchQuery, filters);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get featured gigs
export const fetchFeaturedGigs = createAsyncThunk(
    'gig/fetchFeaturedGigs',
    async (limit = 12, { rejectWithValue }) => {
        try {
            const response = await gigService.getFeaturedGigs(limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    gigs: [],
    userGigs: [],
    featuredGigs: [],
    currentGig: null,
    loading: false,
    loadingMore: false,
    error: null,
    success: null,
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    filters: {
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        skills: [],
        sortBy: 'createdAt',
        sortOrder: 'desc'
    }
};

const gigSlice = createSlice({
    name: 'gig',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        setCurrentGig: (state, action) => {
            state.currentGig = action.payload;
        },
        clearCurrentGig: (state) => {
            state.currentGig = null;
        },
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        resetGigs: (state) => {
            state.gigs = [];
            state.pagination = initialState.pagination;
        },
        resetGigState: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch gigs
            .addCase(fetchGigs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = action.payload.data.gigs;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch gigs';
            })

            // Fetch gig by ID
            .addCase(fetchGigById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGigById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGig = action.payload.data;
            })
            .addCase(fetchGigById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch gig';
            })

            // Create gig
            .addCase(createGig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGig.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Gig created successfully!';
                state.userGigs.unshift(action.payload.data);
            })
            .addCase(createGig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create gig';
            })

            // Update gig
            .addCase(updateGig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGig.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Gig updated successfully!';
                
                // Update in userGigs array
                const index = state.userGigs.findIndex(gig => gig._id === action.payload.data._id);
                if (index !== -1) {
                    state.userGigs[index] = action.payload.data;
                }
                
                // Update currentGig if it's the same
                if (state.currentGig?._id === action.payload.data._id) {
                    state.currentGig = action.payload.data;
                }
            })
            .addCase(updateGig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update gig';
            })

            // Delete gig
            .addCase(deleteGig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGig.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Gig deleted successfully!';
                
                // Remove from userGigs array
                state.userGigs = state.userGigs.filter(gig => gig._id !== action.payload.gigId);
                
                // Clear currentGig if it's the deleted one
                if (state.currentGig?._id === action.payload.gigId) {
                    state.currentGig = null;
                }
            })
            .addCase(deleteGig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete gig';
            })

            // Fetch user gigs
            .addCase(fetchUserGigs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.userGigs = action.payload.data.gigs;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchUserGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch user gigs';
            })

            // Search gigs
            .addCase(searchGigs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = action.payload.data.gigs;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(searchGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to search gigs';
            })

            // Fetch featured gigs
            .addCase(fetchFeaturedGigs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeaturedGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.featuredGigs = action.payload.data.gigs;
            })
            .addCase(fetchFeaturedGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch featured gigs';
            });
    }
});

export const {
    clearError,
    clearSuccess,
    setCurrentGig,
    clearCurrentGig,
    updateFilters,
    resetFilters,
    resetGigs,
    resetGigState
} = gigSlice.actions;

export default gigSlice.reducer;
