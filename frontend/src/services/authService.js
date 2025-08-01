// src/services/authService.js
import axiosInstance from '../../UTILS/axiosInstance';

// Function to get socket token for Socket.io authentication
export const getSocketToken = async () => {
    try {
        const response = await axiosInstance.get('/api/v1/user/socket-token', {
            withCredentials: true,
        });
        return response.data.data.socketToken;
    } catch (error) {
        console.error('Error getting socket token:', error);
        throw error;
    }
};
