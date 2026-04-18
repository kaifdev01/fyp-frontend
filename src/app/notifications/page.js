'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FreelancerHeader from '../../components/FreelancerHeader';
import ClientHeader from '../../components/ClientHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  Bell, ArrowLeft, Trash2, CheckCircle, Clock, AlertCircle,
  MessageSquare, Briefcase, DollarSign, Star, Filter, Search,
  Eye, EyeOff, Archive, MoreVertical, X, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATION_TYPE_CONFIG = {
  kyc_submitted: { label: 'KYC Submitted', color: 'blue', icon: CheckCircle },
  kyc_approved: { label: 'KYC Approved', color: 'green', icon: CheckCircle },
  kyc_rejected: { label: 'KYC Rejected', color: 'red', icon: AlertCircle },
  proposal_accepted: { label: 'Proposal Accepted', color: 'green', icon: CheckCircle },
  proposal_rejected: { label: 'Proposal Rejected', color: 'red', icon: AlertCircle },
  new_message: { label: 'Messages', color: 'blue', icon: MessageSquare },
  payment_received: { label: 'Payments', color: 'green', icon: DollarSign },
  job_match: { label: 'Job Matches', color: 'blue', icon: Briefcase },
  job_posted: { label: 'Job Posted', color: 'green', icon: Briefcase },
  job_deleted: { label: 'Job Deleted', color: 'red', icon: Briefcase },
};

function NotificationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [userRole, setUserRole] = useState('freelancer');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const detectedRole = roleParam || user.primaryRole || 'freelancer';
    setUserRole(detectedRole);
    fetchNotifications();

    // Poll every 15 seconds for new notifications
    const interval = setInterval(() => fetchNotifications(true), 15000);

    // Refetch when tab becomes visible again
    const handleVisibility = () => { if (document.visibilityState === 'visible') fetchNotifications(true); };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [searchParams]);

  const fetchNotifications = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get('/api/notifications?limit=100');
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      if (!silent) toast.error('Failed to load notifications');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesRead = filterRead === 'all' ||
      (filterRead === 'unread' && !notif.read) ||
      (filterRead === 'read' && notif.read);
    
    // Filter by role context
    const clientNotificationTypes = ['job_posted', 'job_deleted', 'new_proposal', 'proposal_submitted', 'milestone_completed', 'payment_requested'];
    const freelancerNotificationTypes = ['job_match', 'proposal_accepted', 'proposal_rejected', 'payment_received', 'payment_released'];
    
    let matchesRole = true;
    if (userRole === 'client') {
      matchesRole = clientNotificationTypes.includes(notif.type);
    } else {
      matchesRole = freelancerNotificationTypes.includes(notif.type);
    }
    
    return matchesSearch && matchesType && matchesRead && matchesRole;
  });

  // Count notifications for the other role
  const clientNotificationTypes = ['job_posted', 'job_deleted', 'new_proposal', 'proposal_submitted', 'milestone_completed', 'payment_requested'];
  const freelancerNotificationTypes = ['job_match', 'proposal_accepted', 'proposal_rejected', 'payment_received', 'payment_released'];
  
  const otherRoleNotifications = notifications.filter(notif => {
    if (userRole === 'client') {
      return freelancerNotificationTypes.includes(notif.type);
    } else {
      return clientNotificationTypes.includes(notif.type);
    }
  });
  
  const otherRoleUnreadCount = otherRoleNotifications.filter(n => !n.read).length;

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.post(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all notifications?')) return;
    
    try {
      // Delete all notifications from backend
      const deletePromises = notifications.map(n => 
        api.delete(`/api/notifications/${n._id}`)
      );
      
      await Promise.all(deletePromises);
      setNotifications([]);
      toast.success('All notifications deleted');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      toast.error('Failed to delete all notifications');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
  };

  const Header = userRole === 'client' ? ClientHeader : FreelancerHeader;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Toaster position="top-right" />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Back
              </button>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Bell size={32} className="text-blue-600" />
                    Notifications
                  </h1>
                  <p className="text-gray-600">
                    {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchNotifications}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filterRead}
                    onChange={(e) => setFilterRead(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All Types</option>
                    {Object.entries(NOTIFICATION_TYPE_CONFIG).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>

                  {notifications.length > 0 && (
                    <button
                      onClick={handleDeleteAll}
                      className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => {
                    const config = NOTIFICATION_TYPE_CONFIG[notification.type] || NOTIFICATION_TYPE_CONFIG.new_message;
                    const Icon = config.icon;
                    const colorClasses = {
                      green: 'bg-green-100 text-green-600',
                      blue: 'bg-blue-100 text-blue-600',
                      red: 'bg-red-100 text-red-600',
                      amber: 'bg-amber-100 text-amber-600',
                      yellow: 'bg-yellow-100 text-yellow-600',
                    };

                    return (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`bg-white rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${notification.read
                          ? 'border-gray-200'
                          : 'border-blue-200 bg-blue-50'
                          }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="p-4 flex items-start gap-4">
                          {/* Icon */}
                          <div className={`p-3 rounded-lg flex-shrink-0 ${colorClasses[config.color]}`}>
                            <Icon size={20} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsRead(notification._id);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <Eye size={16} className="text-gray-400" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(notification._id);
                                  }}
                                  className="p-1 hover:bg-red-100 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">
                    {searchQuery || filterType !== 'all' || filterRead !== 'all'
                      ? 'Try adjusting your filters'
                      : 'You\'re all caught up! Check back later for updates.'}
                  </p>
                </div>
                
                {otherRoleUnreadCount > 0 && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
                    <Bell size={32} className="mx-auto mb-3 text-blue-600" />
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      You have {otherRoleUnreadCount} notification{otherRoleUnreadCount !== 1 ? 's' : ''} on {userRole === 'client' ? 'Freelancer' : 'Client'} side
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Switch to your {userRole === 'client' ? 'freelancer' : 'client'} dashboard to view them
                    </p>
                    <button
                      onClick={() => router.push(userRole === 'client' ? '/freelancer-dashboard' : '/client-dashboard')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Switch to {userRole === 'client' ? 'Freelancer' : 'Client'} Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    }>
      <NotificationsContent />
    </Suspense>
  );
}
