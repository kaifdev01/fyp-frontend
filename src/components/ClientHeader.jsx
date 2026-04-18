"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useNotifications } from "../lib/useNotifications";
import { useSocket } from "../lib/useSocket";
import {
  Bell, MessageSquare, User, Settings, LogOut,
  Plus, DollarSign, ChevronDown, Briefcase, Users, Eye, CreditCard, FileText, BarChart3, HelpCircle, Flag
} from "lucide-react";

const NAV_LINKS = [
  { href: '/client-dashboard', label: 'Dashboard' },
];

const JOBS_MENU = [
  { href: '/post-job', label: 'Post a Job', icon: Plus },
  { href: '/client-dashboard/my-jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/client-dashboard/proposals', label: 'Proposals', icon: MessageSquare },
  { href: '/client-dashboard/payments', label: 'Payments', icon: CreditCard },
];

const TEAM_MENU = [
  { href: '/client-dashboard/find-freelancers', label: 'Find Freelancers', icon: Users },
  { href: '/client-dashboard/hired-freelancers', label: 'Hired Freelancers', icon: Eye },
  { href: '/client-dashboard/contracts', label: 'Contracts', icon: FileText },
  { href: '/disputes', label: 'Disputes', icon: Flag },
];

export default function ClientHeader() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { unreadCount, fetchNotifications } = useNotifications(30000);
  const socket = useSocket();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try { setUser(JSON.parse(userData)); } catch { localStorage.removeItem("user"); }
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
          <Link href="/client-dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WorkDeck</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                  {label}
                </Link>
              );
            })}

            {/* Reports Link */}

            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1">
                Jobs
                <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {JOBS_MENU.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>


            {/* Team Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1">
                Team
                <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {TEAM_MENU.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/client-dashboard/reports"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1">
              <BarChart3 size={16} />
              Reports
            </Link>
          </nav>

          {/* Right */}
          <div className="flex items-center space-x-3">
            <Link href="/post-job"
              className="hidden md:flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-sm">
              <Plus size={16} /> Post a Job
            </Link>

            <Link href="/messages?role=client"
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>



            <Link href="/notifications?role=client"
              className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <Link href="/client-dashboard/support"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle size={20} />
            </Link>

            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    : <span className="text-sm font-medium text-gray-600">{user?.name?.[0]}</span>}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name?.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">Client</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/client-profile" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <User size={16} /><span>View Profile</span>
                  </Link>
                  {user?.roles?.length > 1 && (
                    <Link href="/freelancer-dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <Briefcase size={16} /><span>Switch to Freelancer</span>
                    </Link>
                  )}
                  <Link href="/client-dashboard/settings" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <Settings size={16} /><span>Settings</span>
                  </Link>
                  <hr className="my-2" />
                  <button onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut size={16} /><span>Sign Out</span>
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
