import { io } from 'socket.io-client';
import { store } from '../../Redux/store';
import { getSocketToken } from './authService';

let socket = null;

// Function to initialize socket connection
export const initializeSocket = async () => {
    if (socket) {
        // If socket exists but disconnected, reconnect
        if (!socket.connected) {
            socket.connect();
        }
        return socket;
    }

    try {
        // Get a fresh socket token from the backend
        const token = await getSocketToken();

        // Create new socket connection with authentication
        socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3300', {
            auth: { token },
            autoConnect: true
        });

        // Set up event listeners
        setupSocketListeners();

        return socket;
    } catch (error) {
        console.error('Failed to initialize socket connection:', error);
        throw error;
    }
};

// Function to get existing socket or null
export const getSocket = () => socket;

// Function to disconnect socket
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

// Function to join a chat room
export const joinChatRoom = (roomId) => {
    if (socket && socket.connected) {
        socket.emit('join-room', roomId);
    }
};

// Function to leave a chat room
export const leaveChatRoom = (roomId) => {
    if (socket && socket.connected) {
        socket.emit('leave-room', roomId);
    }
};

// Function to send a message
export const sendMessage = (roomId, content, replyToId = null) => {
    if (socket && socket.connected) {
        socket.emit('send-message', { roomId, content, replyToId });
    }
};

// Function to mark messages as read
export const markMessagesAsRead = (roomId, messageIds = null) => {
    if (socket && socket.connected) {
        socket.emit('mark-read', { roomId, messageIds });
    }
};

// Function to send typing indicator
export const sendTypingIndicator = (roomId, isTyping) => {
    if (socket && socket.connected) {
        if (isTyping) {
            socket.emit('typing', { roomId });
        } else {
            socket.emit('stop-typing', { roomId });
        }
    }
};

// Function to update user online status
export const updateOnlineStatus = (isOnline = true) => {
    if (socket && socket.connected) {
        socket.emit('user-status', { online: isOnline });
    }
};

// Function to request online status of users
export const requestUserStatuses = (userIds) => {
    if (socket && socket.connected) {
        socket.emit('get-user-statuses', { userIds });
    }
};

// Set up socket event listeners
const setupSocketListeners = () => {
    // Handle connection events
    socket.on('connect', () => {
        console.log('Socket connected');
        // Update online status when connected
        updateOnlineStatus(true);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
    });

    // Handle room events
    socket.on('room-joined', (data) => {
        console.log(`Successfully joined room: ${data.roomId}`);
    });

    // Handle message events
    socket.on('new-message', (message) => {
        // Dispatch to Redux store to update state
        store.dispatch({
            type: 'SOCKET_NEW_MESSAGE',
            payload: message
        });
    });

    socket.on('messages-read', (data) => {
        // Dispatch to Redux store to update read status
        store.dispatch({
            type: 'SOCKET_MESSAGES_READ',
            payload: data
        });
    });

    // Handle typing events
    socket.on('user-typing', (data) => {
        store.dispatch({
            type: 'SOCKET_USER_TYPING',
            payload: data
        });
    });

    socket.on('user-stop-typing', (data) => {
        store.dispatch({
            type: 'SOCKET_USER_STOP_TYPING',
            payload: data
        });
    });

    // Handle user status events
    socket.on('user-status-update', (data) => {
        store.dispatch({
            type: 'SOCKET_USER_STATUS_UPDATE',
            payload: data
        });
    });

    socket.on('user-statuses', (data) => {
        store.dispatch({
            type: 'SOCKET_USER_STATUSES',
            payload: data
        });
    });

    // Handle notifications
    socket.on('notification', (notification) => {
        store.dispatch({
            type: 'SOCKET_NEW_NOTIFICATION',
            payload: notification
        });
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error.message);
    });
};

// Add event listener to automatically reconnect when token changes
export const updateSocketAuth = async () => {
    if (socket) {
        // Disconnect current socket
        socket.disconnect();
        socket = null;
    }

    try {
        // Initialize with new token
        await initializeSocket();
    } catch (error) {
        console.error('Failed to update socket authentication:', error);
    }
};
