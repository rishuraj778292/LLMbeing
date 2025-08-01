import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Message from "../models/message.model.js";
import ChatRoom from "../models/chatRoom.model.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Notification from "../models/notification.model.js";
import contentFilter from "../utils/contentFilter.js";

// Create a new chat room (when client wants to message a freelancer for a project)
const createChatRoom = asyncHandler(async (req, res) => {
    const { projectId, freelancerId } = req.body;
    const clientId = req.user._id;

    // Validations
    if (!projectId) throw new ApiError(400, "Project ID is required");
    if (!freelancerId) throw new ApiError(400, "Freelancer ID is required");

    // Check if the user is a client
    if (req.user.role !== 'client') {
        throw new ApiError(403, "Only clients can initiate project chats");
    }

    // Check if project exists and belongs to the client
    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    if (project.client.toString() !== clientId.toString()) {
        throw new ApiError(403, "You can only message freelancers for your own projects");
    }

    // Check if the freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer) throw new ApiError(404, "Freelancer not found");
    if (freelancer.role !== 'freelancer') {
        throw new ApiError(400, "The selected user is not a freelancer");
    }

    // Check if a chat room already exists for this project and these participants
    let chatRoom = await ChatRoom.findOne({
        project: projectId,
        participants: { $all: [clientId, freelancerId] }
    });

    // If chat room doesn't exist, create it
    if (!chatRoom) {
        chatRoom = await ChatRoom.create({
            participants: [clientId, freelancerId],
            type: 'project',
            project: projectId,
            name: `Chat for ${project.title}`,
            isActive: true
        });

        // Create a notification for the freelancer
        await Notification.create({
            recipient: freelancerId,
            sender: clientId,
            title: "New Chat Room",
            message: `${req.user.username} has created a chat room for project: ${project.title}`,
            type: 'new_message',
            relatedProject: projectId,
            relatedChatRoom: chatRoom._id
        });
    }

    return res.status(201).json(
        new ApiResponse(201, chatRoom, "Chat room created or retrieved successfully")
    );
});

// Get all chat rooms for the logged-in user
const getChatRooms = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get all chat rooms where the user is a participant, sorted by last activity
    const chatRooms = await ChatRoom.find({
        participants: userId,
        isActive: true
    })
        .populate('participants', 'userName profileImage role')
        .populate('project', 'title')
        .populate('lastMessage')
        .sort({ lastActivity: -1 });

    return res.status(200).json(
        new ApiResponse(200, chatRooms, "Chat rooms retrieved successfully")
    );
});

// Get chat room details including messages
const getChatRoomDetails = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user._id;

    // Validate chat room exists and user is a participant
    const chatRoom = await ChatRoom.findById(roomId)
        .populate('participants', 'userName profileImage role')
        .populate('project', 'title');

    if (!chatRoom) throw new ApiError(404, "Chat room not found");

    // Check if user is a participant
    if (!chatRoom.participants.some(p => p._id.toString() === userId.toString())) {
        throw new ApiError(403, "You are not a participant in this chat room");
    }

    // Get messages for this chat room, with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatRoom: roomId })
        .populate('sender', 'userName profileImage')
        .populate('replyTo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Mark messages as read
    await Message.updateMany(
        {
            chatRoom: roomId,
            sender: { $ne: userId },
            'readBy.user': { $ne: userId }
        },
        {
            $push: {
                readBy: {
                    user: userId,
                    readAt: new Date()
                }
            },
            $set: { status: 'read' }
        }
    );

    // Get unread count for all other chat rooms
    const unreadCounts = await ChatRoom.aggregate([
        { $match: { participants: userId, _id: { $ne: chatRoom._id } } },
        {
            $lookup: {
                from: 'messages',
                let: { roomId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$chatRoom', '$$roomId'] },
                                    { $ne: ['$sender', userId] },
                                    { $not: [{ $in: [userId, '$readBy.user'] }] }
                                ]
                            }
                        }
                    },
                    { $count: 'unread' }
                ],
                as: 'unreadInfo'
            }
        },
        {
            $project: {
                _id: 1,
                unreadCount: { $ifNull: [{ $arrayElemAt: ['$unreadInfo.unread', 0] }, 0] }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            chatRoom,
            messages: messages.reverse(), // Return in chronological order
            unreadCounts: Object.fromEntries(unreadCounts.map(item => [item._id, item.unreadCount]))
        }, "Chat room details retrieved successfully")
    );
});

