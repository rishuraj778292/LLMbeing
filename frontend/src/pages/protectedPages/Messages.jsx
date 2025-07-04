import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Paperclip, Smile, Search, ArrowLeft, Circle, CheckCheck, Clock, Image, FileText, Info, Plus, Filter, Briefcase } from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, active
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Mock data for chats - will be replaced with Redux/API calls
  const [chats] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'I\'ve completed the wireframes for your project. Would you like to review them?',
      time: '2m ago',
      unread: 2,
      online: true,
      lastSeen: 'now',
      projectTitle: 'E-commerce Mobile App Design',
      projectBudget: '$2,500',
      rating: 4.9,
      messages: [
        {
          id: 1,
          sender: 'other',
          message: 'Hi! Thanks for considering my proposal for your e-commerce project. I\'m excited to work with you!',
          time: '10:30 AM',
          status: 'read',
          timestamp: new Date().getTime() - 3600000
        },
        {
          id: 2,
          sender: 'me',
          message: 'Hello Sarah! Your portfolio looks impressive. Can you tell me more about your design approach?',
          time: '10:45 AM',
          status: 'read',
          timestamp: new Date().getTime() - 3000000
        },
        {
          id: 3,
          sender: 'other',
          message: 'I focus on user-centered design principles. I\'ll start with comprehensive user research, create detailed wireframes, and iterate based on feedback.',
          time: '11:00 AM',
          status: 'read',
          timestamp: new Date().getTime() - 2400000
        },
        {
          id: 4,
          sender: 'me',
          message: 'That sounds perfect for what we need. What\'s your estimated timeline for the complete project?',
          time: '11:15 AM',
          status: 'read',
          timestamp: new Date().getTime() - 1800000
        },
        {
          id: 5,
          sender: 'other',
          message: 'I\'ve completed the wireframes for your project. Would you like to review them?',
          time: '2m ago',
          status: 'delivered',
          timestamp: new Date().getTime() - 120000
        }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'The backend API is ready for testing. I\'ve set up the staging environment.',
      time: '1h ago',
      unread: 0,
      online: false,
      lastSeen: '2h ago',
      projectTitle: 'Web Application Development',
      projectBudget: '$5,000',
      rating: 4.8,
      messages: [
        {
          id: 1,
          sender: 'other',
          message: 'I can help you build a scalable web application with React and Node.js. My experience includes working with similar projects.',
          time: '9:00 AM',
          status: 'read',
          timestamp: new Date().getTime() - 7200000
        },
        {
          id: 2,
          sender: 'me',
          message: 'Great! Can you provide a detailed breakdown of the tech stack and architecture you\'re planning?',
          time: '9:30 AM',
          status: 'read',
          timestamp: new Date().getTime() - 5400000
        },
        {
          id: 3,
          sender: 'other',
          message: 'The backend API is ready for testing. I\'ve set up the staging environment.',
          time: '1h ago',
          status: 'delivered',
          timestamp: new Date().getTime() - 3600000
        }
      ]
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Content Writer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'I have some questions about the brand voice and target audience for the blog content.',
      time: '3h ago',
      unread: 1,
      online: true,
      lastSeen: 'now',
      projectTitle: 'Blog Content Creation',
      projectBudget: '$800',
      rating: 4.7,
      messages: [
        {
          id: 1,
          sender: 'other',
          message: 'I\'m excited to work on your content strategy! I\'ve reviewed your website and have some initial ideas.',
          time: '8:00 AM',
          status: 'read',
          timestamp: new Date().getTime() - 10800000
        },
        {
          id: 2,
          sender: 'other',
          message: 'I have some questions about the brand voice and target audience for the blog content.',
          time: '3h ago',
          status: 'sent',
          timestamp: new Date().getTime() - 10800000
        }
      ]
    }
  ]);

  // Common emojis for quick access
  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😍', '🤔', '😅', '🙏', '💪', '👏', '🔥', '✨', '🎉', '💯'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        sender: 'me',
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        timestamp: new Date().getTime()
      };

      try {
        // TODO: Replace with actual API call
        // const response = await sendMessage(selectedChat.id, newMessage);
        console.log('Sending message:', newMessage);

        // Update local state (will be replaced with Redux)
        selectedChat.messages.push(newMessage);
        setMessage('');
        setShowEmojiPicker(false);
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
        // TODO: Replace with actual file upload API
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('chatId', selectedChat.id);
        // const response = await uploadFile(formData);

        console.log(`Selected ${type}:`, file.name);

        // Create file message
        const fileMessage = {
          id: selectedChat.messages.length + 1,
          sender: 'me',
          message: `📎 ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          timestamp: new Date().getTime(),
          fileType: type,
          fileName: file.name
        };

        selectedChat.messages.push(fileMessage);
        event.target.value = '';
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
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

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return messageTime.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-72 bg-white border-r border-slate-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-3 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-semibold text-slate-900">Messages</h1>
            <button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-1">
              {['all', 'unread', 'active'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors capitalize ${activeFilter === filter
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
                setShowMobileChat(true);
              }}
              className={`p-2.5 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${selectedChat?.id === chat.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-medium text-slate-900 truncate text-xs">{chat.name}</h3>
                    <span className="text-xs text-slate-500">{chat.time}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span className="text-xs text-blue-600 font-medium">{chat.role}</span>
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${i < Math.floor(chat.rating) ? 'bg-yellow-400' : 'bg-slate-300'}`}></div>
                      ))}
                      <span className="text-xs text-slate-500 ml-0.5">{chat.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium mb-0.5 truncate">{chat.projectTitle}</p>
                  <p className="text-xs text-green-600 font-semibold mb-1.5">{chat.projectBudget}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600 truncate flex-1 mr-1.5">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-medium min-w-[16px] text-center leading-none">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-1 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative">
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {selectedChat.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900 text-xs">{selectedChat.name}</h2>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-blue-600 font-medium">{selectedChat.role}</span>
                      <span className="w-0.5 h-0.5 bg-slate-400 rounded-full"></span>
                      <span className="text-xs text-slate-500">{selectedChat.online ? 'Online' : `Last seen ${selectedChat.lastSeen}`}</span>
                    </div>
                    <p className="text-xs text-slate-600">{selectedChat.projectTitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-0.5">
                  <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                    <Info className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                    <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              <div className="space-y-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-3 py-2 rounded-lg shadow-sm border transition-all ${msg.sender === 'me'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-slate-900 border-slate-200'
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <div className={`flex items-center justify-between mt-1 space-x-2`}>
                          <span className={`text-xs ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-500'}`}>
                            {msg.time}
                          </span>
                          {msg.sender === 'me' && (
                            <div className="flex-shrink-0">
                              {getStatusIcon(msg.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-slate-200">
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

              <div className="flex items-end space-x-3 relative">
                {/* File Upload Options */}
                {showFileOptions && (
                  <div className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-20">
                    <div className="space-y-1">
                      <button
                        onClick={() => handleFileUpload('image')}
                        className="flex items-center space-x-2 w-full p-2 hover:bg-slate-50 rounded-md transition-colors text-sm"
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <Image className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-medium text-slate-700">Image</span>
                          <p className="text-xs text-slate-500">Upload photos</p>
                        </div>
                      </button>
                      <button
                        onClick={() => handleFileUpload('pdf')}
                        className="flex items-center space-x-2 w-full p-2 hover:bg-slate-50 rounded-md transition-colors text-sm"
                      >
                        <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                          <FileText className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-medium text-slate-700">Document</span>
                          <p className="text-xs text-slate-500">PDF, DOC files</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-12 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-20">
                    <div className="grid grid-cols-6 gap-1">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiClick(emoji)}
                          className="p-2 hover:bg-slate-50 rounded transition-colors text-sm hover:scale-110 transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowFileOptions(!showFileOptions);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4 text-slate-600" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowFileOptions(false);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Smile className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center max-w-md mx-auto p-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Welcome to LLMbeing Messages</h3>
              <p className="text-xs text-slate-600 mb-3">Connect and collaborate with talented freelancers. Select a conversation to start chatting.</p>

              <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Real-time messaging with freelancers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span>Share images and documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-2.5 h-2.5 text-purple-600" />
                    </div>
                    <span>Track project progress</span>
                  </div>
                </div>
              </div>

              <button className="mt-3 px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors">
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;