// src/redux/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../src/services/projectService';

// Utility function to handle API errors
const handleApiError = (error) => {
  const message =
    error.response?.data?.message || error.message || 'Something went wrong';
  throw new Error(message);
};

// Async Thunks

// Fetch all projects with filters
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params, thunkAPI) => {
    try {
      // Get applied project IDs from the application state
      const appliedProjectIds = thunkAPI.getState()?.applications?.appliedProjectIds || [];
      console.log('Applied project IDs before fetch:', appliedProjectIds);

      // Make the API call to get projects
      const response = await projectService.getAllProjects(params);

      // Add the applied project IDs to the response
      return {
        ...response.data,
        appliedProjectIds
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch project details
export const fetchProjectDetails = createAsyncThunk(
  'projects/fetchProjectDetails',
  async (identifier, thunkAPI) => {
    try {
      const response = await projectService.getProjectDetails(identifier);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, thunkAPI) => {
    try {
      const response = await projectService.createProject(projectData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Get user's own projects
export const getUserProjects = createAsyncThunk(
  'projects/getUserProjects',
  async (params = {}, thunkAPI) => {
    try {
      const response = await projectService.getOwnProjects(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, thunkAPI) => {
    try {
      const response = await projectService.deleteProject(projectId);
      return { ...response.data, projectId };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, updateData }, thunkAPI) => {
    try {
      const response = await projectService.updateProject(projectId, updateData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// // Delete project
// export const deleteProject = createAsyncThunk(
//   'projects/deleteProjec t',
//   async (projectId, thunkAPI) => {
//     try {
//       await projectService.deleteProject(projectId);
//       return projectId;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(handleApiError(error));
//     }
//   }
// );

// Get own projects
export const fetchOwnProjects = createAsyncThunk(
  'projects/fetchOwnProjects',
  async (params, thunkAPI) => {
    try {
      const response = await projectService.getOwnProjects(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Toggle like
export const toggleLike = createAsyncThunk(
  'projects/toggleLike',
  async (projectId, thunkAPI) => {
    try {
      const response = await projectService.toggleLike(projectId);
      return { projectId, result: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Toggle dislike
export const toggleDislike = createAsyncThunk(
  'projects/toggleDislike',
  async (projectId, thunkAPI) => {
    try {
      const response = await projectService.toggleDislike(projectId);
      return { projectId, result: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Toggle bookmark
export const toggleBookmark = createAsyncThunk(
  'projects/toggleBookmark',
  async (projectId, thunkAPI) => {
    try {
      const response = await projectService.toggleBookmark(projectId);
      return { projectId, result: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch liked projects
export const fetchLikedProjects = createAsyncThunk(
  'projects/fetchLikedProjects',
  async (params, thunkAPI) => {
    try {
      const response = await projectService.getLikedProjects(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch bookmarked projects
export const fetchBookmarkedProjects = createAsyncThunk(
  'projects/fetchBookmarkedProjects',
  async (params, thunkAPI) => {
    try {
      const response = await projectService.getBookmarkedProjects(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch trending projects
export const fetchTrendingProjects = createAsyncThunk(
  'projects/fetchTrendingProjects',
  async (params, thunkAPI) => {
    try {
      const response = await projectService.getTrendingProjects(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  ownProjects: [],
  likedProjects: [],
  bookmarkedProjects: [],
  trendingProjects: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,
  loadingMore: false,
  filters: {
    search: '',
    categories: [],
    skills: [],
    experienceLevel: '',
    projectType: '',
    budgetMin: '',
    budgetMax: '',
    location: '',
    sortBy: 'newest'
  }
};

// Project slice
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    resetProjects: (state) => {
      state.projects = [];
      state.page = 1;
      state.totalPages = 1;
      state.total = 0;
      state.error = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Update project interactions locally for optimistic updates
    updateProjectInteraction: (state, action) => {
      const { projectId, type, isActive } = action.payload;
      const updateProjectInArray = (projectArray) => {
        const project = projectArray.find(p => p._id === projectId);
        if (project) {
          if (type === 'like') {
            project.isLiked = isActive;
            project.likesCount = isActive ? project.likesCount + 1 : project.likesCount - 1;
          } else if (type === 'dislike') {
            project.isDisliked = isActive;
            project.dislikesCount = isActive ? project.dislikesCount + 1 : project.dislikesCount - 1;
          } else if (type === 'bookmark') {
            project.isBookmarked = isActive;
            project.bookmarksCount = isActive ? project.bookmarksCount + 1 : project.bookmarksCount - 1;
          } else if (type === 'apply') {
            project.hasApplied = isActive;
          }
        }
      };

      updateProjectInArray(state.projects);
      if (state.currentProject && state.currentProject._id === projectId) {
        if (type === 'like') {
          state.currentProject.isLiked = isActive;
          state.currentProject.likesCount = isActive ? state.currentProject.likesCount + 1 : state.currentProject.likesCount - 1;
        } else if (type === 'dislike') {
          state.currentProject.isDisliked = isActive;
          state.currentProject.dislikesCount = isActive ? state.currentProject.dislikesCount + 1 : state.currentProject.dislikesCount - 1;
        } else if (type === 'bookmark') {
          state.currentProject.isBookmarked = isActive;
          state.currentProject.bookmarksCount = isActive ? state.currentProject.bookmarksCount + 1 : state.currentProject.bookmarksCount - 1;
        } else if (type === 'apply') {
          state.currentProject.hasApplied = isActive;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state, action) => {
        const isFirstPage = action.meta.arg?.page === 1 || !action.meta.arg?.page;
        // Set appropriate loading states
        if (isFirstPage) {
          state.status = 'loading';
          // Only clear the projects array if we're doing a fresh load
          // This prevents the UI from flashing empty while waiting for data
          if (!state.projects.length) {
            state.projects = [];
          }
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loadingMore = false;
        state.error = null;

        // Handle missing payload
        if (!action.payload) {
          console.error('No payload received in fetchProjects.fulfilled');
          return;
        }

        // Extract data from payload
        const { projects, page, totalPages, total, appliedProjectIds } = action.payload;

        console.log('Fetched projects data:', {
          projectsCount: projects?.length || 0,
          page,
          totalPages,
          total,
          appliedProjectIdsCount: appliedProjectIds?.length || 0
        });

        // Handle missing projects
        if (!Array.isArray(projects)) {
          console.error('Projects data is not an array:', projects);
          state.projects = state.page === 1 ? [] : state.projects;
          state.page = page || 1;
          state.totalPages = totalPages || 1;
          state.total = total || 0;
          return;
        }

        // Get the current applied project IDs from the application state
        const currentAppliedIds = appliedProjectIds || [];
        console.log(`Processing ${projects.length} projects with ${currentAppliedIds.length} applied project IDs`);

        // Mark projects that user has applied to
        const projectsWithAppliedStatus = projects.map(project => {
          // Check if this project is in the applied IDs list
          const isApplied = currentAppliedIds.includes(project._id);

          // If applied status changed, log it
          if (isApplied !== !!project.hasApplied) {
            console.log(`Updating applied status for project ${project._id} (${project.title}): API=${!!project.hasApplied}, Redux=${isApplied}`);
          }

          // Always use the union of both sources to be safe
          return {
            ...project,
            hasApplied: isApplied || !!project.hasApplied
          };
        });

        // When page is 1, reset the project list to avoid duplicates
        if (page === 1) {
          console.log(`Setting ${projectsWithAppliedStatus.length} projects for page 1`);
          state.projects = [...projectsWithAppliedStatus];
        } else {
          // For subsequent pages, append new projects, avoiding duplicates
          const existingIds = new Set(state.projects.map(p => p._id));
          const newProjects = projectsWithAppliedStatus.filter(p => !existingIds.has(p._id));
          console.log(`Adding ${newProjects.length} new projects from page ${page}`);
          state.projects = [...state.projects, ...newProjects];
        }

        // Ensure all projects have correct application status based on current appliedProjectIds
        // This is crucial after applying to a project
        if (currentAppliedIds.length > 0) {
          state.projects = state.projects.map(project => {
            if (currentAppliedIds.includes(project._id)) {
              return { ...project, hasApplied: true };
            }
            return project;
          });
        }

        // Always update pagination state
        state.page = page || 1;
        state.totalPages = totalPages || 1;
        state.total = total || 0;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.loadingMore = false;
        state.error = action.payload;
      })

      // Fetch Project Details
      .addCase(fetchProjectDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.currentProject = null;
      })

      // Create Project
      .addCase(createProject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ownProjects.unshift(action.payload);
        state.projects.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const updatedProject = action.payload;

        // Update in projects array
        const projectIndex = state.projects.findIndex(p => p._id === updatedProject._id);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = updatedProject;
        }

        // Update in own projects array
        const ownProjectIndex = state.ownProjects.findIndex(p => p._id === updatedProject._id);
        if (ownProjectIndex !== -1) {
          state.ownProjects[ownProjectIndex] = updatedProject;
        }

        // Update current project if it's the same
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        const projectId = action.payload;
        state.projects = state.projects.filter(p => p._id !== projectId);
        state.ownProjects = state.ownProjects.filter(p => p._id !== projectId);

        if (state.currentProject && state.currentProject._id === projectId) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Own Projects
      .addCase(fetchOwnProjects.fulfilled, (state, action) => {
        state.ownProjects = action.payload.projects || action.payload;
      })
      .addCase(fetchOwnProjects.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { projectId, result } = action.payload;
        state.updateProjectInteraction = {
          projectId,
          type: 'like',
          isActive: result.isLiked
        };
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Toggle Dislike
      .addCase(toggleDislike.fulfilled, (state, action) => {
        const { projectId, result } = action.payload;
        state.updateProjectInteraction = {
          projectId,
          type: 'dislike',
          isActive: result.isDisliked
        };
      })
      .addCase(toggleDislike.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Toggle Bookmark
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const { projectId, result } = action.payload;
        state.updateProjectInteraction = {
          projectId,
          type: 'bookmark',
          isActive: result.isBookmarked
        };
      })
      .addCase(toggleBookmark.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Liked Projects
      .addCase(fetchLikedProjects.fulfilled, (state, action) => {
        state.likedProjects = action.payload.projects || action.payload;
      })
      .addCase(fetchLikedProjects.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Bookmarked Projects
      .addCase(fetchBookmarkedProjects.fulfilled, (state, action) => {
        state.bookmarkedProjects = action.payload.projects || action.payload;
      })
      .addCase(fetchBookmarkedProjects.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Trending Projects
      .addCase(fetchTrendingProjects.fulfilled, (state, action) => {
        state.trendingProjects = action.payload.projects || action.payload;
      })
      .addCase(fetchTrendingProjects.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  resetProjects,
  updateFilters,
  clearCurrentProject,
  clearError,
  updateProjectInteraction
} = projectSlice.actions;

export default projectSlice.reducer;
