import axiosInstance from '../../UTILS/axiosInstance';


const likedProjectService = {
    // Get user's liked projects
    getUserLikedProjects: async (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add pagination params
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        // Add filtering params
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);

        const response = await axiosInstance.get(`/api/v1/liked-projects?${queryParams.toString()}`);
        return response.data;
    },

    // Toggle Like/Unlike project
    toggleLikeProject: async (projectId) => {
        const response = await axiosInstance.post(`/api/v1/liked-projects/like/${projectId}`);
        return response.data;
    },



    // Check if a project is saved (useful for determining bookmark state)
    isProjectSaved: async (projectId) => {
        const response = await axiosInstance.get(`/api/v1/saved-projects/check/${projectId}`);
        return response.data;
    }
};

export default likedProjectService;
