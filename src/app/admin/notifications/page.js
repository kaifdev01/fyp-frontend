"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Bell, Check, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";

export default function AdminNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/notifications/admin/notifications");
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.post(`/api/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleViewKyc = (userId) => {
    router.push(`/admin/kyc?userId=${userId}`);
  };

  const getFilteredNotifications = () => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.read);
    }
    if (filter === "kyc") {
      return notifications.filter((n) => n.type === "kyc_submitted");
    }
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <AdminHeader />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Bell size={32} className="text-blue-600" />
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-gray-600">
              Manage your admin notifications and alerts
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 items-center justify-between">
            <div className="flex gap-4">
              {[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread" },
                { value: "kyc", label: "KYC Submissions" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    filter === tab.value
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchNotifications()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "kyc"
                  ? "No KYC notifications"
                  : "No notifications"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 ${
                    notification.read
                      ? "bg-white border-gray-200"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {new Date(notification.createdAt).toLocaleDateString()}{" "}
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* User Info for KYC notifications */}
                  {notification.type === "kyc_submitted" &&
                    notification.userId && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">User:</span>{" "}
                          {notification.userId.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Email:</span>{" "}
                          {notification.userId.email}
                        </p>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="flex gap-3 items-center">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
                      >
                        <Check size={16} /> Mark as Read
                      </button>
                    )}

                    {notification.type === "kyc_submitted" && (
                      <button
                        onClick={() =>
                          handleViewKyc(notification.data?.userId)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-sm"
                      >
                        View KYC
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold text-sm ml-auto"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
