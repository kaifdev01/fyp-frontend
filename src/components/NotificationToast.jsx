'use client';
import { useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle, Bell, Info, DollarSign, FileText, X } from 'lucide-react';
import { useNotifications } from '../lib/useNotifications';
import { useSocket } from '../lib/useSocket';

const showNotificationToast = (notification) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'kyc_approved':
      case 'proposal_accepted':
      case 'job_completed':
      case 'job_posted':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'kyc_rejected':
      case 'proposal_rejected':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'job_deleted':
        return <AlertCircle className="text-orange-600" size={20} />;
      case 'payment_received':
      case 'payment_released':
        return <DollarSign className="text-green-600" size={20} />;
      case 'new_proposal':
      case 'proposal_submitted':
        return <FileText className="text-blue-600" size={20} />;
      case 'info':
        return <Info className="text-blue-600" size={20} />;
      default:
        return <Bell className="text-blue-600" size={20} />;
    }
  };

  toast.custom((t) => (
    <div className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white shadow-xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}>
      <div className="flex-1 w-0 p-4 flex items-center gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {notification.title}
          </p>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>
        </div>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex items-center justify-center w-12 border-l border-gray-200 hover:bg-gray-100 transition-colors group"
        aria-label="Close notification"
      >
        <X size={18} className="text-gray-400 group-hover:text-gray-600" />
      </button>
    </div>
  ), {
    duration: 6000,
    position: 'top-right',
  });
};

export default function NotificationToast() {
  const { notifications, fetchNotifications } = useNotifications(30000);
  const socket = useSocket();
  const shownNotifications = useRef(new Set());
  const isFirstLoad = useRef(true);

  // Handle Socket.IO real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      showNotificationToast(notification);
      fetchNotifications(true);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, fetchNotifications]);

  // Handle polling-based notifications
  useEffect(() => {
    if (notifications.length === 0) return;
    
    if (isFirstLoad.current) {
      notifications.forEach(n => shownNotifications.current.add(n._id));
      isFirstLoad.current = false;
      return;
    }
    
    const newNotifications = notifications.filter(n => 
      !n.read && !shownNotifications.current.has(n._id)
    );
    
    newNotifications.forEach(notification => {
      shownNotifications.current.add(notification._id);
      showNotificationToast(notification);
    });

    // Cap Set size to prevent memory leak
    if (shownNotifications.current.size > 500) {
      const arr = [...shownNotifications.current];
      shownNotifications.current = new Set(arr.slice(-200));
    }
  }, [notifications]);

  return null;
}
