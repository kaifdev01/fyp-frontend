'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { CreditCard, Download, Filter, Search, Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, Calendar, DollarSign, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    type: 'payment',
    description: 'Payment to John Developer - React Dashboard Development',
    amount: 2200,
    date: '2024-01-25',
    status: 'completed',
    freelancer: 'John Developer',
    jobTitle: 'React Dashboard Development',
    method: 'Credit Card'
  },
  {
    id: 2,
    type: 'refund',
    description: 'Refund - Project Cancelled',
    amount: 500,
    date: '2024-01-22',
    status: 'completed',
    freelancer: 'Sarah Designer',
    jobTitle: 'Mobile App UI Design',
    method: 'Original Payment Method'
  },
  {
    id: 3,
    type: 'payment',
    description: 'Payment to Mike Backend - Backend API Development',
    amount: 4800,
    date: '2024-01-20',
    status: 'completed',
    freelancer: 'Mike Backend',
    jobTitle: 'Backend API Development',
    method: 'Bank Transfer'
  },
  {
    id: 4,
    type: 'payment',
    description: 'Payment to Alex Frontend - Frontend Development',
    amount: 1800,
    date: '2024-01-18',
    status: 'pending',
    freelancer: 'Alex Frontend',
    jobTitle: 'Frontend Development',
    method: 'Credit Card'
  },
  {
    id: 5,
    type: 'payment',
    description: 'Payment to Emma Designer - Logo Design',
    amount: 800,
    date: '2024-01-15',
    status: 'completed',
    freelancer: 'Emma Designer',
    jobTitle: 'Logo Design',
    method: 'Credit Card'
  },
  {
    id: 6,
    type: 'payment',
    description: 'Payment to David Developer - WordPress Redesign',
    amount: 1200,
    date: '2024-01-10',
    status: 'completed',
    freelancer: 'David Developer',
    jobTitle: 'WordPress Website Redesign',
    method: 'Bank Transfer'
  },
  {
    id: 7,
    type: 'payment',
    description: 'Payment to Lisa Copywriter - Content Writing',
    amount: 600,
    date: '2024-01-08',
    status: 'completed',
    freelancer: 'Lisa Copywriter',
    jobTitle: 'Content Writing',
    method: 'Credit Card'
  },
  {
    id: 8,
    type: 'payment',
    description: 'Payment to Tom Developer - Bug Fixes',
    amount: 400,
    date: '2024-01-05',
    status: 'completed',
    freelancer: 'Tom Developer',
    jobTitle: 'Bug Fixes',
    method: 'Credit Card'
  }
];

const MOCK_PAYMENT_METHODS = [
  {
    id: 1,
    type: 'credit_card',
    name: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  },
  {
    id: 2,
    type: 'credit_card',
    name: 'Mastercard',
    last4: '5555',
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false
  },
  {
    id: 3,
    type: 'bank_transfer',
    name: 'Bank Account',
    accountNumber: '****1234',
    bankName: 'Chase Bank',
    isDefault: false
  }
];

const STATUS_COLORS = {
  completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  failed: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle }
};

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.freelancer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const stats = {
    totalSpent: transactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingPayments: transactions
      .filter(t => t.type === 'payment' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0),
    totalRefunds: transactions
      .filter(t => t.type === 'refund' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: transactions.length
  };

  const handleDeletePaymentMethod = (methodId) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(m => m.id !== methodId));
    }
  };

  const handleSetDefaultPaymentMethod = (methodId) => {
    setPaymentMethods(paymentMethods.map(m => ({
      ...m,
      isDefault: m.id === methodId
    })));
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
                <CreditCard className="text-green-600" size={32} />
                Payments & Billing
              </h1>
              <p className="text-gray-600">Manage your payments, transactions, and payment methods</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <DollarSign size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm mt-1">Total Spent</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">${stats.pendingPayments.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm mt-1">Pending Payments</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <ArrowDownLeft size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">${stats.totalRefunds.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm mt-1">Total Refunds</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</h3>
                <p className="text-gray-600 text-sm mt-1">Total Transactions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">

                {/* Transaction History */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <ArrowUpRight className="text-green-600" size={24} />
                      Transaction History
                    </h2>
                  </div>

                  {/* Filters */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Search */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search by freelancer, job, or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        />
                      </div>

                      {/* Status Filter */}
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>

                      {/* Type Filter */}
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                      >
                        <option value="all">All Types</option>
                        <option value="payment">Payments</option>
                        <option value="refund">Refunds</option>
                      </select>
                    </div>
                  </div>

                  {/* Transactions List */}
                  {filteredTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {filteredTransactions.map((transaction) => {
                        const StatusIcon = STATUS_COLORS[transaction.status].icon;
                        return (
                          <div
                            key={transaction.id}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowTransactionDetails(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'payment' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                  {transaction.type === 'payment' ? (
                                    <ArrowUpRight className={transaction.type === 'payment' ? 'text-red-600' : 'text-blue-600'} size={20} />
                                  ) : (
                                    <ArrowDownLeft className="text-blue-600" size={20} />
                                  )}
                                </div>

                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                                  <p className="text-sm text-gray-500 mt-1">{transaction.freelancer} • {new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className={`font-bold text-lg ${transaction.type === 'payment' ? 'text-red-600' : 'text-blue-600'}`}>
                                    {transaction.type === 'payment' ? '-' : '+'}${transaction.amount.toLocaleString()}
                                  </p>
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[transaction.status].bg} ${STATUS_COLORS[transaction.status].text}`}>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </div>
                                <Eye className="text-gray-400" size={18} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No transactions found</h3>
                      <p className="text-gray-600">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
                    <button
                      onClick={() => setShowAddPaymentMethod(true)}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {method.type === 'credit_card' ? `${method.name} ••••${method.last4}` : method.bankName}
                              </h4>
                              {method.isDefault && (
                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {method.type === 'credit_card'
                                ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                                : `Account: ${method.accountNumber}`}
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                          </button>
                        </div>

                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefaultPaymentMethod(method.id)}
                            className="w-full text-xs font-semibold text-green-600 hover:text-green-700 py-2 border-t border-gray-200 mt-3"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                      Download Invoice
                    </button>
                    <button className="w-full px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold text-sm">
                      View Tax Summary
                    </button>
                    <button className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                      Contact Support
                    </button>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">Billing Info</h3>
                  <div className="space-y-3 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Billing Cycle</span>
                      <span className="font-semibold">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Billing Date</span>
                      <span className="font-semibold">Feb 1, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Status</span>
                      <span className="font-semibold text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details Modal */}
        {showTransactionDetails && selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setShowTransactionDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Amount</span>
                  <span className={`text-2xl font-bold ${selectedTransaction.type === 'payment' ? 'text-red-600' : 'text-blue-600'}`}>
                    {selectedTransaction.type === 'payment' ? '-' : '+'}${selectedTransaction.amount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[selectedTransaction.status].bg} ${STATUS_COLORS[selectedTransaction.status].text}`}>
                      {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold text-gray-900">{selectedTransaction.type === 'payment' ? 'Payment' : 'Refund'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold text-gray-900">{new Date(selectedTransaction.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Freelancer</span>
                    <span className="font-semibold text-gray-900">{selectedTransaction.freelancer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job</span>
                    <span className="font-semibold text-gray-900">{selectedTransaction.jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold text-gray-900">{selectedTransaction.method}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download Receipt
                </button>
                <button
                  onClick={() => setShowTransactionDetails(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddPaymentMethod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Method Type</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Set as default payment method</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                  Add Payment Method
                </button>
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
