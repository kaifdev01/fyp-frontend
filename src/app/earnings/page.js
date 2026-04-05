'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerHeader from '../../components/FreelancerHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft, Calendar,
  Download, Plus, Filter, Search, ArrowLeft, CheckCircle, Clock,
  XCircle, Eye, EyeOff, CreditCard, Wallet, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_EARNINGS = {
  totalEarnings: 12500,
  availableBalance: 8750,
  pendingBalance: 2000,
  withdrawnBalance: 1750,
  thisMonthEarnings: 3200,
  lastMonthEarnings: 2800,
};

const MOCK_TRANSACTIONS = [
  {
    _id: '1',
    type: 'earning',
    amount: 1500,
    description: 'Payment for Full Stack Developer project',
    jobTitle: 'Full Stack Developer Needed for E-commerce Platform',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed',
    clientName: 'TechCorp Inc.',
  },
  {
    _id: '2',
    type: 'withdrawal',
    amount: 500,
    description: 'Withdrawal to Bank Account',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    method: 'Bank Transfer',
  },
  {
    _id: '3',
    type: 'earning',
    amount: 800,
    description: 'Payment for React Native Mobile App project',
    jobTitle: 'React Native Mobile App for Food Delivery',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
    clientName: 'FoodRush',
  },
  {
    _id: '4',
    type: 'earning',
    amount: 2000,
    description: 'Payment for WordPress Website Development',
    jobTitle: 'WordPress Website Development',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'completed',
    clientName: 'Creative Agency',
  },
  {
    _id: '5',
    type: 'withdrawal',
    amount: 1000,
    description: 'Withdrawal to Bank Account',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: 'completed',
    method: 'Bank Transfer',
  },
  {
    _id: '6',
    type: 'earning',
    amount: 1200,
    description: 'Payment for UI/UX Design project',
    jobTitle: 'UI/UX Designer for SaaS Dashboard',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    status: 'completed',
    clientName: 'DataViz Co.',
  },
  {
    _id: '7',
    type: 'earning',
    amount: 2000,
    description: 'Payment pending - Project in progress',
    jobTitle: 'Python Data Analysis Project',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'pending',
    clientName: 'Analytics Startup',
  },
  {
    _id: '8',
    type: 'withdrawal',
    amount: 250,
    description: 'Withdrawal to PayPal',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    status: 'completed',
    method: 'PayPal',
  },
];

export default function EarningsPage() {
  const router = useRouter();
  const [earnings, setEarnings] = useState(MOCK_EARNINGS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showBalance, setShowBalance] = useState(true);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.jobTitle && tx.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.clientName && tx.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > earnings.availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      // API call would go here
      // await api.post('/api/earnings/withdraw', { amount: withdrawAmount, method: withdrawMethod });
      
      toast.success('Withdrawal request submitted successfully!');
      setWithdrawAmount('');
      setShowWithdrawModal(false);
      
      // Update balance
      setEarnings(prev => ({
        ...prev,
        availableBalance: prev.availableBalance - parseFloat(withdrawAmount),
        withdrawnBalance: prev.withdrawnBalance + parseFloat(withdrawAmount),
      }));
    } catch (error) {
      toast.error('Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <FreelancerHeader />
        <Toaster position="top-right" />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings & Wallet</h1>
                  <p className="text-gray-600">Manage your earnings and withdrawals</p>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Plus size={20} />
                  Withdraw Funds
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Earnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Total Earnings</h3>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DollarSign size={20} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">${earnings.totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">All time earnings</p>
              </motion.div>

              {/* Available Balance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Available Balance</h3>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Wallet size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {showBalance ? `$${earnings.availableBalance.toLocaleString()}` : '••••••'}
                  </p>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showBalance ? <Eye size={18} className="text-gray-400" /> : <EyeOff size={18} className="text-gray-400" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Ready to withdraw</p>
              </motion.div>

              {/* Pending Balance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Pending Balance</h3>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Clock size={20} className="text-amber-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">${earnings.pendingBalance.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">From ongoing projects</p>
              </motion.div>

              {/* Withdrawn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Withdrawn</h3>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp size={20} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">${earnings.withdrawnBalance.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Total withdrawn</p>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Monthly Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-600" />
                  Monthly Earnings
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">This Month</span>
                      <span className="text-lg font-bold text-gray-900">${earnings.thisMonthEarnings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${(earnings.thisMonthEarnings / earnings.totalEarnings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Last Month</span>
                      <span className="text-lg font-bold text-gray-900">${earnings.lastMonthEarnings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${(earnings.lastMonthEarnings / earnings.totalEarnings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Projects</span>
                    <span className="font-bold text-gray-900">8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-bold text-gray-900">6</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="font-bold text-gray-900">2</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Avg. Project Value</span>
                    <span className="font-bold text-gray-900">$1,563</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      filterType === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('earning')}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      filterType === 'earning'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Earnings
                  </button>
                  <button
                    onClick={() => setFilterType('withdrawal')}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      filterType === 'withdrawal'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Withdrawals
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx, index) => (
                    <motion.div
                      key={tx._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${
                          tx.type === 'earning'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }`}>
                          {tx.type === 'earning' ? (
                            <ArrowDownLeft size={20} className="text-green-600" />
                          ) : (
                            <ArrowUpRight size={20} className="text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{tx.description}</p>
                          <p className="text-sm text-gray-500">
                            {tx.jobTitle || tx.method} • {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            tx.type === 'earning'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {tx.type === 'earning' ? '+' : '-'}${tx.amount}
                          </p>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {tx.status === 'completed' ? (
                              <CheckCircle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {tx.status === 'completed' ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Withdraw Funds</h2>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-blue-600">${earnings.availableBalance}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Method</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors font-medium"
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
