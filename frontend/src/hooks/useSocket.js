// src/hooks/useSocket.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initializeSocket, disconnectSocket, updateSocketAuth } from '../services/socketService';

export const useSocket = () => {
    const { isAuthenticated, verifyStatus } = useSelector((state) => state.auth);

    useEffect(() => {
        // Only proceed if we've completed the verification process
        if (verifyStatus === 'loading') return;

        if (isAuthenticated) {
            // Initialize socket connection when user is authenticated
            initializeSocket().catch((error) => {
                console.error('Failed to initialize socket:', error);
            });
        } else {
            // Disconnect socket when user is not authenticated
            disconnectSocket();
        }

        // Cleanup on unmount
        return () => {
            disconnectSocket();
        };
    }, [isAuthenticated, verifyStatus]);

    // Handle token refresh - reconnect socket with new token
    useEffect(() => {
        if (isAuthenticated && verifyStatus === 'succeeded') {
            updateSocketAuth().catch((error) => {
                console.error('Failed to update socket authentication:', error);
            });
        }
    }, [isAuthenticated, verifyStatus]);
};
