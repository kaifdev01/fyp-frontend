"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useNotifications } from "../lib/useNotifications";
import { useSocket } from "../lib/useSocket";
import {
  Bell, MessageSquare, User, Settings, LogOut,
  Briefcase, DollarSign, Star, ChevronDown, Search, FileText, CheckCircle, Flag, Sparkles, Bookmark
} from "lucide-react";

const NAV_LINKS = [
  { href: '/freelancer-dashboard', label: 'Dashboard' },
];

const JOBS_MENU = [
  { href: '/recommended-jobs', label: 'AI Recommendations', icon: Sparkles },
  { href: '/browse-jobs', label: 'Browse Jobs', icon: Search },
  { href: '/freelancer-dashboard/proposals', label: 'My Proposals', icon: FileText },
  { href: '/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
];

const ACCOUNT_MENU = [
  { href: '/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/disputes', label: 'Disputes', icon: Flag },
];

export default function FreelancerHeader() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showJobsMenu, setShowJobsMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { unreadCount, fetchNotifications } = useNotifications(30000);
  const socket = useSocket();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Listen for real-time notifications to update badge
  useEffect(() => {
    if (!socket) return;

    const handleNotification = () => {
      fetchNotifications(true);
    };

    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, [socket, fetchNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/freelancer-dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WorkDeck</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* Jobs Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1">
                Jobs
                <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {JOBS_MENU.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

            </div>
            {/* Account Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1">
                Account
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {ACCOUNT_MENU.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-4 text-sm mr-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Briefcase size={15} />
                <span>0 Active</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <DollarSign size={15} />
                <span>${user?.totalEarnings || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Star size={15} />
                <span>{user?.rating || '0.0'}</span>
              </div>
            </div>

            {/* Notification Bell - Desktop */}
            <Link href="/notifications" className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Messages - Mobile */}
            <Link href="/messages" className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors sm:hidden">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>

            {/* Notifications - Mobile */}
            <Link href="/notifications" className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors sm:hidden">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">{user?.name?.[0]}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name?.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">Freelancer</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/edit-profile" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <User size={16} />
                    <span>View Profile</span>
                  </Link>
                  {user?.roles?.length > 1 && (
                    <Link href={user.roles.includes('client') ? '/client-dashboard' : '/freelancer-dashboard'} className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <Star size={16} />
                      <span>Switch to {user.roles.includes('client') ? 'Client' : 'Freelancer'}</span>
                    </Link>
                  )}
                  <Link href="/freelancer-dashboard/settings" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
