'use client';
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { BarChart3, Users, Briefcase, DollarSign, AlertCircle, CheckCircle, Clock, TrendingUp, Eye, Settings } from 'lucide-react';
import Link from 'next/link';

const MOCK_ADMIN_STATS = {
  totalUsers: 1250,
  totalClients: 450,
  totalFreelancers: 800,
  activeJobs: 342,
  totalEarnings: 125000,
  platformCommission: 18750,
  pendingPayments: 8500,
  pendingApprovals: 12
};

const MOCK_PENDING_ITEMS = [
  {
    id: 1,
    type: 'job',
    title: 'React Dashboard Development',
    client: 'TechCorp Inc.',
    budget: 2500,
    status: 'pending_approval',
    submittedDate: '2024-01-25'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Release - Backend API Development',
    freelancer: 'Mike Backend',
    amount: 4800,
    status: 'pending_approval',
    submittedDate: '2024-01-24'
  },
  {
    id: 3,
    type: 'user',
    title: 'New Freelancer Registration',
    name: 'John Smith',
    email: 'john@example.com',
    status: 'pending_verification',
    submittedDate: '2024-01-23'
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment Release - UI/UX Design',
    freelancer: 'Sarah Designer',
    amount: 1400,
    status: 'pending_approval',
    submittedDate: '2024-01-22'
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(MOCK_ADMIN_STATS);
  const [pendingItems, setPendingItems] = useState(MOCK_PENDING_ITEMS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <AdminHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Manage platform, users, jobs, and payments</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers}</h3>
              <p className="text-gray-600 text-sm mt-1">Total Users</p>
              <p className="text-xs text-gray-500 mt-2">{stats.totalClients} clients, {stats.totalFreelancers} freelancers</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <Briefcase size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.activeJobs}</h3>
              <p className="text-gray-600 text-sm mt-1">Active Jobs</p>
              <p className="text-xs text-gray-500 mt-2">Posted on platform</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">${(stats.totalEarnings / 1000).toFixed(1)}K</h3>
              <p className="text-gray-600 text-sm mt-1">Total Earnings</p>
              <p className="text-xs text-purple-600 mt-2">Commission: ${stats.platformCommission.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</h3>
              <p className="text-gray-600 text-sm mt-1">Pending Approvals</p>
              <p className="text-xs text-orange-600 mt-2">Require action</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Pending Approvals */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="text-orange-600" size={24} />
                    Pending Approvals
                  </h2>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    {pendingItems.length} items
                  </span>
                </div>

                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.type === 'payment' ? 'bg-purple-100 text-purple-700' :
                              item.type === 'job' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {item.type.toUpperCase()}
                            </span>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.type === 'payment' ? `Freelancer: ${item.freelancer}` :
                             item.type === 'job' ? `Client: ${item.client}` :
                             `Email: ${item.email}`}
                          </p>
                        </div>
                        {item.amount && (
                          <span className="text-lg font-bold text-gray-900">${item.amount.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Submitted {new Date(item.submittedDate).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" size={24} />
                  Platform Activity
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">New Jobs Posted</p>
                      <p className="text-sm text-gray-600">Last 24 hours</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">24</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">New Proposals</p>
                      <p className="text-sm text-gray-600">Last 24 hours</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">156</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">Payments Processed</p>
                      <p className="text-sm text-gray-600">Last 24 hours</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">$12,500</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">New Users</p>
                      <p className="text-sm text-gray-600">Last 24 hours</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">18</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/admin/users">
                    <button className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold text-sm flex items-center justify-between">
                      <span>Manage Users</span>
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href="/admin/jobs">
                    <button className="w-full px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm flex items-center justify-between">
                      <span>Manage Jobs</span>
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href="/admin/payments">
                    <button className="w-full px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-semibold text-sm flex items-center justify-between">
                      <span>Manage Payments</span>
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href="/admin/settings">
                    <button className="w-full px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm flex items-center justify-between">
                      <span>Settings</span>
                      <Settings size={16} />
                    </button>
                  </Link>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-green-600">Operational</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-green-600">Healthy</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Gateway</span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-green-600">Connected</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Escrow Balance */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Escrow Balance</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Total in Escrow</p>
                    <p className="text-3xl font-bold text-purple-900">${stats.pendingPayments.toLocaleString()}</p>
                  </div>
                  <div className="pt-3 border-t border-purple-200">
                    <p className="text-xs text-purple-700">Awaiting approval and release</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
