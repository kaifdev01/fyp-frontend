'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Plus, Briefcase, Users, Star, BarChart } from 'lucide-react';

export default function ClientDashboard() {
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

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Banner */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {user?.name?.split(' ')[0] || 'Client'}!</h1>
                  <p className="text-gray-500">Construct your team and manage your projects.</p>
                </div>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center gap-2">
                  <Plus size={20} /> Post a Job
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">0</h3>
                  <p className="text-sm text-gray-500">Active Jobs</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3">
                    <Users size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">0</h3>
                  <p className="text-sm text-gray-500">Hired Freelancers</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-3">
                    <BarChart size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">$0</h3>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-400 italic">No recent activity to show.</p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
                <div className="h-20 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <div className="px-6 pb-6">
                  <div className="relative -mt-10 mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-xl bg-white p-1 shadow-lg">
                      <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-500">{user?.name?.[0] || 'C'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Company Name'}</h2>
                    <p className="text-green-600 font-medium text-sm">Client Account</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Company Size</span>
                      <span className="font-bold text-gray-900">{user?.companySize || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="font-bold text-gray-900">{user?.location || 'Remote'}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Edit Profile
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