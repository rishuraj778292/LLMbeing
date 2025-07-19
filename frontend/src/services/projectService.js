import axiosInstance from '../../UTILS/axiosInstance';

// Project Service - handles all project-related API calls
class ProjectService {
    // Get all projects with filters and pagination
    async getAllProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/project?${queryString}`);
        return response.data;
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
