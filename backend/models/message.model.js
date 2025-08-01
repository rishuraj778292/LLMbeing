import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
    // Core Relationships
    chatRoom: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: [true, "Chat room reference is required"],
        index: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Sender is required"],
        index: true
    },

    // Simple text content only for V1
    content: {
        type: String,
        required: [true, "Message content is required"],
        trim: true,
        maxlength: [2000, "Message cannot exceed 2000 characters"]
    },

    // Message Status
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },

    // Read receipts - simple array of user IDs who read this message
    readBy: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Simple reply functionality
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        index: true
    },

    // Message flags
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for performance
messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ status: 1 });

// Static method to get messages for a chat room
messageSchema.statics.getChatMessages = function (chatRoomId, options = {}) {
    const { limit = 50, page = 1, before = null } = options;

    const query = {
        chatRoom: chatRoomId,
        isDeleted: false
    };

    if (before) {
        query.createdAt = { $lt: new Date(before) };
    }

    return this.find(query)
        .populate('sender', 'userName fullName profileImage')
        .populate('replyTo')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
};

// Instance method to mark as read by user
messageSchema.methods.markAsRead = function (userId) {
    const alreadyRead = this.readBy.some(r => r.user.toString() === userId.toString());

    if (!alreadyRead) {
        this.readBy.push({ user: userId });
        return this.save();
    }

    return Promise.resolve(this);
};

// Instance method to edit message
messageSchema.methods.editContent = function (newContent, editorId) {
    if (this.sender.toString() !== editorId.toString()) {
        throw new Error('Only sender can edit message');
    }

    this.content = newContent;
    this.isEdited = true;
    return this.save();
};

// Instance method to soft delete message
messageSchema.methods.deleteMessage = function (deleterId) {
    if (this.sender.toString() !== deleterId.toString()) {
        throw new Error('Only sender can delete message');
    }

    this.isDeleted = true;
    this.content = 'This message was deleted';
    return this.save();
};

const Message = mongoose.model('Message', messageSchema);
export default Message;