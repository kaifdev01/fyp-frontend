'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Search, MapPin, DollarSign, Clock, Star } from 'lucide-react';

export default function FreelancerDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats / Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Freelancer'}! 👋</h1>
                <p className="text-blue-100">You have 0 active proposals. Start searching for jobs today.</p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
                <Search className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for projects (e.g. React, Design...)"
                  className="flex-1 outline-none text-gray-700"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>

              {/* Sample Job (Placeholder) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">E-commerce Website Redesign</h3>
                    <p className="text-sm text-gray-500 mt-1">Posted 2 hours ago</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    New
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Looking for an experienced UI/UX designer to redesign our Shopify store. Must have experience with Figma and improving conversion rates...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Shopify</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">UI/UX</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Figma</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1"><DollarSign size={16} /> $2,000 - $3,000</div>
                  <div className="flex items-center gap-1"><Clock size={16} /> 2-3 weeks</div>
                  <div className="flex items-center gap-1"><MapPin size={16} /> Remote</div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
                <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="px-6 pb-6">
                  <div className="relative -mt-10 mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-500">{user?.name?.[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-blue-600 font-medium text-sm">Freelancer</p>
                    <div className="flex justify-center items-center gap-1 text-yellow-500 mt-2">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold text-gray-700">0.0</span>
                      <span className="text-gray-400 text-xs">(0 reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Hourly Rate</span>
                      <span className="font-bold text-gray-900">${user?.hourlyRate || 0}/hr</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="font-bold text-gray-900">{user?.location || 'Remote'}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 border border-blue-600 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                    View Public Profile
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}