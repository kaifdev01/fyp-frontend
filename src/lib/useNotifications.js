import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const CLIENT_NOTIFICATION_TYPES = ['job_posted', 'job_deleted', 'new_proposal', 'proposal_submitted', 'milestone_completed', 'payment_requested'];
const FREELANCER_NOTIFICATION_TYPES = ['job_match', 'proposal_accepted', 'proposal_rejected', 'payment_received', 'payment_released'];

const getCurrentRoleFromURL = () => {
  if (typeof window === 'undefined') return 'freelancer';
  const path = window.location.pathname;
  
  if (path.includes('/client-dashboard') || 
      path.includes('/post-job') || 
      path.includes('/my-jobs') ||
      path.includes('/edit-job') ||
      path.includes('/client-profile')) {
    return 'client';
  }
  
  return 'freelancer';
};

const filterNotificationsByRole = (notifications, currentRole) => {
  return notifications.filter(notification => {
    if (currentRole === 'client') {
      return CLIENT_NOTIFICATION_TYPES.includes(notification.type);
    } else {
      return FREELANCER_NOTIFICATION_TYPES.includes(notification.type);
    }
  });
};

export const useNotifications = (pollInterval = 30000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchNotifications = useCallback(async (force = false) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    const now = Date.now();
    if (!force && now - lastFetchTime < 500) return;

    try {
      setLoading(true);
      const response = await api.get('/api/notifications?limit=50');
      if (response.data.success) {
        const allNotifications = response.data.notifications;
        const currentRole = getCurrentRoleFromURL();
        const filteredNotifications = filterNotificationsByRole(allNotifications, currentRole);
        
        setNotifications(filteredNotifications);
        setUnreadCount(filteredNotifications.filter(n => !n.read).length);
        setLastFetchTime(now);
      }
    } catch (error) {
      if (error.response?.status !== 429 && error.response?.status !== 401) {
        console.error('Failed to fetch notifications:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    fetchNotifications(true);
    const interval = setInterval(() => fetchNotifications(false), pollInterval);

    return () => clearInterval(interval);
  }, [fetchNotifications, pollInterval]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
