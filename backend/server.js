
import dotenv from 'dotenv'
// Configure dotenv at the very beginning to load all environment variables
dotenv.config()

// Log environment variable loading for debugging purposes
console.log("Environment variables loaded")

import connectDB from './config/db.js'
import app from './app.js'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Message from './models/message.model.js'
import ChatRoom from './models/chatRoom.model.js'
import User from './models/user.model.js'
import Notification from './models/notification.model.js'
import contentFilter from './utils/contentFilter.js'

const PORT = process.env.PORT || 5000;

// Log critical environment variables (without showing their values)
console.log(`Environment check: PORT=${!!process.env.PORT}, CORS_ORIGIN=${!!process.env.CORS_ORIGIN}, ACCESS_TOKEN_SECRET=${!!process.env.ACCESS_TOKEN_SECRET}`);

// Create HTTP server from express app
const server = http.createServer(app);

// Initialize socket.io on http server
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(url => url.trim()) : ["http://localhost:5173"],
        credentials: true,
    }
});

// Socket.io middleware for authentication
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error: Token not provided'));
        }

        // Verify JWT token
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessTokenSecret) {
            console.error("ACCESS_TOKEN_SECRET is not defined in environment variables");
            return next(new Error('Server configuration error: ACCESS_TOKEN_SECRET missing'));
        }
        const decoded = jwt.verify(token, accessTokenSecret);

        // Fetch user details
        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        // Attach user to socket for future reference
        socket.user = user;
        next();
    } catch (error) {
        console.error("Socket authentication error:", error.message);
        next(new Error('Authentication error: Invalid token'));
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.userName} (${socket.user._id})`);

    // Join user to their personal room (for direct messages)
    socket.join(socket.user._id.toString());

    // Broadcast user online status to relevant chat rooms
    broadcastUserStatus(socket.user._id, true);

    // Join existing chat rooms
    socket.on('join-room', async (roomId) => {
        try {
            // Verify user is a participant in the room
            const chatRoom = await ChatRoom.findById(roomId);

            if (!chatRoom) {
                return socket.emit('error', { message: 'Chat room not found' });
            }

            const isParticipant = chatRoom.participants.some(
                p => p.toString() === socket.user._id.toString()
            );

            if (!isParticipant) {
                return socket.emit('error', { message: 'Not authorized to join this room' });
            }

            // Join the room
            socket.join(roomId);
            console.log(`${socket.user.userName} joined room: ${roomId}`);

            // Mark messages as delivered for this user
            await Message.updateMany(
                {
                    chatRoom: roomId,
                    sender: { $ne: socket.user._id },
                    status: 'sent'
                },
                { status: 'delivered' }
            );

            // Emit room joined confirmation
            socket.emit('room-joined', { roomId });
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Leave a chat room
    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`${socket.user.userName} left room: ${roomId}`);
    });

    // Handle new message
    socket.on('send-message', async (data) => {
        try {
            const { roomId, content, replyToId } = data;

            if (!roomId || !content || content.trim() === '') {
                return socket.emit('error', { message: 'Room ID and message content are required' });
            }

            // Content filter check
            const contentValidation = contentFilter.validateContent(content);
            if (!contentValidation.isValid) {
                contentFilter.logViolation(socket.user._id, { message: content }, [{
                    field: 'message',
                    reason: contentValidation.reason,
                    flaggedWords: contentValidation.flaggedWords
                }]);

                return socket.emit('error', { message: 'Message contains inappropriate content' });
            }

            // Check if the chat room exists and user is a participant
            const chatRoom = await ChatRoom.findById(roomId).populate('participants');
            if (!chatRoom) {
                return socket.emit('error', { message: 'Chat room not found' });
            }

            const isParticipant = chatRoom.participants.some(
                p => p._id.toString() === socket.user._id.toString()
            );

            if (!isParticipant) {
                return socket.emit('error', { message: 'Not authorized to send messages in this room' });
            }

            // Validate reply message if provided
            if (replyToId) {
                const replyMessage = await Message.findById(replyToId);
                if (!replyMessage || replyMessage.chatRoom.toString() !== roomId) {
                    return socket.emit('error', { message: 'Invalid reply message' });
                }
            }

            // Create the message
            const message = await Message.create({
                chatRoom: roomId,
                sender: socket.user._id,
                content,
                replyTo: replyToId,
                status: 'sent'
            });

            // Update chat room's last activity and last message
            await ChatRoom.findByIdAndUpdate(roomId, {
                lastActivity: Date.now(),
                lastMessage: message._id
            });

            // Populate message with sender info and reply details
            const populatedMessage = await Message.findById(message._id)
                .populate('sender', 'userName profileImage')
                .populate('replyTo');

            // Emit message to all users in the room
            io.to(roomId).emit('new-message', populatedMessage);

            // Get recipients for notifications (all participants except sender)
            const recipients = chatRoom.participants.filter(
                p => p._id.toString() !== socket.user._id.toString()
            );

            // Create notifications and emit to offline users
            for (const recipient of recipients) {
                const notification = await Notification.create({
                    recipient: recipient._id,
                    sender: socket.user._id,
                    title: "New Message",
                    message: `${socket.user.userName} sent you a message`,
                    type: 'new_message',
                    relatedChatRoom: roomId
                });

                // Emit notification to recipient's personal room
                io.to(recipient._id.toString()).emit('notification', notification);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle read receipts
    socket.on('mark-read', async (data) => {
        try {
            const { roomId, messageIds } = data;

            if (!roomId) {
                return socket.emit('error', { message: 'Room ID is required' });
            }

            // Update message status to read
            if (messageIds && messageIds.length > 0) {
                // Mark specific messages as read
                await Message.updateMany(
                    {
                        _id: { $in: messageIds },
                        chatRoom: roomId,
                        sender: { $ne: socket.user._id }
                    },
                    {
                        status: 'read',
                        $addToSet: {
                            readBy: {
                                user: socket.user._id,
                                readAt: new Date()
                            }
                        }
                    }
                );
            } else {
                // Mark all unread messages in the room as read
                await Message.updateMany(
                    {
                        chatRoom: roomId,
                        sender: { $ne: socket.user._id },
                        'readBy.user': { $ne: socket.user._id }
                    },
                    {
                        status: 'read',
                        $addToSet: {
                            readBy: {
                                user: socket.user._id,
                                readAt: new Date()
                            }
                        }
                    }
                );
            }

            // Notify other users in the room about the read status
            socket.to(roomId).emit('messages-read', {
                roomId,
                reader: socket.user._id,
                messageIds: messageIds || 'all'
            });

        } catch (error) {
            console.error('Error marking messages as read:', error);
            socket.emit('error', { message: 'Failed to mark messages as read' });
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        const { roomId } = data;
        socket.to(roomId).emit('user-typing', {
            roomId,
            user: {
                _id: socket.user._id,
                userName: socket.user.userName
            }
        });
    });

    socket.on('stop-typing', (data) => {
        const { roomId } = data;
        socket.to(roomId).emit('user-stop-typing', {
            roomId,
            user: {
                _id: socket.user._id,
                userName: socket.user.userName
            }
        });
    });

    // Handle user status updates
    socket.on('user-status', (data) => {
        const { online } = data;
        broadcastUserStatus(socket.user._id, online);
    });

    // Handle request for user statuses
    socket.on('get-user-statuses', async (data) => {
        try {
            const { userIds } = data;
            const userStatuses = {};

            // Check online status for each user by checking if they have active socket connections
            for (const userId of userIds) {
                const userSockets = await io.in(userId).allSockets();
                userStatuses[userId] = {
                    online: userSockets.size > 0,
                    lastSeen: new Date().toISOString()
                };
            }

            socket.emit('user-statuses', { userStatuses });
        } catch (error) {
            console.error('Error getting user statuses:', error);
            socket.emit('error', { message: 'Failed to get user statuses' });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.userName}`);
        // Broadcast user offline status
        setTimeout(() => {
            // Check if user still has other connections before marking offline
            io.in(socket.user._id.toString()).allSockets().then(sockets => {
                if (sockets.size === 0) {
                    broadcastUserStatus(socket.user._id, false);
                }
            });
        }, 1000); // Small delay to avoid race conditions
    });
});

// Helper function to broadcast user status to relevant chat rooms
async function broadcastUserStatus(userId, online) {
    try {
        // Find all chat rooms where this user is a participant
        const chatRooms = await ChatRoom.find({
            participants: userId,
            isActive: true
        }).populate('participants', '_id');

        // Broadcast status to all relevant chat rooms
        for (const room of chatRooms) {
            io.to(room._id.toString()).emit('user-status-update', {
                userId: userId.toString(),
                online,
                lastSeen: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Error broadcasting user status:', error);
    }
}

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("MongoDB connected");
        // Check all required environment variables before starting the server
        const requiredEnvVars = ['ACCESS_TOKEN_SECRET', 'PORT'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            console.warn(`Warning: The following environment variables are missing: ${missingVars.join(', ')}`);
            console.warn('Server will start with default values where available, but some features may not work correctly.');
        }

        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
            console.log(`CORS is configured for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });







