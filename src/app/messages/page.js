'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FreelancerHeader from '../../components/FreelancerHeader';
import ClientHeader from '../../components/ClientHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  Send, Search, MoreVertical, Phone, Video, Info, Paperclip,
  Smile, CheckCheck, Check, AlertCircle, Menu, X, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_CONVERSATIONS = [
  {
    _id: '1',
    participantId: 'client1',
    participantName: 'TechCorp Inc.',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp',
    participantRole: 'client',
    lastMessage: 'Great! Looking forward to working with you on this project.',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    isPinned: false,
    isArchived: false,
    jobTitle: 'Full Stack Developer Needed for E-commerce Platform',
    jobId: '1',
  },
  {
    _id: '2',
    participantId: 'client2',
    participantName: 'FoodRush',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FoodRush',
    participantRole: 'client',
    lastMessage: 'Can you start working on the project next week?',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    jobTitle: 'React Native Mobile App for Food Delivery',
    jobId: '2',
  },
  {
    _id: '3',
    participantId: 'client3',
    participantName: 'DataViz Co.',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataViz',
    participantRole: 'client',
    lastMessage: 'Unfortunately, we decided to go with another designer.',
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    jobTitle: 'UI/UX Designer for SaaS Dashboard',
    jobId: '3',
  },
  {
    _id: '4',
    participantId: 'client4',
    participantName: 'Creative Agency',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creative',
    participantRole: 'client',
    lastMessage: 'Perfect! The website looks amazing.',
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    jobTitle: 'WordPress Website Development',
    jobId: '4',
  },
];

const MOCK_MESSAGES = {
  '1': [
    {
      _id: '1',
      senderId: 'freelancer1',
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freelancer',
      text: "Hi! I'm interested in your project. I have 5 years of experience with React and Node.js.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
    },
    {
      _id: '2',
      senderId: 'client1',
      senderName: 'TechCorp Inc.',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp',
      text: 'Great! Can you tell me more about your experience with MongoDB?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      isRead: true,
    },
    {
      _id: '3',
      senderId: 'freelancer1',
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freelancer',
      text: "I have worked with MongoDB on 8+ projects. I'm comfortable with schema design, indexing, and optimization.",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      isRead: true,
    },
    {
      _id: '4',
      senderId: 'client1',
      senderName: 'TechCorp Inc.',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp',
      text: 'Excellent! When can you start?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: true,
    },
    {
      _id: '5',
      senderId: 'freelancer1',
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freelancer',
      text: "I can start immediately. I'm available full-time for this project.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: true,
    },
    {
      _id: '6',
      senderId: 'client1',
      senderName: 'TechCorp Inc.',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp',
      text: 'Great! Looking forward to working with you on this project.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
    },
  ],
  '2': [
    {
      _id: '1',
      senderId: 'freelancer1',
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freelancer',
      text: "Hi! I'm excited to work on your food delivery app.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      _id: '2',
      senderId: 'client2',
      senderName: 'FoodRush',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FoodRush',
      text: 'Can you start working on the project next week?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
  ],
};

function formatTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [userRole, setUserRole] = useState('freelancer');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const clientId = searchParams.get('clientId');
    if (clientId && !selectedConversation) {
      const conversation = conversations.find(c => c.participantName === clientId);
      if (conversation) {
        handleSelectConversation(conversation);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      handleSelectConversation(conversations[0]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const detectedRole = roleParam || user.primaryRole || 'freelancer';
    setUserRole(detectedRole);
  }, [searchParams]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(MOCK_MESSAGES[conversation._id] || []);
    setShowSidebar(false);
    setConversations(conversations.map(c =>
      c._id === conversation._id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      _id: Date.now().toString(),
      senderId: 'freelancer1',
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freelancer',
      text: messageInput,
      timestamp: new Date(),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    setConversations(conversations.map(c =>
      c._id === selectedConversation._id
        ? { ...c, lastMessage: messageInput, lastMessageTime: new Date() }
        : c
    ));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Header = userRole === 'client' ? ClientHeader : FreelancerHeader;

  return (
    <ProtectedRoute>
      <div className=" h-screen bg-white flex flex-col overflow-hidden">
        <Header />
        <Toaster position="top-right" />

        {/* Main Container - No Scroll */}
        <div className="flex-1 flex overflow-hidden mt-16">

          {/* LEFT SIDEBAR */}
          <div className={`fixed md:relative inset-y-0 left-0 w-full sm:w-96 bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 h-full overflow-hidden ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>

            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Plus size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>
            </div>

            {/* Conversations - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conv => (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedConversation?._id === conv._id ? 'bg-gray-100' : ''
                      }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={conv.participantAvatar} alt={conv.participantName} className="w-14 h-14 rounded-full" />
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
                          {conv.participantName}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-600 text-sm">No conversations found</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CHAT AREA */}
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white flex-shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                    >
                      <Menu size={20} />
                    </button>
                    <img src={selectedConversation.participantAvatar} alt={selectedConversation.participantName} className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-gray-900 truncate">{selectedConversation.participantName}</h2>
                      <p className="text-xs text-gray-500 truncate">{selectedConversation.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hidden sm:block">
                      <Phone size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hidden sm:block">
                      <Video size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
                  {messages.map((message) => {
                    const isOwn = message.senderId === 'freelancer1';
                    return (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        <img src={message.senderAvatar} alt={message.senderName} className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-xs sm:max-w-sm md:max-w-md`}>
                          <div className={`px-4 py-2.5 rounded-2xl break-words ${isOwn
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                            }`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isOwn && (message.isRead ? <CheckCheck size={12} /> : <Check size={12} />)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed */}
                <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
                  <div className="flex items-end gap-3">
                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 flex-shrink-0 hidden sm:block">
                      <Paperclip size={20} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 flex-shrink-0 hidden sm:block">
                      <Smile size={20} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-full transition-colors text-white flex-shrink-0"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Overlay */}
          {showSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
