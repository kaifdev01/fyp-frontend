'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, User, LogOut } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

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