import axiosInstance from '../../UTILS/axiosInstance';

class GigService {
    // Get all gigs with filters and pagination
    async getAllGigs(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/gig?${queryString}`);
        return response.data;
    }

    // Get gig by ID
    async getGigById(gigId) {
        const response = await axiosInstance.get(`/api/v1/gig/${gigId}`);
        return response.data;
    }

    // Create new gig (Freelancer only)
    async createGig(gigData) {
        const response = await axiosInstance.post('/api/v1/gig', gigData);
        return response.data;
    }

    // Update gig (Freelancer only)
    async updateGig(gigId, gigData) {
        const response = await axiosInstance.put(`/api/v1/gig/${gigId}`, gigData);
        return response.data;
    }

    // Delete gig (Freelancer only)
    async deleteGig(gigId) {
        const response = await axiosInstance.delete(`/api/v1/gig/${gigId}`);
        return response.data;
    }

    // Get user's gigs (Freelancer only)
    async getUserGigs(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/gig/my-gigs?${queryString}`);
        return response.data;
    }

    // Search gigs
    async searchGigs(searchQuery, filters = {}) {
        const params = {
            search: searchQuery,
            ...filters
        };
        return this.getAllGigs(params);
    }

    // Get gigs by category
    async getGigsByCategory(category, params = {}) {
        const gigParams = {
            category,
            ...params
        };
        return this.getAllGigs(gigParams);
    }

    // Get featured/popular gigs
    async getFeaturedGigs(limit = 12) {
        const params = {
            sortBy: 'orders',
            sortOrder: 'desc',
            limit
        };
        return this.getAllGigs(params);
    }

    // Get gigs by price range
    async getGigsByPriceRange(minPrice, maxPrice, params = {}) {
        const gigParams = {
            minPrice,
            maxPrice,
            ...params
        };
        return this.getAllGigs(gigParams);
    }

    // Get gigs by skills
    async getGigsBySkills(skills, params = {}) {
        const gigParams = {
            skills: Array.isArray(skills) ? skills.join(',') : skills,
            ...params
        };
        return this.getAllGigs(gigParams);
    }
}

const gigService = new GigService();
export default gigService;
