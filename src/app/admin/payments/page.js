'use client';
import { useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import { DollarSign, Search, Filter, CheckCircle, Clock, AlertCircle, X, Eye } from 'lucide-react';
import Link from 'next/link';

const MOCK_ESCROW_PAYMENTS = [
  {
    id: 1,
    jobTitle: 'React Dashboard Development',
    client: 'TechCorp Inc.',
    freelancer: 'John Developer',
    amount: 2200,
    status: 'pending_approval',
    createdDate: '2024-01-25',
    dueDate: '2024-02-15',
    description: 'Payment held in escrow for project completion'
  },
  {
    id: 2,
    jobTitle: 'Backend API Development',
    client: 'TechCorp Inc.',
    freelancer: 'Mike Backend',
    amount: 4800,
    status: 'pending_approval',
    createdDate: '2024-01-24',
    dueDate: '2024-03-10',
    description: 'Milestone 2 payment - API endpoints completed'
  },
  {
    id: 3,
    jobTitle: 'Mobile App UI Design',
    client: 'FoodRush',
    freelancer: 'Sarah Designer',
    amount: 1400,
    status: 'approved',
    createdDate: '2024-01-20',
    dueDate: '2024-02-18',
    description: 'Payment approved, awaiting freelancer confirmation'
  },
  {
    id: 4,
    jobTitle: 'Logo Design',
    client: 'Creative Agency',
    freelancer: 'Emma Designer',
    amount: 800,
    status: 'released',
    createdDate: '2024-01-15',
    dueDate: '2024-01-20',
    description: 'Payment released to freelancer'
  },
  {
    id: 5,
    jobTitle: 'WordPress Website Redesign',
    client: 'TechCorp Inc.',
    freelancer: 'David Developer',
    amount: 1200,
    status: 'released',
    createdDate: '2024-01-10',
    dueDate: '2024-01-20',
    description: 'Payment released to freelancer'
  },
  {
    id: 6,
    jobTitle: 'Content Writing',
    client: 'DataViz Co.',
    freelancer: 'Lisa Copywriter',
    amount: 600,
    status: 'disputed',
    createdDate: '2024-01-08',
    dueDate: '2024-01-15',
    description: 'Payment disputed - quality issues reported'
  }
];

const STATUS_COLORS = {
  pending_approval: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Approval', icon: Clock },
  approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Approved', icon: CheckCircle },
  released: { bg: 'bg-green-100', text: 'text-green-700', label: 'Released', icon: CheckCircle },
  disputed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Disputed', icon: AlertCircle }
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(MOCK_ESCROW_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.freelancer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalEscrow: payments.reduce((sum, p) => sum + p.amount, 0),
    pendingApproval: payments.filter(p => p.status === 'pending_approval').reduce((sum, p) => sum + p.amount, 0),
    approved: payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
    released: payments.filter(p => p.status === 'released').reduce((sum, p) => sum + p.amount, 0)
  };

  const handleApprove = (paymentId) => {
    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'approved' } : p));
    setShowDetails(false);
  };

  const handleRelease = (paymentId) => {
    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'released' } : p));
    setShowDetails(false);
  };

  const handleReject = (paymentId) => {
    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'disputed' } : p));
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <AdminHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Total in Escrow</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalEscrow.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600">${stats.pendingApproval.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Approved</p>
              <p className="text-3xl font-bold text-blue-600">${stats.approved.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Released</p>
              <p className="text-3xl font-bold text-green-600">${stats.released.toLocaleString()}</p>
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="released">Released</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Job</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Freelancer</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => {
                    const StatusIcon = STATUS_COLORS[payment.status].icon;
                    return (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-gray-900">{payment.jobTitle}</p>
                          <p className="text-xs text-gray-500 mt-1">Created {new Date(payment.createdDate).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-900">{payment.client}</td>
                        <td className="py-4 px-6 text-gray-900">{payment.freelancer}</td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">${payment.amount.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[payment.status].bg} ${STATUS_COLORS[payment.status].text}`}>
                            <StatusIcon size={14} />
                            {STATUS_COLORS[payment.status].label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View
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

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Job Title</p>
                    <p className="font-bold text-gray-900">{selectedPayment.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-purple-600">${selectedPayment.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Client</p>
                    <p className="font-semibold text-gray-900">{selectedPayment.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Freelancer</p>
                    <p className="font-semibold text-gray-900">{selectedPayment.freelancer}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Created Date</span>
                  <span className="font-semibold text-gray-900">{new Date(selectedPayment.createdDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span className="font-semibold text-gray-900">{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Description</p>
                <p className="text-gray-600">{selectedPayment.description}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Current Status</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${STATUS_COLORS[selectedPayment.status].bg} ${STATUS_COLORS[selectedPayment.status].text}`}>
                  {STATUS_COLORS[selectedPayment.status].label}
                </span>
              </div>

              {/* Actions */}
              {selectedPayment.status === 'pending_approval' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedPayment.id)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                  >
                    Approve Payment
                  </button>
                  <button
                    onClick={() => handleReject(selectedPayment.id)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}

              {selectedPayment.status === 'approved' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleRelease(selectedPayment.id)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                  >
                    Release Payment
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    Close
                  </button>
                </div>
              )}

              {selectedPayment.status === 'released' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    Close
                  </button>
                </div>
              )}

              {selectedPayment.status === 'disputed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">This payment is under dispute. Please contact support for resolution.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
