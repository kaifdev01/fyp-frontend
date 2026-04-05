'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Users, Search, Filter, Star, DollarSign, Calendar, MessageSquare, Eye, MoreVertical, X, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const MOCK_HIRED_FREELANCERS = [
  {
    id: 1,
    name: 'John Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    title: 'Full Stack Developer',
    rating: 4.8,
    reviews: 24,
    hourlyRate: 35,
    location: 'New York, USA',
    jobTitle: 'React Dashboard Development',
    jobId: 1,
    contractStatus: 'active',
    startDate: '2024-01-20',
    endDate: '2024-02-15',
    totalEarned: 2200,
    hoursWorked: 65,
    completionPercentage: 45,
    lastPayment: '2024-01-25',
    paymentStatus: 'paid'
  },
  {
    id: 3,
    name: 'Mike Backend',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    title: 'Backend Engineer',
    rating: 4.7,
    reviews: 18,
    hourlyRate: 45,
    location: 'London, UK',
    jobTitle: 'Backend API Development',
    jobId: 3,
    contractStatus: 'active',
    startDate: '2024-01-19',
    endDate: '2024-03-10',
    totalEarned: 4800,
    hoursWorked: 85,
    completionPercentage: 60,
    lastPayment: '2024-01-28',
    paymentStatus: 'paid'
  },
  {
    id: 6,
    name: 'Lisa Writer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    title: 'Content Writer',
    rating: 4.8,
    reviews: 28,
    hourlyRate: 25,
    location: 'Melbourne, Australia',
    jobTitle: 'Backend API Development',
    jobId: 3,
    contractStatus: 'completed',
    startDate: '2024-01-18',
    endDate: '2024-02-10',
    totalEarned: 5000,
    hoursWorked: 200,
    completionPercentage: 100,
    lastPayment: '2024-02-10',
    paymentStatus: 'paid'
  },
  {
    id: 2,
    name: 'Sarah Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    title: 'UI/UX Designer',
    rating: 4.9,
    reviews: 32,
    hourlyRate: 40,
    location: 'San Francisco, USA',
    jobTitle: 'Mobile App UI Design',
    jobId: 2,
    contractStatus: 'pending_payment',
    startDate: '2024-01-21',
    endDate: '2024-02-18',
    totalEarned: 1400,
    hoursWorked: 35,
    completionPercentage: 100,
    lastPayment: null,
    paymentStatus: 'pending'
  }
];

const CONTRACT_STATUS = {
  active: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  pending_payment: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Payment' }
};

export default function HiredFreelancersPage() {
  const [freelancers, setFreelancers] = useState(MOCK_HIRED_FREELANCERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  const filteredFreelancers = freelancers
    .filter(freelancer => {
      const matchesSearch = freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || freelancer.contractStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });

  const stats = {
    total: freelancers.length,
    active: freelancers.filter(f => f.contractStatus === 'active').length,
    completed: freelancers.filter(f => f.contractStatus === 'completed').length,
    pendingPayment: freelancers.filter(f => f.contractStatus === 'pending_payment').length
  };

  const totalSpent = freelancers.reduce((sum, f) => sum + f.totalEarned, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <ClientHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Users className="text-green-600" size={32} />
                Hired Freelancers
              </h1>
              <p className="text-gray-600">Manage your team and track project progress</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Total Hired</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Active Contracts</p>
                <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-green-600">${totalSpent.toLocaleString()}</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="flex-1 relative w-full lg:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name or job..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending_payment">Pending Payment</option>
                </select>
              </div>
            </div>

            {/* Freelancers List */}
            {filteredFreelancers.length > 0 ? (
              <div className="space-y-4">
                {filteredFreelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                      {/* Freelancer Info */}
                      <div className="flex gap-4 flex-1">
                        <img
                          src={freelancer.avatar}
                          alt={freelancer.name}
                          className="w-20 h-20 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{freelancer.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${CONTRACT_STATUS[freelancer.contractStatus].bg} ${CONTRACT_STATUS[freelancer.contractStatus].text}`}>
                              {CONTRACT_STATUS[freelancer.contractStatus].label}
                            </span>
                          </div>
                          <p className="text-green-600 font-semibold text-sm mb-2">{freelancer.title}</p>
                          <p className="text-gray-600 text-sm mb-3">{freelancer.jobTitle}</p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Star size={16} className="text-yellow-500" fill="currentColor" />
                              <span className="font-semibold">{freelancer.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <DollarSign size={16} className="text-green-600" />
                              <span className="font-semibold">${freelancer.hourlyRate}/hr</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock size={16} className="text-gray-400" />
                              {freelancer.hoursWorked}h worked
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contract Details */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                          <p className="text-2xl font-bold text-green-600">${freelancer.totalEarned.toLocaleString()}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full md:w-48">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-600 font-medium">Progress</p>
                            <p className="text-xs font-bold text-gray-900">{freelancer.completionPercentage}%</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${freelancer.completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedFreelancer(freelancer)}
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2">
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No hired freelancers</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You haven\'t hired any freelancers yet. Find and hire talented freelancers!'}
                </p>
                <Link href="/client-dashboard/find-freelancers">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    Find Freelancers
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Freelancer Detail Modal */}
        {selectedFreelancer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Contract Details</h2>
                <button
                  onClick={() => setSelectedFreelancer(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">

                {/* Freelancer Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <img
                    src={selectedFreelancer.avatar}
                    alt={selectedFreelancer.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedFreelancer.name}</h3>
                    <p className="text-green-600 font-semibold text-sm">{selectedFreelancer.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={16} className="text-yellow-500" fill="currentColor" />
                      <span className="font-semibold text-gray-900">{selectedFreelancer.rating}</span>
                      <span className="text-gray-500 text-sm">({selectedFreelancer.reviews} reviews)</span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${CONTRACT_STATUS[selectedFreelancer.contractStatus].bg} ${CONTRACT_STATUS[selectedFreelancer.contractStatus].text}`}>
                    {CONTRACT_STATUS[selectedFreelancer.contractStatus].label}
                  </span>
                </div>

                {/* Job Info */}
                <div className="pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Job</h4>
                  <p className="text-gray-600">{selectedFreelancer.jobTitle}</p>
                </div>

                {/* Contract Details */}
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                    <p className="font-bold text-gray-900">{new Date(selectedFreelancer.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                    <p className="font-bold text-gray-900">{new Date(selectedFreelancer.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Hours Worked</p>
                    <p className="font-bold text-gray-900">{selectedFreelancer.hoursWorked}h</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                    <p className="font-bold text-green-600">${selectedFreelancer.totalEarned.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Progress</h4>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600">{selectedFreelancer.completionPercentage}% Complete</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${selectedFreelancer.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Status</h4>
                  <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Payment</p>
                      <p className="font-bold text-gray-900">
                        {selectedFreelancer.lastPayment ? new Date(selectedFreelancer.lastPayment).toLocaleDateString() : 'Not paid yet'}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedFreelancer.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedFreelancer.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedFreelancer.paymentStatus === 'pending' && (
                    <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold">
                      Release Payment
                    </button>
                  )}
                  <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-bold flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
