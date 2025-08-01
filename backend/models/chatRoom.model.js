import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatRoomSchema = new Schema({
    // Simple participants - just user IDs
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    // Simple room type - only project-based chat for V1
    type: {
        type: String,
        enum: ['project', 'direct'],
        default: 'direct',
        required: true,
        index: true
    },

    // What project this chat is about (optional)
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },

    // Basic room info
    name: {
        type: String,
        trim: true,
        maxlength: [100, "Room name cannot exceed 100 characters"]
    },

    // Last activity tracking
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastActivity: {
        type: Date,
        default: Date.now,
        index: true
    },

    // Simple status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Simple indexes for V1
ChatRoomSchema.index({ participants: 1 });
ChatRoomSchema.index({ project: 1 });
ChatRoomSchema.index({ type: 1, isActive: 1 });
ChatRoomSchema.index({ lastActivity: -1 });

// Static method to find or create direct chat between two users
ChatRoomSchema.statics.findOrCreateDirectChat = async function (user1Id, user2Id) {
    // Look for existing direct chat between these users
    let chatRoom = await this.findOne({
        type: 'direct',
        participants: { $all: [user1Id, user2Id], $size: 2 }
    });

    if (!chatRoom) {
        // Create new direct chat
        chatRoom = await this.create({
            type: 'direct',
            participants: [user1Id, user2Id],
            name: 'Direct Chat'
        });
    }

    return chatRoom;
};

// Static method to find project chat
ChatRoomSchema.statics.findProjectChat = async function (projectId, participantIds) {
    return await this.findOne({
        type: 'project',
        project: projectId,
        participants: { $all: participantIds }
    });
};

// Get user's chat rooms
ChatRoomSchema.statics.getUserChatRooms = function (userId) {
    return this.find({
        participants: userId,
        isActive: true
    })
        .populate('participants', 'userName fullName profileImage')
        .populate('lastMessage')
        .populate('project', 'title')
        .sort({ lastActivity: -1 });
};

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
export default ChatRoom;