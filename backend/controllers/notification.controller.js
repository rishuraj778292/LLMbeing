import Notification from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Get all notifications for the authenticated user
const getNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = req.user._id;

    const notifications = await Notification.getUserNotifications(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        unreadOnly: unreadOnly === 'true'
    });

    // Get unread count
    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false
    });

    return res.status(200).json(
        new ApiResponse(200, {
            notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: notifications.length
            }
        }, "Notifications retrieved successfully")
    );
});

// Mark a specific notification as read
const markAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    await notification.markAsRead();

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    );
});

// Mark all notifications as read for the authenticated user
const markAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await Notification.markAllAsRead(userId);

    return res.status(200).json(
        new ApiResponse(200, {
            modifiedCount: result.modifiedCount
        }, "All notifications marked as read")
    );
});

// Delete a specific notification
const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Notification deleted successfully")
    );
});

// Get unread notification count
const getUnreadCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false
    });

    return res.status(200).json(
        new ApiResponse(200, { unreadCount }, "Unread count retrieved successfully")
    );
});

// Create a notification (mainly for admin or system use)
const createNotification = asyncHandler(async (req, res) => {
    const {
        recipient,
        title,
        message,
        type,
        actionUrl,
        relatedId,
        relatedType
    } = req.body;

    const notification = await Notification.createNotification({
        recipient,
        sender: req.user._id,
        title,
        message,
        type,
        actionUrl,
        relatedId,
        relatedType
    });

    return res.status(201).json(
        new ApiResponse(201, notification, "Notification created successfully")
    );
});

export {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    createNotification
};
