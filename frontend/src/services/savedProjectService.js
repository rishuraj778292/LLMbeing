import axiosInstance from '../../UTILS/axiosInstance';

const savedProjectService = {
    // Get user's saved projects
    getUserSavedProjects: async (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add pagination params
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        // Add filtering params
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);

        const response = await axiosInstance.get(`/api/v1/saved-projects?${queryParams.toString()}`);
        return response.data;
    },

    // Toggle save/unsave project
    toggleSaveProject: async (projectId) => {
        const response = await axiosInstance.post(`/api/v1/saved-projects/toggle/${projectId}`);
        return response.data;
    },

    // Remove a specific saved project
    removeSavedProject: async (projectId) => {
        const response = await axiosInstance.delete(`/api/v1/saved-projects/${projectId}`);
        return response.data;
    },

    // Remove all saved projects
    removeAllSavedProjects: async () => {
        const response = await axiosInstance.delete('/api/v1/saved-projects/all');
        return response.data;
    },

    // Check if a project is saved (useful for determining bookmark state)
    isProjectSaved: async (projectId) => {
        const response = await axiosInstance.get(`/api/v1/saved-projects/check/${projectId}`);
        return response.data;
    }
};

export default savedProjectService;
