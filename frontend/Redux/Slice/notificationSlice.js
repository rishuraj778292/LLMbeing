import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../UTILS/axiosInstance';

// Async thunk for getting all notifications
export const getNotifications = createAsyncThunk(
    'notifications/getNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/notifications');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

// Async thunk for marking notifications as read
export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationIds, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch('/api/v1/notifications/mark-read', {
                notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark notifications as read');
        }
    }
);

// Async thunk for marking all notifications as read
export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch('/api/v1/notifications/mark-all-read');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        // Socket events
        socketNewNotification: (state, action) => {
            const notification = action.payload;

            // Add notification to the beginning of the list
            state.notifications.unshift(notification);

            // Update unread count if notification is unread
            if (!notification.isRead) {
                state.unreadCount += 1;
            }
        },

        // Clear all notifications
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },

        // Update unread count
        updateUnreadCount: (state) => {
            state.unreadCount = state.notifications.filter(n => !n.isRead).length;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Notifications
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications || [];
                state.unreadCount = action.payload.unreadCount || 0;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark As Read
            .addCase(markAsRead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.loading = false;
                const readNotificationIds = action.payload.notificationIds || [];

                // Update notifications to mark them as read
                state.notifications = state.notifications.map(notification =>
                    readNotificationIds.includes(notification._id)
                        ? { ...notification, isRead: true }
                        : notification
                );

                // Update unread count
                state.unreadCount = state.notifications.filter(n => !n.isRead).length;
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark All As Read
            .addCase(markAllAsRead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.loading = false;

                // Mark all notifications as read
                state.notifications = state.notifications.map(notification => ({
                    ...notification,
                    isRead: true
                }));

                // Reset unread count
                state.unreadCount = 0;
            })
            .addCase(markAllAsRead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    socketNewNotification,
    clearNotifications,
    updateUnreadCount
} = notificationSlice.actions;

// Map socket actions to Redux actions
export const notificationSocketActionMap = {
    'SOCKET_NEW_NOTIFICATION': socketNewNotification
};

export default notificationSlice.reducer;
