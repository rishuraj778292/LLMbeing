import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    createNotification
} from '../controllers/notification.controller.js';
import verifyToken from '../middleware/verifyToken.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all notifications for the authenticated user
router.get('/', getNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Mark a specific notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

// Delete a specific notification
router.delete('/:notificationId', deleteNotification);

// Create a notification (mainly for admin/system use)
router.post('/', createNotification);

export default router;
