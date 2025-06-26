import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Paperclip, Smile, Search, ArrowLeft, Circle, CheckCheck, Clock, Image, FileText } from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Mock data for chats
  const [chats] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'UI/UX Designer',
      avatar: 'SJ',
      lastMessage: 'I\'ve completed the wireframes for your project',
      time: '2m ago',
      unread: 2,
      online: true,
      projectTitle: 'E-commerce Mobile App Design',
      messages: [
        { id: 1, sender: 'other', message: 'Hi! Thanks for considering my proposal for your e-commerce project.', time: '10:30 AM', status: 'read' },
        { id: 2, sender: 'me', message: 'Hello Sarah! Your portfolio looks impressive. Can you tell me more about your approach?', time: '10:45 AM', status: 'read' },
        { id: 3, sender: 'other', message: 'I focus on user-centered design principles. I\'ll start with user research and create detailed wireframes.', time: '11:00 AM', status: 'read' },
        { id: 4, sender: 'me', message: 'That sounds perfect. What\'s your estimated timeline?', time: '11:15 AM', status: 'read' },
        { id: 5, sender: 'other', message: 'I\'ve completed the wireframes for your project', time: '2m ago', status: 'delivered' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Full Stack Developer',
      avatar: 'MC',
      lastMessage: 'The backend API is ready for testing',
      time: '1h ago',
      unread: 0,
      online: false,
      projectTitle: 'Web Application Development',
      messages: [
        { id: 1, sender: 'other', message: 'I can help you build a scalable web application with React and Node.js', time: '9:00 AM', status: 'read' },
        { id: 2, sender: 'me', message: 'Great! Can you provide a detailed breakdown of the tech stack?', time: '9:30 AM', status: 'read' },
        { id: 3, sender: 'other', message: 'The backend API is ready for testing', time: '1h ago', status: 'delivered' }
      ]
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Content Writer',
      avatar: 'ER',
      lastMessage: 'I have some questions about the brand voice',
      time: '3h ago',
      unread: 1,
      online: true,
      projectTitle: 'Blog Content Creation',
      messages: [
        { id: 1, sender: 'other', message: 'I\'m excited to work on your content strategy!', time: '8:00 AM', status: 'read' },
        { id: 2, sender: 'other', message: 'I have some questions about the brand voice', time: '3h ago', status: 'sent' }
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

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        sender: 'me',
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      
      // TODO: Replace with actual database integration
      // Example API call:
      // await sendMessageToDatabase(selectedChat.id, newMessage);
      
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const handleFileUpload = (type) => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else if (type === 'pdf') {
      fileInputRef.current?.click();
    }
    setShowFileOptions(false);
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Replace with actual file upload to your server
      // Example:
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('chatId', selectedChat.id);
      // await uploadFileToDatabase(formData);
      
      console.log(`Selected ${type}:`, file.name);
      // Reset file input
      event.target.value = '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-4 h-4 text-slate-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 pt-15">
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 bg-white border-r border-slate-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-xl font-bold text-white mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-slate-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{chat.role}</p>
                  <p className="text-sm text-blue-600 font-medium mb-1 truncate">{chat.projectTitle}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
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
            <div className="p-4 border-b border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && (
                      <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 fill-current" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{selectedChat.name}</h2>
                    <p className="text-sm text-slate-600">{selectedChat.role}</p>
                    <p className="text-xs text-blue-600 font-medium">{selectedChat.projectTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-slate-600" />
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
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
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
                ))}
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
                accept=".pdf"
                onChange={(e) => handleFileSelect(e, 'pdf')}
                className="hidden"
              />
              
              <div className="flex items-end space-x-3 relative">
                {/* File Upload Options */}
                {showFileOptions && (
                  <div className="absolute bottom-16 left-0 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-10">
                    <button
                      onClick={() => handleFileUpload('image')}
                      className="flex items-center space-x-2 w-full p-2 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Image className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-700">Image</span>
                    </button>
                    <button
                      onClick={() => handleFileUpload('pdf')}
                      className="flex items-center space-x-2 w-full p-2 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-slate-700">PDF</span>
                    </button>
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-16 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-10">
                    <div className="grid grid-cols-5 gap-2">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiClick(emoji)}
                          className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-lg"
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
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-slate-600" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                  <button 
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowFileOptions(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Smile className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Welcome to FreelanceHub Messages</h3>
              <p className="text-slate-600 mb-4">Select a conversation to start chatting with freelancers</p>
              <div className="text-sm text-slate-500">
                <p>• Real-time messaging with your freelancers</p>
                <p>• Share images and PDF files seamlessly</p>
                <p>• Track project progress in one place</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;