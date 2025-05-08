// src/redux/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '../../UTILS/axiosInstance';

console.log('projectSlice loaded');
// Utility function to handle API errors
const handleApiError = (error) => {
  const message =
    error.response?.data?.message || error.message || 'Something went wrong';
  throw new Error(message);
};

// Async Thunks

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ page = 1, limit = 10, filters = {} }, thunkAPI) => {
    try {
      const query = new URLSearchParams({ page, limit, ...filters }).toString();
      const response = await axiosInstance.get(`/api/v1/project/fetchprojects?${query}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchProjectBySlug = createAsyncThunk(
  'projects/fetchProjectBySlug',
  async (slug, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/v1/project/fetchprojectdetails/${slug}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/project/post', projectData, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/v1/project/edit/${id}`, updatedData, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/v1/project/delete/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Slice

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    selectedProject: null,
    totalPages: 1,
    page: 1,
    status: 'idle',
    error: null,
    loadingMore: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state, action) => {
        const page = action.meta.arg?.page || 1; // Extract 'page' from action.meta.arg
        if (page === 1) {
            state.status = 'loading';
        } else {
            state.loadingMore = true;
        }
    })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const page = action.payload.page;
      
        if (page === 1) {
          state.projects = action.payload.projects;
          state.status = 'succeeded';
        } else {
          state.projects = [...state.projects, ...action.payload.projects];
          state.loadingMore = false;
        }
      
        state.page = page;
        state.totalPages = action.payload.totalPages;
      })
      
      .addCase(fetchProjects.rejected, (state, action) => {
        const page = action.meta.arg?.page || 1;
        if (page === 1) {
          state.status = 'failed';
        } else {
          state.loadingMore = false;
        }
        state.error = action.payload;
      })
      
      // Fetch project by slug
      .addCase(fetchProjectBySlug.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectBySlug.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
