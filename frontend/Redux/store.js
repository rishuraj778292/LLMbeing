import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slice/authSlice'
import projectReducer from './Slice/projectSlice'
import profileReducer from './Slice/profileSlice'
import applicationReducer from './Slice/applicationSlice'
import gigReducer from './Slice/gigSlice'
import savedProjectReducer from './Slice/savedProjectSlice'
import messageReducer, { socketActionMap } from './Slice/messageSlice'
import notificationReducer, { notificationSocketActionMap } from './Slice/notificationSlice'

// Custom middleware to allow for async dispatching
const asyncDispatchMiddleware = store => next => action => {
  const { dispatch, getState } = store;
  if (typeof action === 'object') {
    action.asyncDispatch = dispatch;
    action.getState = getState;
  }
  return next(action);
};

// Socket.io middleware to handle socket events
const socketMiddleware = () => next => action => {
  // Check if this is a socket event action
  if (action.type && action.type.startsWith('SOCKET_')) {
    // Map the socket event to a Redux action - try message actions first, then notification actions
    if (socketActionMap[action.type]) {
      return next(socketActionMap[action.type](action.payload));
    } else if (notificationSocketActionMap[action.type]) {
      return next(notificationSocketActionMap[action.type](action.payload));
    }
  }

  return next(action);
};

console.log('store loaded');
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    profile: profileReducer,
    applications: applicationReducer,
    gigs: gigReducer,
    savedProjects: savedProjectReducer,
    messages: messageReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'application/shortlistApplication/fulfilled',
          'application/rejectApplication/fulfilled',
          'SOCKET_NEW_MESSAGE',
          'SOCKET_MESSAGES_READ',
          'SOCKET_USER_TYPING',
          'SOCKET_USER_STOP_TYPING',
          'SOCKET_NEW_NOTIFICATION'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['asyncDispatch', 'getState', 'payload.readBy', 'payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: [
          'messages.messages.readBy',
          'messages.typingUsers',
          'messages.currentChatRoom'
        ],
      },
    }).concat(asyncDispatchMiddleware, socketMiddleware),
})