'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { FileText, Search, Filter, Eye, Download, X, CheckCircle, Clock, AlertCircle, Calendar, DollarSign, User } from 'lucide-react';
import Link from 'next/link';

const MOCK_CONTRACTS = [
  {
    id: 1,
    freelancerName: 'John Developer',
    freelancerAvatar: null,
    jobTitle: 'React Dashboard Development',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: 2500,
    hourlyRate: 50,
    hoursWorked: 35,
    paymentStatus: 'partial',
    amountPaid: 1750,
    description: 'Build a comprehensive admin dashboard with React and Node.js',
    deliverables: ['Dashboard UI', 'API Integration', 'User Authentication'],
    terms: 'Payment upon completion of each milestone'
  },
  {
    id: 2,
    freelancerName: 'Sarah Designer',
    freelancerAvatar: null,
    jobTitle: 'Mobile App UI Design',
    status: 'active',
    startDate: '2024-01-18',
    endDate: '2024-02-18',
    budget: 1500,
    hourlyRate: 45,
    hoursWorked: 20,
    paymentStatus: 'pending',
    amountPaid: 0,
    description: 'Design beautiful UI for iOS and Android mobile app',
    deliverables: ['Wireframes', 'High-fidelity Designs', 'Design System'],
    terms: '50% upfront, 50% on completion'
  },
  {
    id: 3,
    freelancerName: 'Mike Backend',
    freelancerAvatar: null,
    jobTitle: 'Backend API Development',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    budget: 5000,
    hourlyRate: 60,
    hoursWorked: 45,
    paymentStatus: 'partial',
    amountPaid: 2700,
    description: 'Create RESTful API with Node.js and MongoDB',
    deliverables: ['API Endpoints', 'Database Schema', 'Documentation'],
    terms: 'Milestone-based payments'
  },
  {
    id: 4,
    freelancerName: 'David Developer',
    freelancerAvatar: null,
    jobTitle: 'WordPress Website Redesign',
    status: 'completed',
    startDate: '2023-12-20',
    endDate: '2024-01-20',
    budget: 1200,
    hourlyRate: 40,
    hoursWorked: 30,
    paymentStatus: 'completed',
    amountPaid: 1200,
    description: 'Redesign existing WordPress website with modern design',
    deliverables: ['New Design', 'Implementation', 'Testing'],
    terms: 'Full payment upon completion'
  },
  {
    id: 5,
    freelancerName: 'Emma Designer',
    freelancerAvatar: null,
    jobTitle: 'Logo Design',
    status: 'completed',
    startDate: '2023-12-10',
    endDate: '2024-01-10',
    budget: 800,
    hourlyRate: 35,
    hoursWorked: 20,
    paymentStatus: 'completed',
    amountPaid: 800,
    description: 'Create a professional logo for tech startup',
    deliverables: ['Logo Design', 'Brand Guidelines', 'File Formats'],
    terms: 'Full payment upon completion'
  },
  {
    id: 6,
    freelancerName: 'Lisa Copywriter',
    freelancerAvatar: null,
    jobTitle: 'Content Writing',
    status: 'cancelled',
    startDate: '2024-01-08',
    endDate: '2024-01-15',
    budget: 600,
    hourlyRate: 30,
    hoursWorked: 5,
    paymentStatus: 'refunded',
    amountPaid: 0,
    description: 'Write blog posts and website content',
    deliverables: [],
    terms: 'Cancelled by client'
  }
];

const STATUS_COLORS = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' }
};

const PAYMENT_STATUS_COLORS = {
  completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  pending: { bg: 'bg-orange-100', text: 'text-orange-700', icon: AlertCircle },
  refunded: { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle }
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredContracts = contracts
    .filter(c => {
      const matchesSearch = c.freelancerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const stats = {
    active: contracts.filter(c => c.status === 'active').length,
    completed: contracts.filter(c => c.status === 'completed').length,
    cancelled: contracts.filter(c => c.status === 'cancelled').length,
    total: contracts.length
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setShowDetails(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <ClientHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FileText className="text-green-600" size={32} />
                Contracts
              </h1>
              <p className="text-gray-600">Manage all your contracts with freelancers</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Total Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Completed</p>
                <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Cancelled</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="flex-1 relative w-full lg:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by freelancer or job title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium w-full lg:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Contracts List */}
            {filteredContracts.length > 0 ? (
              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <div key={contract.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                            {contract.freelancerAvatar ? (
                              <img src={contract.freelancerAvatar} alt={contract.freelancerName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <span className="text-lg font-bold text-gray-600">{contract.freelancerName[0]}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{contract.jobTitle}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <User size={14} />
                              {contract.freelancerName}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_COLORS[contract.status].bg} ${STATUS_COLORS[contract.status].text}`}>
                            {STATUS_COLORS[contract.status].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Budget</p>
                        <p className="text-lg font-bold text-green-600">${contract.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hours Worked</p>
                        <p className="text-lg font-bold text-gray-900">{contract.hoursWorked}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                        <p className="text-lg font-bold text-gray-900">{new Date(contract.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PAYMENT_STATUS_COLORS[contract.paymentStatus].bg} ${PAYMENT_STATUS_COLORS[contract.paymentStatus].text}`}>
                          {contract.paymentStatus.charAt(0).toUpperCase() + contract.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">Payment Progress</p>
                        <p className="text-sm font-bold text-gray-900">${contract.amountPaid.toLocaleString()} / ${contract.budget.toLocaleString()}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(contract.amountPaid / contract.budget) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(contract)}
                        className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                        <Download size={16} />
                        Download
                      </button>
                      {contract.status === 'active' && (
                        <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                          Manage
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No contracts found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You don\'t have any contracts yet'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contract Details Modal */}
        {showDetails && selectedContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 sm:my-8">
              <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Contract Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Header Info */}
                <div className="flex items-start gap-3 sm:gap-4 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg sm:text-2xl font-bold text-gray-600">{selectedContract.freelancerName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{selectedContract.jobTitle}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">{selectedContract.freelancerName}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedContract.status].bg} ${STATUS_COLORS[selectedContract.status].text}`}>
                      {STATUS_COLORS[selectedContract.status].label}
                    </span>
                  </div>
                </div>

                {/* Contract Info Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-600 mb-1">Budget</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">${selectedContract.budget.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-600 mb-1">Hourly Rate</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">${selectedContract.hourlyRate}/hr</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-600 mb-1">Hours Worked</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{selectedContract.hoursWorked}h</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs text-gray-600 mb-1">Amount Paid</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">${selectedContract.amountPaid.toLocaleString()}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Start Date
                    </p>
                    <p className="text-gray-600 text-sm">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      End Date
                    </p>
                    <p className="text-gray-600 text-sm">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Description</p>
                  <p className="text-gray-600 break-words text-sm">{selectedContract.description}</p>
                </div>

                {/* Deliverables */}
                {selectedContract.deliverables.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-3">Deliverables</p>
                    <ul className="space-y-2">
                      {selectedContract.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                          <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Terms */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Terms</p>
                  <p className="text-gray-600 break-words text-sm">{selectedContract.terms}</p>
                </div>

                {/* Payment Progress */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Payment Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${(selectedContract.amountPaid / selectedContract.budget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">${selectedContract.amountPaid.toLocaleString()} of ${selectedContract.budget.toLocaleString()} paid</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                  <button className="w-full px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download Contract
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    Close
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
