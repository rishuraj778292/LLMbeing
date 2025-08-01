import express from 'express';
import verifyToken from '../middleware/verifyToken.middleware.js';
import {
    createChatRoom,
    getChatRooms,
    getChatRoomDetails,
    sendMessage,
    getUnreadMessageCounts
} from '../controllers/message.controller.js';

const router = express.Router();

// Apply JWT verification to all message routes
router.use(verifyToken);

// Chat room routes
router.post('/chatrooms', createChatRoom);
router.get('/chatrooms', getChatRooms);
router.get('/chatrooms/:roomId', getChatRoomDetails);
router.post('/chatrooms/:roomId/messages', sendMessage);
router.get('/unread-counts', getUnreadMessageCounts);

export default router;
