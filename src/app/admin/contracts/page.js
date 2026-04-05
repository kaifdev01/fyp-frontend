'use client';
import { useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import DeliverableVerification from '../../../components/DeliverableVerification';
import { FileText, Search, Filter, Eye, CheckCircle, AlertCircle, Clock, X, FileCheck, DollarSign } from 'lucide-react';
import Link from 'next/link';

const MOCK_CONTRACTS = [
  {
    id: 1,
    jobTitle: 'React Dashboard Development',
    client: 'TechCorp Inc.',
    freelancer: 'John Developer',
    amount: 2500,
    status: 'active',
    paymentStatus: 'pending_review',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    createdDate: '2024-01-15',
    milestones: 2,
    completedMilestones: 1,
    disputes: 0,
    deliverables: ['Dashboard UI', 'API Integration'],
    submittedDate: '2024-02-10'
  },
  {
    id: 2,
    jobTitle: 'Backend API Development',
    client: 'TechCorp Inc.',
    freelancer: 'Mike Backend',
    amount: 5000,
    status: 'active',
    paymentStatus: 'approved',
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    createdDate: '2024-01-10',
    milestones: 3,
    completedMilestones: 1,
    disputes: 0,
    deliverables: ['API Endpoints', 'Database Schema'],
    submittedDate: '2024-02-05'
  },
  {
    id: 3,
    jobTitle: 'Mobile App UI Design',
    client: 'FoodRush',
    freelancer: 'Sarah Designer',
    amount: 1500,
    status: 'active',
    paymentStatus: 'pending_review',
    startDate: '2024-01-18',
    endDate: '2024-02-18',
    createdDate: '2024-01-25',
    milestones: 2,
    completedMilestones: 1,
    disputes: 0,
    deliverables: ['Wireframes', 'High-fidelity Designs'],
    submittedDate: '2024-02-12'
  },
  {
    id: 4,
    jobTitle: 'Logo Design',
    client: 'Creative Agency',
    freelancer: 'Emma Designer',
    amount: 800,
    status: 'completed',
    paymentStatus: 'approved',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    createdDate: '2024-01-15',
    milestones: 1,
    completedMilestones: 1,
    disputes: 0,
    deliverables: ['Logo Design'],
    submittedDate: '2024-01-20'
  },
  {
    id: 5,
    jobTitle: 'WordPress Website Redesign',
    client: 'TechCorp Inc.',
    freelancer: 'David Developer',
    amount: 1200,
    status: 'disputed',
    paymentStatus: 'on_hold',
    startDate: '2023-12-20',
    endDate: '2024-01-20',
    createdDate: '2023-12-20',
    milestones: 2,
    completedMilestones: 1,
    disputes: 1,
    deliverables: ['New Design', 'Implementation'],
    submittedDate: '2024-01-18'
  },
  {
    id: 6,
    jobTitle: 'Content Writing',
    client: 'DataViz Co.',
    freelancer: 'Lisa Copywriter',
    amount: 600,
    status: 'active',
    paymentStatus: 'pending_review',
    startDate: '2024-01-08',
    endDate: '2024-01-15',
    createdDate: '2024-01-25',
    milestones: 1,
    completedMilestones: 0,
    disputes: 0,
    deliverables: [],
    submittedDate: null
  }
];

const STATUS_COLORS = {
  active: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active', icon: CheckCircle },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: CheckCircle },
  disputed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Disputed', icon: AlertCircle }
};

const PAYMENT_STATUS_COLORS = {
  pending_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review', icon: Clock },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved', icon: CheckCircle },
  on_hold: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'On Hold', icon: AlertCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: X }
};

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.freelancer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    pendingReview: contracts.filter(c => c.paymentStatus === 'pending_review').length,
    approved: contracts.filter(c => c.paymentStatus === 'approved').length,
    onHold: contracts.filter(c => c.paymentStatus === 'on_hold').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <AdminHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              Contracts Management
            </h1>
            <p className="text-gray-600">Review deliverables and approve payments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Contracts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Active</p>
              <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">On Hold</p>
              <p className="text-3xl font-bold text-orange-600">{stats.onHold}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by job, client, or freelancer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
              >
                <option value="all">All Payment Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="on_hold">On Hold</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Contracts Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Job Title</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Freelancer</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract) => {
                    const StatusIcon = STATUS_COLORS[contract.status].icon;
                    const PaymentIcon = PAYMENT_STATUS_COLORS[contract.paymentStatus].icon;
                    return (
                      <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-gray-900">{contract.jobTitle}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{contract.client}</td>
                        <td className="py-4 px-6 text-gray-600">{contract.freelancer}</td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">${contract.amount.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[contract.status].bg} ${STATUS_COLORS[contract.status].text}`}>
                            <StatusIcon size={14} />
                            {STATUS_COLORS[contract.status].label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[contract.paymentStatus].bg} ${PAYMENT_STATUS_COLORS[contract.paymentStatus].text}`}>
                            <PaymentIcon size={14} />
                            {PAYMENT_STATUS_COLORS[contract.paymentStatus].label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => {
                              setSelectedContract(contract);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                          >
                            <Eye size={16} />
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Details Modal */}
      {showDetails && selectedContract && (
        <ContractDetailsModal
          contract={selectedContract}
          onClose={() => setShowDetails(false)}
          onApprovePayment={() => {
            setContracts(contracts.map(c => c.id === selectedContract.id ? { ...c, paymentStatus: 'approved' } : c));
            setShowDetails(false);
          }}
          onHoldPayment={() => {
            setContracts(contracts.map(c => c.id === selectedContract.id ? { ...c, paymentStatus: 'on_hold' } : c));
            setShowDetails(false);
          }}
          onRejectPayment={() => {
            setContracts(contracts.map(c => c.id === selectedContract.id ? { ...c, paymentStatus: 'rejected' } : c));
            setShowDetails(false);
          }}
        />
      )}
    </div>
  );
}

function ContractDetailsModal({ contract, onClose, onApprovePayment, onHoldPayment, onRejectPayment }) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 sm:my-8">
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Contract Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-4 sm:px-6">
          <div className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Contract Details
            </button>
            <button
              onClick={() => setActiveTab('deliverables')}
              className={`py-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'deliverables'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Deliverables
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`py-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'milestones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Milestones
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Title</p>
                  <p className="font-bold text-gray-900">{contract.jobTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contract Amount</p>
                  <p className="text-2xl font-bold text-blue-600">${contract.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Client</p>
                  <p className="font-semibold text-gray-900">{contract.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Freelancer</p>
                  <p className="font-semibold text-gray-900">{contract.freelancer}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">{new Date(contract.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900">{new Date(contract.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Contract Status</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${STATUS_COLORS[contract.status].bg} ${STATUS_COLORS[contract.status].text}`}>
                    {STATUS_COLORS[contract.status].label}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${PAYMENT_STATUS_COLORS[contract.paymentStatus].bg} ${PAYMENT_STATUS_COLORS[contract.paymentStatus].text}`}>
                    {PAYMENT_STATUS_COLORS[contract.paymentStatus].label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Deliverables Tab */}
          {activeTab === 'deliverables' && (
            <DeliverableVerification contract={contract} onClose={() => {}} />
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-gray-900">Progress: {contract.completedMilestones}/{contract.milestones} completed</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(contract.completedMilestones / contract.milestones) * 100}%` }}
                ></div>
              </div>

              <div className="space-y-3 mt-6">
                {[...Array(contract.milestones)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Milestone {i + 1}</p>
                        <p className="text-sm text-gray-600 mt-1">${(contract.amount / contract.milestones).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${i < contract.completedMilestones
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {i < contract.completedMilestones ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {contract.paymentStatus === 'pending_review' && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onApprovePayment}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Approve Payment
            </button>
            <button
              onClick={onHoldPayment}
              className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Clock size={18} />
              Hold Payment
            </button>
            <button
              onClick={onRejectPayment}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <X size={18} />
              Reject Payment
            </button>
          </div>
        )}

        {contract.paymentStatus !== 'pending_review' && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
