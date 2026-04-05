'use client';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle, Bell } from 'lucide-react';
import { useNotifications } from '../lib/useNotifications';

export default function NotificationToast() {
  const { notifications } = useNotifications(3000);

  useEffect(() => {
    const lastShownId = localStorage.getItem('lastShownNotificationId');
    
    notifications.forEach(notification => {
      if (notification._id !== lastShownId && !notification.read) {
        localStorage.setItem('lastShownNotificationId', notification._id);
        
        const icon = notification.type === 'kyc_approved' ? (
          <CheckCircle className="text-green-600" size={20} />
        ) : notification.type === 'kyc_rejected' ? (
          <AlertCircle className="text-red-600" size={20} />
        ) : (
          <Bell className="text-blue-600" size={20} />
        );

        toast.custom((t) => (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4 flex items-center gap-3">
              {icon}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      }
    });
  }, [notifications]);

  return null;
}