// Send a message via REST API (as backup to socket.io)
const sendMessage = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { content, replyToId } = req.body;
    const senderId = req.user._id;

    // Validate required fields
    if (!content || content.trim() === '') {
        throw new ApiError(400, "Message content is required");
    }

    // Content filter check
    const contentValidation = contentFilter.validateContent(content);
    if (!contentValidation.isValid) {
        contentFilter.logViolation(senderId, { message: content }, [{
            field: 'message',
            reason: contentValidation.reason,
            flaggedWords: contentValidation.flaggedWords
        }]);

        throw new ApiError(400, "Message contains inappropriate content");
    }

    // Check if the chat room exists and user is a participant
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) throw new ApiError(404, "Chat room not found");

    if (!chatRoom.participants.some(p => p.toString() === senderId.toString())) {
        throw new ApiError(403, "You are not a participant in this chat room");
    }

    // Validate reply message if provided
    let replyTo = null;
    if (replyToId) {
        replyTo = await Message.findById(replyToId);
        if (!replyTo || replyTo.chatRoom.toString() !== roomId) {
            throw new ApiError(400, "Invalid reply message");
        }
    }

    // Create the message
    const message = await Message.create({
        chatRoom: roomId,
        sender: senderId,
        content,
        replyTo: replyToId,
        status: 'sent'
    });

    // Update chat room's last activity and last message
    await ChatRoom.findByIdAndUpdate(roomId, {
        lastActivity: Date.now(),
        lastMessage: message._id
    });

    // Get recipient IDs (all participants except sender)
    const recipients = chatRoom.participants.filter(
        p => p.toString() !== senderId.toString()
    );

    // Create notifications for all recipients
    const sender = await User.findById(senderId, 'username');
    const notificationPromises = recipients.map(recipientId => {
        return Notification.create({
            recipient: recipientId,
            sender: senderId,
            title: "New Message",
            message: `${sender.username} sent you a message`,
            type: 'new_message',
            relatedChatRoom: roomId
        });
    });

    await Promise.all(notificationPromises);

    // Return the created message
    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username profileImage')
        .populate('replyTo');

    return res.status(201).json(
        new ApiResponse(201, populatedMessage, "Message sent successfully")
    );
});

// Get user's unread messages count
const getUnreadMessageCounts = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get all chat rooms with unread message counts
    const unreadCounts = await ChatRoom.aggregate([
        { $match: { participants: userId } },
        {
            $lookup: {
                from: 'messages',
                let: { roomId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$chatRoom', '$$roomId'] },
                                    { $ne: ['$sender', userId] },
                                    { $not: [{ $in: [userId, '$readBy.user'] }] }
                                ]
                            }
                        }
                    },
                    { $count: 'unread' }
                ],
                as: 'unreadInfo'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                unreadCount: { $ifNull: [{ $arrayElemAt: ['$unreadInfo.unread', 0] }, 0] }
            }
        }
    ]);

    // Calculate total unread count
    const totalUnread = unreadCounts.reduce((sum, room) => sum + room.unreadCount, 0);

    return res.status(200).json(
        new ApiResponse(200, {
            rooms: unreadCounts,
            totalUnread
        }, "Unread message counts retrieved successfully")
    );
});

export {
    createChatRoom,
    getChatRooms,
    getChatRoomDetails,
    sendMessage,
    getUnreadMessageCounts
};
