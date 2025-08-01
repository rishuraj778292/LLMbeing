import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getChatRooms,
  getChatRoomDetails,
  getUnreadMessageCounts,
  resetPagination,
  clearMessages
} from '../../../Redux/Slice/messageSlice';
import {
  joinChatRoom,
  leaveChatRoom,
  sendMessage as socketSendMessage,
  markMessagesAsRead,
  sendTypingIndicator,
  requestUserStatuses,
  updateOnlineStatus
} from '../../services/socketService';
import { Send, MoreVertical, Paperclip, Smile, Search, ArrowLeft, Circle, CheckCheck, Clock, Image, FileText, Info, Plus, Filter, Briefcase, MessageCircle, Users } from 'lucide-react';

const Messages = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    chatRooms,
    currentChatRoom,
    messages,
    loading,
    unreadCounts,
    typingUsers,
    userStatuses
  } = useSelector((state) => state.messages);

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, active
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mock data for chats - will be replaced with Redux/API calls
  const [chats, setChats] = useState([
    // Empty array to show no messages state
  ]);

  // Common emojis for quick access
  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😍', '🤔', '😅', '🙏', '💪', '👏', '🔥', '✨', '🎉', '💯'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize socket connection and fetch chat rooms
  useEffect(() => {
    // Fetch chat rooms and unread counts when component mounts
    dispatch(getChatRooms());
    dispatch(getUnreadMessageCounts());

    // Update user's online status
    updateOnlineStatus(true);

    // Clean up on unmount
    return () => {
      // Clear any timeouts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Clear messages and update status
      dispatch(clearMessages());
      updateOnlineStatus(false);
    };
  }, [dispatch]);

  // Handle chat selection - Initial setup and API call
  useEffect(() => {
    let isComponentMounted = true;

    if (selectedChat) {
      const roomId = selectedChat.id;

      // Reset pagination and fetch messages
      dispatch(resetPagination());
      setLoadingError(false);

      // Add error handling for the chat room details request
      dispatch(getChatRoomDetails({ roomId, page: 1, limit: 10 }))
        .unwrap()
        .catch(error => {
          if (isComponentMounted) {
            console.error('Error loading messages:', error);
            setLoadingError(true);
          }
        });

      // Join socket room and mark messages as read
      joinChatRoom(roomId);
      markMessagesAsRead(roomId);

      // Leave room on cleanup
      return () => {
        isComponentMounted = false;
        leaveChatRoom(roomId);
      };
    }

    return () => {
      isComponentMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedChat?.id]); // Only depend on the ID, not the whole object

  // Update UI with messages from Redux - Separate effect to avoid infinite loop
  useEffect(() => {
    if (selectedChat && currentChatRoom && messages && messages.length > 0) {
      // Only update local state when messages actually change
      const updatedChat = {
        ...selectedChat,
        messages: messages.map(msg => ({
          id: msg._id,
          sender: msg.sender._id === user._id ? 'me' : msg.sender._id,
          senderName: msg.sender.userName,
          senderImage: msg.sender.profileImage,
          message: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: msg.status,
          timestamp: new Date(msg.createdAt).getTime(),
          replyTo: msg.replyTo ? {
            id: msg.replyTo._id,
            message: msg.replyTo.content,
            sender: msg.replyTo.sender._id === user._id ? 'me' : msg.replyTo.sender._id
          } : null
        }))
      };
      setSelectedChat(updatedChat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatRoom?._id, messages, user._id]);

  // Update chatrooms list when Redux state changes and handle initial chat selection
  useEffect(() => {
    if (chatRooms.length > 0) {
      // Get all participant IDs to request their online status
      const participantIds = chatRooms.flatMap(room =>
        room.participants.filter(p => p._id !== user._id).map(p => p._id)
      );

      if (participantIds.length > 0) {
        requestUserStatuses(participantIds);
      }

      const formattedChats = chatRooms.map(room => {
        // Find the other participant
        const otherParticipant = room.participants.find(p => p._id !== user._id);
        const userStatus = userStatuses[otherParticipant?._id];
        const isOnline = userStatus?.online || false;
        const lastActivity = room.lastActivity ? new Date(room.lastActivity) : new Date();

        return {
          id: room._id,
          name: otherParticipant?.userName || 'Unknown User',
          avatar: otherParticipant?.profileImage || '/src/assets/user_icon.png',
          role: otherParticipant?.role || 'User',
          lastMessage: room.lastMessage?.content || 'No messages yet',
          lastMessageTime: room.lastMessage ? new Date(room.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          lastSeen: isOnline ? 'Online now' : `${Math.floor((new Date() - lastActivity) / (1000 * 60))} min ago`,
          unreadCount: unreadCounts[room._id] || 0,
          online: isOnline,
          projectTitle: room.project?.title || 'Direct Message',
          projectId: room.project?._id,
          messages: []
        };
      });

      setChats(formattedChats);

      // Check if we need to select a specific chat from navigation
      const selectedChatId = location.state?.selectedChatId;
      if (selectedChatId && !selectedChat) {
        const chatToSelect = formattedChats.find(chat => chat.id === selectedChatId);
        if (chatToSelect) {
          setSelectedChat(chatToSelect);
          setShowMobileChat(true); // Show the chat on mobile
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRooms, unreadCounts, userStatuses, user._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping && selectedChat) {
      setIsTyping(true);
      sendTypingIndicator(selectedChat.id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (selectedChat) {
        sendTypingIndicator(selectedChat.id, false);
      }
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      // Create new message object for UI
      const newMessage = {
        id: Date.now().toString(),
        sender: 'me',
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        timestamp: new Date().getTime(),
        replyTo: replyTo ? {
          id: replyTo.id,
          message: replyTo.message,
          sender: replyTo.sender
        } : null
      };

      try {
        // Send via socket for real-time update
        socketSendMessage(selectedChat.id, message.trim(), replyTo?.id);

        // Update local state immediately for better UX
        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage]
        }));

        // Clear input, reply, and emoji picker
        setMessage('');
        setReplyTo(null);
        setShowEmojiPicker(false);

        // Stop typing indicator
        setIsTyping(false);
        sendTypingIndicator(selectedChat.id, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Scroll to bottom
        scrollToBottom();
      } catch (error) {
        console.error('Failed to send message:', error);
        // Show error notification
      }
    }
  };

  const handleFileUpload = async (type) => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else if (type === 'pdf') {
      fileInputRef.current?.click();
    }
    setShowFileOptions(false);
  };

  const handleFileSelect = async (event, type) => {
    const file = event.target.files[0];
    if (file && selectedChat) {
      try {
        // TODO: Replace with actual file upload API when backend supports it
        // For now, just send a message with the file name

        // Create file message content
        const fileContent = `📎 ${file.name} (${type === 'image' ? 'Image' : 'File'})`;

        // Send via socket
        socketSendMessage(selectedChat.id, fileContent, null);

        // Create local message for immediate display
        const fileMessage = {
          id: Date.now().toString(),
          sender: 'me',
          message: fileContent,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          timestamp: new Date().getTime(),
          fileType: type,
          fileName: file.name
        };

        // Update local state
        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, fileMessage]
        }));

        // Reset file input
        event.target.value = '';

        // Scroll to bottom
        scrollToBottom();
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    // Focus the input after adding emoji
    document.querySelector('.message-input')?.focus();
  };

  const handleReply = (msg) => {
    setReplyTo({
      id: msg.id,
      message: msg.message,
      sender: msg.sender
    });
    // Focus the input after setting reply
    document.querySelector('.message-input')?.focus();
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return null;
    }
  };

  // Apply filters to chats
  const getFilteredChats = () => {
    let filtered = chats;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(chat => chat.unreadCount > 0);
        break;
      case 'active':
        filtered = filtered.filter(chat => chat.lastMessageTime); // Has at least one message
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    return filtered;
  };

  const filteredChats = getFilteredChats();

  // Check for typing users in the selected chat
  const isPartnerTyping = () => {
    if (!selectedChat || !typingUsers || !typingUsers[selectedChat.id]) {
      return false;
    }

    // Check if any typing user is not the current user
    return typingUsers[selectedChat.id].some(typingUserId => typingUserId !== user._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversations Sidebar */}
          <div className={`lg:col-span-4 ${showMobileChat ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex space-x-2">
                  {['all', 'unread', 'active'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize cursor-pointer ${activeFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations List */}
              <div className="max-h-[600px] overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-500 mb-4">
                      {user?.role === 'freelancer'
                        ? 'Start connecting with clients by applying to projects.'
                        : 'Start connecting with freelancers by posting projects or clicking the "Message Freelancer" button in your applications.'
                      }
                    </p>
                    <div className="flex justify-center gap-4 mb-6">
                      {user?.role === 'freelancer' ? (
                        <button
                          onClick={() => navigate('/projects')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                        >
                          Find Projects
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/post-project')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                        >
                          Post a Project
                        </button>
                      )}
                      <button
                        onClick={() => navigate('/manage-projects/applications')}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm"
                      >
                        View Applications
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => {
                          setSelectedChat(chat);
                          setShowMobileChat(true);

                          // Mark messages as read when selecting a chat
                          if (chat.unreadCount > 0) {
                            markMessagesAsRead(chat.id);
                          }
                        }}
                        className={`p-6 cursor-pointer transition-all hover:bg-gray-50 ${selectedChat?.id === chat.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                          }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={chat.avatar}
                              alt={chat.name}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                            {chat.online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                              <span className="text-sm text-gray-500">{chat.lastMessageTime}</span>
                            </div>

                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`text-sm font-medium capitalize ${chat.role === 'freelancer' ? 'text-green-600' :
                                chat.role === 'client' ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                {chat.role}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className={`text-sm ${chat.online ? 'text-green-600' : 'text-gray-500'}`}>
                                {chat.online ? 'Online' : `Last seen ${chat.lastSeen}`}
                              </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                              <h4 className="font-medium text-gray-900 text-sm mb-1">{chat.projectTitle}</h4>
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="text-gray-600 text-sm truncate flex-1 mr-2">{chat.lastMessage}</p>
                              {chat.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-8 ${!showMobileChat ? 'hidden lg:block' : 'block'}`}>
            {selectedChat ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setShowMobileChat(false)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>

                      <div className="relative">
                        <img
                          src={selectedChat.avatar}
                          alt={selectedChat.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        {selectedChat.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{selectedChat.name}</h2>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className={`font-medium capitalize ${selectedChat.role === 'freelancer' ? 'text-green-600' :
                            selectedChat.role === 'client' ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                            {selectedChat.role}
                          </span>
                          <span>•</span>
                          <span className={selectedChat.online ? 'text-green-600' : 'text-gray-500'}>
                            {selectedChat.online ? 'Online now' : `Last seen ${selectedChat.lastSeen}`}
                          </span>
                        </div>
                        <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                          <span className="text-sm font-medium text-gray-900">{selectedChat.projectTitle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <Info className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-6 bg-gray-50" ref={messagesContainerRef}>
                  {loading && (
                    <div className="flex justify-center items-center h-20">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}

                  {loadingError && (
                    <div className="flex flex-col items-center justify-center h-20 bg-red-50 p-4 rounded-lg border border-red-200 my-4">
                      <p className="text-red-600 mb-2">There was an error loading messages</p>
                      <button
                        onClick={() => {
                          setLoadingError(false);
                          if (selectedChat) {
                            dispatch(getChatRoomDetails({ roomId: selectedChat.id, page: 1, limit: 5 }))
                              .unwrap()
                              .catch(error => {
                                console.error('Error reloading messages:', error);
                                setLoadingError(true);
                              });
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        Try Again (Minimal Messages)
                      </button>
                    </div>
                  )}

                  {selectedChat.messages && selectedChat.messages.length > 0 ? (
                    <div className="space-y-6">
                      {selectedChat.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-sm lg:max-w-md ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`px-5 py-4 rounded-2xl shadow-sm ${msg.sender === 'me'
                                ? 'bg-blue-600 text-white ml-auto'
                                : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                            >
                              {/* Reply reference */}
                              {msg.replyTo && (
                                <div className={`mb-2 p-2 rounded-lg text-xs border-l-2 ${msg.sender === 'me'
                                  ? 'bg-blue-700 border-blue-300'
                                  : 'bg-gray-100 border-gray-300'
                                  }`}>
                                  <p className="font-medium mb-1">
                                    {msg.replyTo.sender === 'me'
                                      ? (msg.sender === 'me' ? 'You replied to yourself' : `You`)
                                      : (msg.sender === 'me' ? `Replying to ${selectedChat.name}` : `${selectedChat.name} replied to you`)}
                                  </p>
                                  <p className="truncate">{msg.replyTo.message}</p>
                                </div>
                              )}

                              <p className="leading-relaxed">{msg.message}</p>
                              <div className={`flex items-center justify-between mt-3 space-x-2`}>
                                <span className={`text-xs ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {msg.time}
                                </span>
                                {msg.sender === 'me' && (
                                  <div className="flex-shrink-0">
                                    {getStatusIcon(msg.status)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Message Actions */}
                            <div className={`mt-2 flex justify-${msg.sender === 'me' ? 'end' : 'start'}`}>
                              <button
                                onClick={() => handleReply(msg)}
                                className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isPartnerTyping() && (
                        <div className="flex justify-start">
                          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <MessageCircle className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Start the conversation</h3>
                      <p className="text-gray-500 max-w-sm">
                        Send your first message to {selectedChat.name} about {selectedChat.projectTitle}.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 bg-white">
                  {/* File Upload Inputs */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'image')}
                    className="hidden"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileSelect(e, 'pdf')}
                    className="hidden"
                  />

                  <div className="relative">
                    {/* File Upload Options */}
                    {showFileOptions && (
                      <div className="absolute bottom-20 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 min-w-[240px]">
                        <div className="space-y-2">
                          <button
                            onClick={() => handleFileUpload('image')}
                            className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Image className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <span className="font-medium text-gray-700">Upload Image</span>
                              <p className="text-sm text-gray-500">JPG, PNG, GIF files</p>
                            </div>
                          </button>
                          <button
                            onClick={() => handleFileUpload('pdf')}
                            className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="text-left">
                              <span className="font-medium text-gray-700">Upload Document</span>
                              <p className="text-sm text-gray-500">PDF, DOC, DOCX files</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-20 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20">
                        <div className="grid grid-cols-8 gap-2">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiClick(emoji)}
                              className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-lg hover:scale-110 transform cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setShowFileOptions(!showFileOptions);
                          setShowEmojiPicker(false);
                        }}
                        className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>

                      {/* Reply UI */}
                      {replyTo && (
                        <div className="absolute -top-16 left-0 right-0 bg-gray-100 border-t border-gray-200 p-3 rounded-t-xl flex justify-between items-center">
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs text-gray-500">
                              Replying to {replyTo.sender === 'me' ? 'yourself' : selectedChat.name}
                            </p>
                            <p className="text-sm text-gray-700 truncate">{replyTo.message}</p>
                          </div>
                          <button
                            onClick={cancelReply}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          onInput={handleTyping}
                          placeholder={isPartnerTyping() ? `${selectedChat.name} is typing...` : "Type your message..."}
                          className="message-input w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-14"
                        />
                        <button
                          onClick={() => {
                            setShowEmojiPicker(!showEmojiPicker);
                            setShowFileOptions(false);
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Smile className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6"></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Messages</h3>

                  {chats.length === 0 ? (
                    <div>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You don't have any conversations yet. Start by {user?.role === 'freelancer'
                          ? 'applying to projects'
                          : 'reaching out to freelancers who applied to your projects'}.
                      </p>
                      <div className="flex justify-center gap-4 mb-8">
                        {user?.role === 'freelancer' ? (
                          <button
                            onClick={() => navigate('/projects')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                          >
                            Browse Projects
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/manage-projects/applications')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                          >
                            Manage Applications
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Connect and collaborate with talented freelancers. Select a conversation from the sidebar to start chatting.
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Real-time Chat</h4>
                      <p className="text-sm text-gray-600">Instant messaging with freelancers and clients</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">File Sharing</h4>
                      <p className="text-sm text-gray-600">Share images, documents, and project files</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Project Updates</h4>
                      <p className="text-sm text-gray-600">Track progress and discuss project details</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;