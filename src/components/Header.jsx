'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import api from '../lib/api';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get current role based on URL
  const getCurrentRole = () => {
    if (pathname?.includes('/client-dashboard')) return 'client';
    if (pathname?.includes('/freelancer-dashboard')) return 'freelancer';
    return user?.primaryRole || 'client';
  };

  const currentRole = getCurrentRole();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData && userData !== 'undefined') {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
      if (showRoleMenu && !event.target.closest('.role-menu')) {
        setShowRoleMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu, showRoleMenu]);

  const switchRole = async (newRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/login');
        return;
      }

      const response = await api.post('/api/auth/switch-role', {
        role: newRole
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setShowRoleMenu(false);
        
        if (newRole === 'client') {
          router.push('/client-dashboard');
        } else {
          router.push('/freelancer-dashboard');
        }
      }
    } catch (error) {
      console.error('Failed to switch role:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileMenu(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WorkDeck</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse-jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Browse Jobs</Link>
            <Link href="/find-freelancers" className="text-gray-700 hover:text-blue-600 transition-colors">Find Freelancers</Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How it Works</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Search size={20} />
            </button>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Role Switcher - only show if user has multiple completed roles */}
                {user?.roles?.length > 1 && user?.roles?.every(role => role !== 'pending') && (
                  <div className="relative role-menu">
                    <button
                      onClick={() => setShowRoleMenu(!showRoleMenu)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      <span className="capitalize">{currentRole}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showRoleMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {user.roles.filter(role => role !== 'pending').map((role) => (
                          <button
                            key={role}
                            onClick={() => switchRole(role)}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors capitalize ${
                              currentRole === role ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Add Role Option - show if user has only one role */}
                {false && user?.roles?.length === 1 && (
                  <Link 
                    href="/role-selection"
                    className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Add {user.primaryRole === 'freelancer' ? 'Client' : 'Freelancer'} Role
                  </Link>
                )}
                
                <div className="relative profile-menu">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-gray-700">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Login</Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link href="/browse-jobs" className="text-gray-700">Browse Jobs</Link>
              <Link href="/find-freelancers" className="text-gray-700">Find Freelancers</Link>
              <Link href="/how-it-works" className="text-gray-700">How it Works</Link>
              {isLoggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700">Login</Link>
                  <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}