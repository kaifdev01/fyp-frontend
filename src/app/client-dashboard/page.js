'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../components/ClientHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Plus, Briefcase, Users, BarChart, MessageSquare, Clock, CheckCircle, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setCurrentDateTime(`${dateStr}\n${timeStr}`);

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fyp-backend-liard-eight.vercel.app';
      const [jobsRes, statsRes] = await Promise.all([
        fetch(`${backendUrl}/api/jobs/client/my-jobs?limit=3`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${backendUrl}/api/jobs/client/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const jobsData = await jobsRes.json();
      const statsData = await statsRes.json();

      if (jobsRes.ok) {
        setActiveJobs(jobsData.jobs.filter(j => j.status === 'open') || []);
      }

      if (statsRes.ok) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status) => {
    if (!stats?.byStatus) return 0;
    const statusData = stats.byStatus.find(s => s._id === status);
    return statusData?.count || 0;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-green-600" size={48} />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <ClientHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 shadow-xl mb-8 text-white flex justify-between items-center">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2 whitespace-pre-line">{currentDateTime}</p>
                <h1 className="text-4xl font-bold mb-2">Good Evening, {user?.name?.split(' ')[0]} {user?.name?.split(' ')[1]?.[0]}.</h1>
                <p className="text-green-100 text-lg">Manage your projects and find the best freelancers</p>
              </div>
              <Link href="/post-job">
                <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <Plus size={20} /> Post a Job
                </button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{getStatusCount('open')}</h3>
                <p className="text-gray-600 text-sm mt-1">Active Jobs</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.totalProposals || 0}</h3>
                <p className="text-gray-600 text-sm mt-1">Total Proposals</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{getStatusCount('completed')}</h3>
                <p className="text-gray-600 text-sm mt-1">Completed Jobs</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.total || 0}</h3>
                <p className="text-gray-600 text-sm mt-1">Total Jobs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">

                {/* Active Jobs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Briefcase className="text-green-600" size={24} />
                      Active Jobs
                    </h2>
                    <Link href="/client-dashboard/my-jobs">
                      <button className="text-green-600 hover:text-green-700 font-semibold text-sm">View All →</button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {activeJobs.length > 0 ? activeJobs.map((job) => (
                      <div key={job._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Proposals</p>
                            <p className="text-lg font-bold text-gray-900">{job.proposalCount || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Hired</p>
                            <p className="text-lg font-bold text-gray-900">{job.hiredCount || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Budget</p>
                            <p className="text-lg font-bold text-green-600">${job.budget.amount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/client-dashboard/proposals?jobId=${job._id}`}>
                            <button className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-100 transition-colors text-sm">
                              View Proposals
                            </button>
                          </Link>
                          <Link href={`/edit-job/${job._id}`}>
                            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                              Edit Job
                            </button>
                          </Link>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No active jobs yet</p>
                        <Link href="/post-job">
                          <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                            Post Your First Job
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <div className="px-6 pb-6">
                    <div className="relative -mt-12 mb-4 flex justify-center">
                      <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl font-bold text-gray-500">{user?.name?.[0] || 'C'}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Company Name'}</h2>
                      <p className="text-green-600 font-medium text-sm">💼 Client Account</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Company Size</span>
                        <span className="font-bold text-gray-900">{user?.companySize || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Location</span>
                        <span className="font-bold text-gray-900">{user?.location || 'Remote'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Member Since</span>
                        <span className="font-bold text-gray-900">Jan 2024</span>
                      </div>
                    </div>

                    <Link href="/edit-profile">
                      <button className="w-full mt-6 border border-green-200 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                        Edit Profile
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="">
                    <Link href="/post-job">
                      <button className="w-full px-4 mb-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <Plus size={18} /> Post New Job
                      </button>
                    </Link>
                    <Link href="/client-dashboard/find-freelancers">
                      <button className="w-full mb-4 px-4 py-3 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                        <Users size={18} /> Find Freelancers
                      </button>
                    </Link>
                    <Link href="/messages">
                      <button className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <MessageSquare size={18} /> Messages
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✓ Be specific in job descriptions</li>
                    <li>✓ Set realistic budgets</li>
                    <li>✓ Respond to proposals quickly</li>
                    <li>✓ Use clear communication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}