'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerHeader from '../../components/FreelancerHeader';
import ClientHeader from '../../components/ClientHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Flag, Search, Filter, Eye, Plus, Clock, CheckCircle, AlertCircle, X, MessageSquare, Calendar, DollarSign, User } from 'lucide-react';

const MOCK_DISPUTES = [
  {
    id: 1,
    jobTitle: 'React Dashboard Development',
    client: 'TechCorp Inc.',
    freelancer: 'John Developer',
    amount: 2500,
    status: 'open',
    priority: 'high',
    createdDate: '2024-01-25',
    updatedDate: '2024-01-28',
    reason: 'Quality issues with deliverables',
    description: 'The dashboard does not meet the specifications. Several components are not working as expected.',
    messages: 5,
    resolution: null
  },
  {
    id: 2,
    jobTitle: 'Backend API Development',
    client: 'TechCorp Inc.',
    freelancer: 'Mike Backend',
    amount: 4800,
    status: 'in_progress',
    priority: 'medium',
    createdDate: '2024-01-20',
    updatedDate: '2024-01-27',
    reason: 'Delayed delivery',
    description: 'Project deadline was missed by 5 days without communication.',
    messages: 12,
    resolution: null
  },
  {
    id: 3,
    jobTitle: 'Mobile App UI Design',
    client: 'FoodRush',
    freelancer: 'Sarah Designer',
    amount: 1400,
    status: 'resolved',
    priority: 'low',
    createdDate: '2024-01-15',
    updatedDate: '2024-01-22',
    reason: 'Design revision request',
    description: 'Client requested multiple revisions beyond the agreed scope.',
    messages: 8,
    resolution: 'Partial refund of $200 issued. Additional revisions agreed upon.'
  },
  {
    id: 4,
    jobTitle: 'WordPress Website Redesign',
    client: 'Creative Agency',
    freelancer: 'David Developer',
    amount: 1200,
    status: 'open',
    priority: 'high',
    createdDate: '2024-01-18',
    updatedDate: '2024-01-26',
    reason: 'Payment not released from escrow',
    description: 'Work completed but payment is still held in escrow after 2 weeks.',
    messages: 3,
    resolution: null
  },
  {
    id: 5,
    jobTitle: 'Content Writing - Blog Posts',
    client: 'DataViz Co.',
    freelancer: 'Lisa Copywriter',
    amount: 600,
    status: 'resolved',
    priority: 'low',
    createdDate: '2024-01-10',
    updatedDate: '2024-01-16',
    reason: 'Content quality concerns',
    description: 'Articles did not meet SEO standards.',
    messages: 6,
    resolution: 'Full refund issued. Freelancer agreed to improve quality standards.'
  }
];

const STATUS_CONFIG = {
  open: { bg: 'bg-red-100', text: 'text-red-700', label: 'Open', icon: AlertCircle, color: 'red' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress', icon: Clock, color: 'yellow' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved', icon: CheckCircle, color: 'green' }
};

const PRIORITY_CONFIG = {
  low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Low' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
  high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' }
};

export default function DisputesPage() {
  const router = useRouter();
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userRole, setUserRole] = useState('freelancer');

  // Get user role from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || 'freelancer');
      } catch (e) {
        setUserRole('freelancer');
      }
    }
  }, []);

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = d.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.freelancer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || d.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    inProgress: disputes.filter(d => d.status === 'in_progress').length,
    resolved: disputes.filter(d => d.status === 'resolved').length
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {userRole === 'client' ? <ClientHeader /> : <FreelancerHeader />}

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Flag className="text-red-600" size={32} />
                    Disputes
                  </h1>
                  <p className="text-gray-600">Manage and resolve job disputes</p>
                </div>
                <button
                  onClick={() => router.push('/disputes/new')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <Plus size={20} />
                  File Dispute
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Total Disputes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Open</p>
                <p className="text-3xl font-bold text-red-600">{stats.open}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Disputes List */}
            {filteredDisputes.length > 0 ? (
              <div className="space-y-4">
                {filteredDisputes.map((dispute) => {
                  const StatusConfig = STATUS_CONFIG[dispute.status];
                  const PriorityConfig = PRIORITY_CONFIG[dispute.priority];

                  return (
                    <div key={dispute.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{dispute.jobTitle}</h3>
                            <div className="flex items-center gap-4 flex-wrap mb-3">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <User size={14} />
                                {dispute.client}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <User size={14} />
                                {dispute.freelancer}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <DollarSign size={14} />
                                ${dispute.amount.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar size={14} />
                                {new Date(dispute.createdDate).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{dispute.reason}</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="mb-3">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${StatusConfig.bg} ${StatusConfig.text}`}>
                                <StatusConfig.icon size={14} />
                                {StatusConfig.label}
                              </span>
                            </div>
                            <div>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${PriorityConfig.bg} ${PriorityConfig.text}`}>
                                {PriorityConfig.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MessageSquare size={14} />
                              {dispute.messages} messages
                            </div>
                            {dispute.resolution && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                                Resolved
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setShowDetails(true);
                            }}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Flag size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No disputes found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You have no disputes. Great work!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetails && selectedDispute && (
          <DisputeDetailsModal
            dispute={selectedDispute}
            onClose={() => setShowDetails(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

function DisputeDetailsModal({ dispute, onClose }) {
  const StatusConfig = STATUS_CONFIG[dispute.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4 sm:my-8">
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flag className="text-red-600" size={24} />
            Dispute Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Job Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{dispute.jobTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Client</p>
                <p className="font-semibold text-gray-900">{dispute.client}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Freelancer</p>
                <p className="font-semibold text-gray-900">{dispute.freelancer}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="font-semibold text-gray-900">${dispute.amount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="font-semibold text-gray-900">{new Date(dispute.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Status</p>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${StatusConfig.bg} ${StatusConfig.text}`}>
                <StatusConfig.icon size={16} />
                {StatusConfig.label}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Priority</p>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${PRIORITY_CONFIG[dispute.priority].bg} ${PRIORITY_CONFIG[dispute.priority].text}`}>
                {PRIORITY_CONFIG[dispute.priority].label}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Dispute Reason</p>
            <p className="text-gray-600 font-medium">{dispute.reason}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Description</p>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
              {dispute.description}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{dispute.messages} messages</span> in dispute thread
            </p>
          </div>

          {/* Resolution */}
          {dispute.resolution && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-900 mb-2">Resolution</p>
              <p className="text-sm text-green-800">{dispute.resolution}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Timeline</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium text-gray-900">{new Date(dispute.createdDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium text-gray-900">{new Date(dispute.updatedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} />
            Add Message
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
