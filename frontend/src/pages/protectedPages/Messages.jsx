import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Send, MoreVertical, Paperclip, Smile, Search, ArrowLeft, Circle, CheckCheck, Clock, Image, FileText, Info, Plus, Filter, Briefcase, MessageCircle, Users } from 'lucide-react';

const Messages = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, active
  const [isTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Mock data for chats - will be replaced with Redux/API calls
  const [chats] = useState([
    // Empty array to show no messages state
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
                    <p className="text-gray-500 mb-6">
                      {user?.role === 'freelancer'
                        ? 'Start connecting with clients by applying to projects.'
                        : 'Start connecting with freelancers by posting projects.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => {
                          setSelectedChat(chat);
                          setShowMobileChat(true);
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
                              <span className="text-sm text-gray-500">{chat.time}</span>
                            </div>

                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm text-blue-600 font-medium">{chat.role}</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full ${i < Math.floor(chat.rating) ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                                ))}
                                <span className="text-sm text-gray-500 ml-1">{chat.rating}</span>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                              <h4 className="font-medium text-gray-900 text-sm mb-1">{chat.projectTitle}</h4>
                              <span className="text-green-600 font-semibold text-sm">{chat.projectBudget}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="text-gray-600 text-sm truncate flex-1 mr-2">{chat.lastMessage}</p>
                              {chat.unread > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  {chat.unread}
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
                          <span className="text-blue-600 font-medium">{selectedChat.role}</span>
                          <span>•</span>
                          <span>{selectedChat.online ? 'Online now' : `Last seen ${selectedChat.lastSeen}`}</span>
                        </div>
                        <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                          <span className="text-sm font-medium text-gray-900">{selectedChat.projectTitle}</span>
                          <span className="text-green-600 font-semibold text-sm ml-2">{selectedChat.projectBudget}</span>
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
                <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
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
                          </div>
                        </div>
                      ))}

                      {isTyping && (
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

                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-14"
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
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Connect and collaborate with talented freelancers. Select a conversation from the sidebar to start chatting.
                  </p>

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