import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../UTILS/axiosInstance';

// Async thunk for creating a chat room
export const createChatRoom = createAsyncThunk(
    'messages/createChatRoom',
    async ({ projectId, freelancerId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/v1/messages/chatrooms', {
                projectId,
                freelancerId
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create chat room');
        }
    }
);

// Async thunk for getting all chat rooms
export const getChatRooms = createAsyncThunk(
    'messages/getChatRooms',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/messages/chatrooms');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat rooms');
        }
    }
);

// Async thunk for getting chat room details
export const getChatRoomDetails = createAsyncThunk(
    'messages/getChatRoomDetails',
    async ({ roomId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            // Reduce default limit to 10 messages per page to avoid resource issues
            const response = await axiosInstance.get(`/api/v1/messages/chatrooms/${roomId}?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching chat room details:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat room details');
        }
    }
);

// Async thunk for sending a message (REST fallback)
export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ roomId, content, replyToId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/messages/chatrooms/${roomId}/messages`, {
                content,
                replyToId
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

// Async thunk for getting unread message counts
export const getUnreadMessageCounts = createAsyncThunk(
    'messages/getUnreadMessageCounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/messages/unread-counts');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread message counts');
        }
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        chatRooms: [],
        currentChatRoom: null,
        messages: [],
        unreadCounts: {},
        totalUnread: 0,
        typingUsers: {},
        userStatuses: {}, // Track online status of users
        loading: false,
        error: null,
        success: false,
        page: 1,
        hasMore: true
    },
    reducers: {
        // Socket events
        socketNewMessage: (state, action) => {
            const message = action.payload;

            // Check if this message belongs to the current chat room
            if (state.currentChatRoom && message.chatRoom === state.currentChatRoom._id) {
                // Add message to messages array if not already there
                if (!state.messages.some(m => m._id === message._id)) {
                    state.messages.push(message);
                }
            }

            // Update chat room last message and activity
            const roomIndex = state.chatRooms.findIndex(room => room._id === message.chatRoom);
            if (roomIndex !== -1) {
                state.chatRooms[roomIndex].lastMessage = message;
                state.chatRooms[roomIndex].lastActivity = new Date().toISOString();

                // Move this room to the top of the list
                const room = state.chatRooms[roomIndex];
                state.chatRooms.splice(roomIndex, 1);
                state.chatRooms.unshift(room);
            }
        },

        socketMessagesRead: (state, action) => {
            const { roomId, reader, messageIds } = action.payload;

            // Update read status for messages in the current room
            if (state.currentChatRoom && state.currentChatRoom._id === roomId) {
                state.messages.forEach(message => {
                    // Skip messages from the reader
                    if (message.sender._id === reader) return;

                    // Update messages that were marked as read
                    if (messageIds === 'all' || (messageIds.includes && messageIds.includes(message._id))) {
                        // Update status to read
                        message.status = 'read';

                        // Add reader to readBy if not already there
                        if (!message.readBy.some(r => r.user === reader)) {
                            message.readBy.push({
                                user: reader,
                                readAt: new Date().toISOString()
                            });
                        }
                    }
                });
            }
        },

        socketUserTyping: (state, action) => {
            const { roomId, user } = action.payload;

            // Add user to typing users for this room
            if (!state.typingUsers[roomId]) {
                state.typingUsers[roomId] = [];
            }

            if (!state.typingUsers[roomId].some(u => u._id === user._id)) {
                state.typingUsers[roomId].push(user);
            }
        },

        socketUserStopTyping: (state, action) => {
            const { roomId, user } = action.payload;

            // Remove user from typing users for this room
            if (state.typingUsers[roomId]) {
                state.typingUsers[roomId] = state.typingUsers[roomId].filter(u => u._id !== user._id);
            }
        },

        socketUserStatusUpdate: (state, action) => {
            const { userId, online, lastSeen } = action.payload;

            // Update user status in the state
            if (!state.userStatuses) {
                state.userStatuses = {};
            }
            state.userStatuses[userId] = {
                online,
                lastSeen: lastSeen || new Date().toISOString()
            };
        },

        socketUserStatuses: (state, action) => {
            const { userStatuses } = action.payload;

            // Bulk update user statuses
            if (!state.userStatuses) {
                state.userStatuses = {};
            }
            state.userStatuses = { ...state.userStatuses, ...userStatuses };
        },

        // Manual actions
        clearMessages: (state) => {
            state.messages = [];
            state.currentChatRoom = null;
            state.page = 1;
            state.hasMore = true;
        },

        resetPagination: (state) => {
            state.page = 1;
            state.hasMore = true;
        },

        incrementPage: (state) => {
            state.page += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Chat Room
            .addCase(createChatRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createChatRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                // Check if the room already exists in the list
                if (!state.chatRooms.some(room => room._id === action.payload._id)) {
                    state.chatRooms.unshift(action.payload);
                }

                state.currentChatRoom = action.payload;
            })
            .addCase(createChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Chat Rooms
            .addCase(getChatRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChatRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.chatRooms = action.payload;
            })
            .addCase(getChatRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Chat Room Details
            .addCase(getChatRoomDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChatRoomDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChatRoom = action.payload.chatRoom;
                state.unreadCounts = action.payload.unreadCounts;

                // Handle pagination - append or replace messages
                if (state.page === 1) {
                    state.messages = action.payload.messages || [];
                } else {
                    // Add older messages at the beginning
                    const newMessages = (action.payload.messages || []).filter(
                        newMsg => !state.messages.some(existingMsg => existingMsg._id === newMsg._id)
                    );
                    state.messages = [...newMessages, ...state.messages];
                }

                // Check if there are more messages to load
                state.hasMore = action.payload.messages && action.payload.messages.length === 10; // using 10 as the limit
            })
            .addCase(getChatRoomDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to load messages';
            })

            // Send Message (REST fallback)
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;

                // Add message to current chat room if not already there
                if (!state.messages.some(message => message._id === action.payload._id)) {
                    state.messages.push(action.payload);
                }

                // Update chat room last message
                const roomIndex = state.chatRooms.findIndex(
                    room => room._id === action.payload.chatRoom
                );

                if (roomIndex !== -1) {
                    state.chatRooms[roomIndex].lastMessage = action.payload;
                    state.chatRooms[roomIndex].lastActivity = new Date().toISOString();

                    // Move room to top of list
                    const room = state.chatRooms[roomIndex];
                    state.chatRooms.splice(roomIndex, 1);
                    state.chatRooms.unshift(room);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Unread Message Counts
            .addCase(getUnreadMessageCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUnreadMessageCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.unreadCounts = action.payload.rooms.reduce((acc, room) => {
                    acc[room._id] = room.unreadCount;
                    return acc;
                }, {});
                state.totalUnread = action.payload.totalUnread;
            })
            .addCase(getUnreadMessageCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions for direct usage
export const {
    socketNewMessage,
    socketMessagesRead,
    socketUserTyping,
    socketUserStopTyping,
    socketUserStatusUpdate,
    socketUserStatuses,
    clearMessages,
    resetPagination,
    incrementPage
} = messageSlice.actions;

// Map socket actions to Redux actions
export const socketActionMap = {
    'SOCKET_NEW_MESSAGE': socketNewMessage,
    'SOCKET_MESSAGES_READ': socketMessagesRead,
    'SOCKET_USER_TYPING': socketUserTyping,
    'SOCKET_USER_STOP_TYPING': socketUserStopTyping,
    'SOCKET_USER_STATUS_UPDATE': socketUserStatusUpdate,
    'SOCKET_USER_STATUSES': socketUserStatuses
};

export default messageSlice.reducer;
