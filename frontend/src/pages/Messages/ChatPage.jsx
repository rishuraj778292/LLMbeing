import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getChatRooms,
    getChatRoomDetails,
    sendMessage,
    incrementPage,
    resetPagination,
    clearMessages
} from '../../../Redux/Slice/messageSlice';
import {
    initializeSocket,
    joinChatRoom,
    leaveChatRoom,
    sendMessage as socketSendMessage,
    markMessagesAsRead,
    sendTypingIndicator
} from '../../services/socketService';

const ChatPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { roomId } = useParams();

    // Redux state
    const { user, token } = useSelector((state) => state.auth);
    const {
        chatRooms,
        currentChatRoom,
        messages,
        loading,
        unreadCounts,
        totalUnread,
        typingUsers,
        page,
        hasMore
    } = useSelector((state) => state.messages);

    // Local state
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Initialize socket connection when component mounts
    useEffect(() => {
        if (token) {
            initializeSocket(token);
        }

        // Fetch chat rooms on mount
        dispatch(getChatRooms());

        // Clear chat state when unmounting
        return () => {
            dispatch(clearMessages());
        };
    }, [dispatch, token]);

    // Handle room change or initial load
    useEffect(() => {
        if (roomId) {
            // Reset pagination when changing rooms
            dispatch(resetPagination());

            // Fetch chat room details
            dispatch(getChatRoomDetails({ roomId, page: 1 }));

            // Join the socket room
            joinChatRoom(roomId);

            // Mark messages as read
            markMessagesAsRead(roomId);
        }

        // Leave the room when component unmounts or room changes
        return () => {
            if (roomId) {
                leaveChatRoom(roomId);
            }
        };
    }, [dispatch, roomId]);

    // Handle scrolling to load more messages
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop } = messagesContainerRef.current;

            // If scrolled to the top and there are more messages to load
            if (scrollTop === 0 && !loading && hasMore) {
                dispatch(incrementPage());
                dispatch(getChatRoomDetails({ roomId, page: page + 1 }));
            }
        }
    };

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > 0 && page === 1) {
            scrollToBottom();
        }
    }, [messages, page]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle typing indicator
    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            sendTypingIndicator(roomId, true);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            sendTypingIndicator(roomId, false);
        }, 3000);
    };

    // Handle message send
    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!messageText.trim()) return;

        // Send via socket for real-time update
        socketSendMessage(roomId, messageText, replyTo?.id);

        // Clear input and reply
        setMessageText('');
        setReplyTo(null);

        // Stop typing indicator
        setIsTyping(false);
        sendTypingIndicator(roomId, false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Scroll to bottom
        scrollToBottom();
    };

    // Format time for display
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format date for message groups
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Check if message is from current user
    const isOwnMessage = (senderId) => {
        return senderId === user?._id;
    };

    // Get user's conversation partner
    const getPartnerInfo = () => {
        if (!currentChatRoom) return { name: 'Loading...', image: null };

        const partner = currentChatRoom.participants.find(p => p._id !== user?._id);
        return {
            name: partner?.username || 'Unknown',
            image: partner?.profileImage
        };
    };

    // Check if we should show date divider
    const shouldShowDate = (index) => {
        if (index === 0) return true;

        const currentDate = new Date(messages[index].createdAt).toDateString();
        const prevDate = new Date(messages[index - 1].createdAt).toDateString();

        return currentDate !== prevDate;
    };

    // Render typing indicator
    const renderTypingIndicator = () => {
        if (!typingUsers || !typingUsers[roomId] || typingUsers[roomId].length === 0) {
            return null;
        }

        const typingUsernames = typingUsers[roomId]
            .map(user => user.username)
            .filter(username => username !== user?.username);

        if (typingUsernames.length === 0) return null;

        return (
            <div className="typing-indicator">
                <span className="dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </span>
                <span className="typing-text">
                    {typingUsernames.length === 1
                        ? `${typingUsernames[0]} is typing...`
                        : `Multiple people are typing...`}
                </span>
            </div>
        );
    };

    // Navigate to a different chat room
    const navigateToRoom = (id) => {
        navigate(`/messages/${id}`);
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                {/* Chat Rooms Sidebar */}
                <div className="chat-sidebar">
                    <h2>Messages {totalUnread > 0 && <span className="unread-badge">{totalUnread}</span>}</h2>

                    <div className="chat-rooms-list">
                        {chatRooms.map((room) => (
                            <div
                                key={room._id}
                                className={`chat-room-item ${room._id === roomId ? 'active' : ''}`}
                                onClick={() => navigateToRoom(room._id)}
                            >
                                {/* Get the other participant's info */}
                                {room.participants.map(participant =>
                                    participant._id !== user?._id && (
                                        <div key={participant._id} className="participant-info">
                                            {participant.profileImage ? (
                                                <img
                                                    src={participant.profileImage}
                                                    alt={participant.username}
                                                    className="participant-avatar"
                                                />
                                            ) : (
                                                <div className="participant-avatar-placeholder">
                                                    {participant.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <div className="room-details">
                                                <div className="room-name">
                                                    {participant.username}
                                                    {unreadCounts[room._id] > 0 && (
                                                        <span className="unread-count">{unreadCounts[room._id]}</span>
                                                    )}
                                                </div>

                                                {room.lastMessage && (
                                                    <div className="last-message">
                                                        {room.lastMessage.sender === user?._id ? 'You: ' : ''}
                                                        {room.lastMessage.content.length > 30
                                                            ? `${room.lastMessage.content.substring(0, 30)}...`
                                                            : room.lastMessage.content}
                                                    </div>
                                                )}

                                                {room.lastActivity && (
                                                    <div className="last-activity">
                                                        {new Date(room.lastActivity).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}

                                {/* Display project name if available */}
                                {room.project && (
                                    <div className="project-badge">
                                        {room.project.title}
                                    </div>
                                )}
                            </div>
                        ))}

                        {chatRooms.length === 0 && !loading && (
                            <div className="no-chats-message">
                                No chat rooms available
                            </div>
                        )}

                        {loading && chatRooms.length === 0 && (
                            <div className="loading-chats">
                                Loading chats...
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="chat-main">
                    {currentChatRoom ? (
                        <>
                            {/* Chat Header */}
                            <div className="chat-header">
                                <div className="chat-partner">
                                    {getPartnerInfo().image ? (
                                        <img
                                            src={getPartnerInfo().image}
                                            alt={getPartnerInfo().name}
                                            className="partner-avatar"
                                        />
                                    ) : (
                                        <div className="partner-avatar-placeholder">
                                            {getPartnerInfo().name.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <div className="partner-info">
                                        <h3>{getPartnerInfo().name}</h3>
                                        {currentChatRoom.project && (
                                            <div className="project-name">
                                                Project: {currentChatRoom.project.title}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div
                                className="messages-container"
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                            >
                                {loading && page === 1 ? (
                                    <div className="loading-messages">
                                        Loading messages...
                                    </div>
                                ) : (
                                    <>
                                        {/* Loading indicator for pagination */}
                                        {loading && page > 1 && (
                                            <div className="loading-more">
                                                Loading more messages...
                                            </div>
                                        )}

                                        {/* No messages placeholder */}
                                        {messages.length === 0 && !loading && (
                                            <div className="no-messages">
                                                No messages yet. Start the conversation!
                                            </div>
                                        )}

                                        {/* Messages list */}
                                        {messages.map((message, index) => (
                                            <React.Fragment key={message._id}>
                                                {/* Date divider */}
                                                {shouldShowDate(index) && (
                                                    <div className="date-divider">
                                                        <span>{formatDate(message.createdAt)}</span>
                                                    </div>
                                                )}

                                                {/* Message bubble */}
                                                <div
                                                    className={`message-wrapper ${isOwnMessage(message.sender._id) ? 'own-message' : ''}`}
                                                >
                                                    {/* Avatar (only for messages from others) */}
                                                    {!isOwnMessage(message.sender._id) && (
                                                        <>
                                                            {message.sender.profileImage ? (
                                                                <img
                                                                    src={message.sender.profileImage}
                                                                    alt={message.sender.username}
                                                                    className="message-avatar"
                                                                />
                                                            ) : (
                                                                <div className="message-avatar-placeholder">
                                                                    {message.sender.username.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    <div className="message-content">
                                                        {/* Reply reference */}
                                                        {message.replyTo && (
                                                            <div className="reply-reference">
                                                                <span className="reply-sender">
                                                                    {isOwnMessage(message.replyTo.sender._id) ? 'You' : message.replyTo.sender.username}
                                                                </span>
                                                                <span className="reply-content">
                                                                    {message.replyTo.content.length > 50
                                                                        ? `${message.replyTo.content.substring(0, 50)}...`
                                                                        : message.replyTo.content}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Message text */}
                                                        <div className="message-bubble">
                                                            <div className="message-text">{message.content}</div>
                                                            <div className="message-meta">
                                                                <span className="message-time">
                                                                    {formatTime(message.createdAt)}
                                                                </span>

                                                                {/* Read status for own messages */}
                                                                {isOwnMessage(message.sender._id) && (
                                                                    <span className={`message-status ${message.status}`}>
                                                                        {message.status === 'sent' ? '✓' :
                                                                            message.status === 'delivered' ? '✓✓' : '✓✓'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Message actions */}
                                                        <div className="message-actions">
                                                            <button
                                                                className="reply-button"
                                                                onClick={() => setReplyTo({
                                                                    id: message._id,
                                                                    content: message.content,
                                                                    sender: message.sender
                                                                })}
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}

                                        {/* Typing indicator */}
                                        {renderTypingIndicator()}

                                        {/* Reference element for scrolling to bottom */}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="message-input-container">
                                {/* Reply preview */}
                                {replyTo && (
                                    <div className="reply-preview">
                                        <div className="reply-preview-content">
                                            <span className="reply-to-label">
                                                Replying to {isOwnMessage(replyTo.sender._id) ? 'yourself' : replyTo.sender.username}:
                                            </span>
                                            <span className="reply-preview-text">
                                                {replyTo.content.length > 50
                                                    ? `${replyTo.content.substring(0, 50)}...`
                                                    : replyTo.content}
                                            </span>
                                        </div>
                                        <button
                                            className="cancel-reply"
                                            onClick={() => setReplyTo(null)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="message-form">
                                    <textarea
                                        className="message-input"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        onInput={handleTyping}
                                        placeholder="Type a message..."
                                        rows={1}
                                    />
                                    <button
                                        type="submit"
                                        className="send-button"
                                        disabled={!messageText.trim()}
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <h3>Select a conversation or start a new one</h3>
                            <p>
                                You can message freelancers about their applications to your projects
                                or respond to messages from clients.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
