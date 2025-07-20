import axiosInstance from '../../UTILS/axiosInstance';

class ApplicationService {
    // Apply to project (Freelancer only)
    async applyToProject(projectId, applicationData) {
        const response = await axiosInstance.post(`/api/v1/applications/apply/${projectId}`, applicationData);
        return response.data;
    }

    // Edit application (Freelancer only)
    async editApplication(applicationId, applicationData) {
        const response = await axiosInstance.put(`/api/v1/applications/edit/${applicationId}`, applicationData);
        return response.data;
    }

    // Withdraw application (Freelancer only)
    async withdrawApplication(applicationId) {
        const response = await axiosInstance.delete(`/api/v1/applications/withdraw/${applicationId}`);
        return response.data;
    }

    // Get user's applications (Freelancer only)
    async getUserApplications(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/applications/my-applications?${queryString}`);
        return response.data;
    }

    // Submit project (Freelancer only)
    async submitProject(applicationId, submissionData) {
        const response = await axiosInstance.put(`/api/v1/applications/submit/${applicationId}`, submissionData);
        return response.data;
    }

    // Accept application (Client only)
    async acceptApplication(applicationId, acceptanceData) {
        const response = await axiosInstance.put(`/api/v1/applications/accept/${applicationId}`, acceptanceData);
        return response.data;
    }

    // Reject application (Client only)
    async rejectApplication(applicationId, rejectionData) {
        const response = await axiosInstance.put(`/api/v1/applications/reject/${applicationId}`, rejectionData);
        return response.data;
    }

    // Get project applications (Client only)
    async getProjectApplications(projectId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/applications/project/${projectId}?${queryString}`);
        return response.data;
    }

    // Get client applications (Client only)
    async getClientApplications(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/v1/applications/client-applications?${queryString}`);
        return response.data;
    }

    // Approve completion (Client only)
    async approveCompletion(applicationId, approvalData) {
        const response = await axiosInstance.put(`/api/v1/applications/approve/${applicationId}`, approvalData);
        return response.data;
    }
}

const applicationService = new ApplicationService();
export default applicationService;