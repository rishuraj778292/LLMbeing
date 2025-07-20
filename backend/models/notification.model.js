import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
    // Core Relationships
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Recipient is required"],
        index: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    // Notification Content
    title: {
        type: String,
        required: [true, "Notification title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    message: {
        type: String,
        required: [true, "Notification message is required"],
        trim: true,
        maxlength: [500, "Message cannot exceed 500 characters"]
    },

    // Simple notification types for V1
    type: {
        type: String,
        required: [true, "Notification type is required"],
        enum: [
            // Project related
            'project_application',
            'application_accepted',
            'application_rejected',
            'project_completed',

            // Message related
            'new_message',

            // System related
            'profile_verified',
            'system_announcement'
        ],
        index: true
    },

    // Basic action URL
    actionUrl: {
        type: String,
        trim: true
    },

    // Related entity (simple)
    relatedId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    relatedType: {
        type: String,
        enum: ['Project', 'Application', 'Message', 'User']
    },

    // Status
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for performance
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ relatedId: 1, relatedType: 1 });

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function (userId, options = {}) {
    const { unreadOnly = false, limit = 20, page = 1 } = options;

    const query = { recipient: userId };
    if (unreadOnly) query.isRead = false;

    return this.find(query)
        .populate('sender', 'userName fullName profileImage')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function (userId) {
    return this.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

// Static method to create notification
notificationSchema.statics.createNotification = function (data) {
    return this.create({
        recipient: data.recipient,
        sender: data.sender,
        title: data.title,
        message: data.message,
        type: data.type,
        actionUrl: data.actionUrl,
        relatedId: data.relatedId,
        relatedType: data.relatedType
    });
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = function () {
    if (!this.isRead) {
        this.isRead = true;
        this.readAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
