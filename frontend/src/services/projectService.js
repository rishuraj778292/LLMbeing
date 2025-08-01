import axiosInstance from '../../UTILS/axiosInstance';

// Project Service - handles all project-related API calls
class ProjectService {
    // Get all projects with filters and pagination
    async getAllProjects(params = {}) {
        try {
            // Process the params
            const processedParams = { ...params };

            // Always include all statuses by default, unless explicitly set otherwise
            processedParams.includeAllStatuses = 'true';

            // If getAll is true, set limit to match backend limit
            if (processedParams.getAll) {
                // Set limit to match backend hardcoded limit
                processedParams.limit = 10;
                console.log(`Setting limit to ${processedParams.limit} to match backend limit`);
                delete processedParams.getAll;
            }

            // Extract filters
            if (processedParams.filters) {
                // Handle showAll flag - if it's explicitly set to false, don't include all statuses
                if (processedParams.filters.showAll === false) {
                    processedParams.includeAllStatuses = 'false';
                    delete processedParams.filters.showAll;
                }

                // Extract categories if they exist
                if (processedParams.filters.categories && processedParams.filters.categories.length > 0) {
                    processedParams.categories = processedParams.filters.categories.join(',');
                }

                // Extract skills if they exist
                if (processedParams.filters.skills && processedParams.filters.skills.length > 0) {
                    processedParams.skills = processedParams.filters.skills.join(',');
                }

                // Extract experienceLevel if it exists
                if (processedParams.filters.experience && processedParams.filters.experience.length > 0) {
                    processedParams.experienceLevel = processedParams.filters.experience[0]; // Take first one
                }

                // Extract projectType if it exists
                if (processedParams.filters.type && processedParams.filters.type.length > 0) {
                    processedParams.projectType = processedParams.filters.type.join(',');
                }

                // Extract budget range if it exists
                if (processedParams.filters.budget) {
                    if (processedParams.filters.budget.min) {
                        processedParams.budgetMin = processedParams.filters.budget.min;
                    }
                    if (processedParams.filters.budget.max) {
                        processedParams.budgetMax = processedParams.filters.budget.max;
                    }
                }

                // Extract location if it exists
                if (processedParams.filters.location && processedParams.filters.location.length > 0) {
                    processedParams.location = processedParams.filters.location.join(',');
                }

                // Extract search term
                if (processedParams.filters.search) {
                    processedParams.search = processedParams.filters.search;
                }

                // Remove the filters object as we've extracted everything
                delete processedParams.filters;
            }

            // Add a flag to include application status for the current user
            processedParams.includeApplicationStatus = true;

            const queryString = new URLSearchParams(processedParams).toString();
            console.log('Fetching projects with query:', queryString);

            const response = await axiosInstance.get(`/api/v1/project?${queryString}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    // Get project details by ID or slug
    async getProjectDetails(identifier) {
        const response = await axiosInstance.get(`/api/v1/project/${identifier}`);
        return response.data;
    }

    // Create new project (Client only)
    async createProject(projectData) {
        const response = await axiosInstance.post('/api/v1/project', projectData);
        return response.data;
    }

    // Update project (Client only)
    async updateProject(projectId, updateData) {
        const response = await axiosInstance.put(`/api/v1/project/${projectId}`, updateData);
        return response.data;
    }

    // Delete project (Client only)
    async deleteProject(projectId) {
        const response = await axiosInstance.delete(`/api/v1/project/${projectId}`);
        return response.data;
    }

    // Get own projects (Client only)
    async getOwnProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/project/my/projects?${queryString}`);
        return response.data;
    }

    // Update project status (Client only)
    async updateProjectStatus(projectId, status) {
        const response = await axiosInstance.put(`/api/v1/project/${projectId}/status`, { status });
        return response.data;
    }

    // Like/Unlike project (Freelancer only)
    async toggleLike(projectId) {
        const response = await axiosInstance.post(`/api/v1/project/${projectId}/like`);
        return response.data;
    }

    // Dislike/Remove dislike project (Freelancer only)
    async toggleDislike(projectId) {
        const response = await axiosInstance.post(`/api/v1/project/${projectId}/dislike`);
        return response.data;
    }

    // Bookmark/Unbookmark project (Freelancer only)
    async toggleBookmark(projectId) {
        const response = await axiosInstance.post(`/api/v1/project/${projectId}/bookmark`);
        return response.data;
    }

    // Get liked projects (Freelancer only)
    async getLikedProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/project/my/liked?${queryString}`);
        return response.data;
    }

    // Get bookmarked projects (Freelancer only)
    async getBookmarkedProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/project/my/bookmarked?${queryString}`);
        return response.data;
    }

    // Get trending projects
    async getTrendingProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/project/trending?${queryString}`);
        return response.data;
    }

    // Get most liked projects
    async getMostLikedProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/project/most-liked?${queryString}`);
        return response.data;
    }
}

export default new ProjectService();
