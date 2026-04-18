'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerHeader from '../../../components/FreelancerHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft, MessageSquare, Eye, Trash2, Clock, CheckCircle,
  XCircle, AlertCircle, Filter, Search, ExternalLink, Star,
  Calendar, DollarSign, Briefcase, User, MapPin, TrendingUp, Flag, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PROPOSALS = [
  {
    _id: '1',
    jobId: '1',
    jobTitle: 'Full Stack Developer Needed for E-commerce Platform',
    clientName: 'TechCorp Inc.',
    clientRating: 4.8,
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp',
    bidAmount: 2500,
    status: 'pending',
    coverLetter: 'I have 5 years of experience in full stack development with React and Node.js. I have successfully completed 15+ similar projects.',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    jobCategory: 'Web Development',
    jobBudget: { min: 1500, max: 3000, type: 'fixed' },
    jobDuration: 'medium',
    skills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    _id: '2',
    jobId: '2',
    jobTitle: 'React Native Mobile App for Food Delivery Startup',
    clientName: 'FoodRush',
    clientRating: 4.5,
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FoodRush',
    bidAmount: 3500,
    status: 'accepted',
    coverLetter: 'Experienced React Native developer with 3 years of mobile app development. I have built 8 production apps.',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    jobCategory: 'Mobile Development',
    jobBudget: { min: 2000, max: 4000, type: 'fixed' },
    jobDuration: 'long',
    skills: ['React Native', 'Firebase', 'Redux'],
  },
  {
    _id: '3',
    jobId: '3',
    jobTitle: 'UI/UX Designer for SaaS Dashboard Redesign',
    clientName: 'DataViz Co.',
    clientRating: 4.2,
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataViz',
    bidAmount: 1800,
    status: 'rejected',
    coverLetter: 'I specialize in SaaS dashboard design with a focus on data visualization.',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    jobCategory: 'Design',
    jobBudget: { min: 25, max: 50, type: 'hourly' },
    jobDuration: 'short',
    skills: ['Figma', 'UI/UX', 'Design Systems'],
  },
  {
    _id: '4',
    jobId: '4',
    jobTitle: 'WordPress Website Development',
    clientName: 'Creative Agency',
    clientRating: 4.9,
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creative',
    bidAmount: 1200,
    status: 'pending',
    coverLetter: 'Expert WordPress developer with 7 years of experience. I can deliver high-quality websites on time.',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    jobCategory: 'Web Development',
    jobBudget: { min: 1000, max: 2000, type: 'fixed' },
    jobDuration: 'short',
    skills: ['WordPress', 'PHP', 'HTML/CSS'],
  },
  {
    _id: '5',
    jobId: '5',
    jobTitle: 'Python Data Analysis Project',
    clientName: 'Analytics Startup',
    clientRating: 4.6,
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Analytics',
    bidAmount: 2000,
    status: 'accepted',
    coverLetter: 'Data scientist with expertise in Python, Pandas, and data visualization. Ready to start immediately.',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    jobCategory: 'Data Science',
    jobBudget: { min: 1500, max: 3000, type: 'fixed' },
    jobDuration: 'medium',
    skills: ['Python', 'Pandas', 'Data Analysis'],
  },
];

const STATUS_CONFIG = {
  pending: { color: 'amber', icon: Clock, label: 'Pending', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
  accepted: { color: 'green', icon: CheckCircle, label: 'Accepted', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
  rejected: { color: 'red', icon: XCircle, label: 'Rejected', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
};

export default function ProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter proposals based on tab and search
  const filteredProposals = proposals.filter(proposal => {
    const matchesTab = activeTab === 'all' || proposal.status === activeTab;
    const matchesSearch = proposal.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Get status counts
  const statusCounts = {
    all: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
  };

  // Handle withdraw proposal
  const handleWithdraw = async (proposalId) => {
    if (!confirm('Are you sure you want to withdraw this proposal?')) return;

    try {
      // API call would go here
      // await api.delete(`/api/proposals/${proposalId}`);
      setProposals(proposals.filter(p => p._id !== proposalId));
      toast.success('Proposal withdrawn successfully');
      setShowDetails(false);
    } catch (error) {
      toast.error('Failed to withdraw proposal');
    }
  };

  // Handle message client
  const handleMessageClient = (proposal) => {
    // Navigate to messages page with client pre-selected
    router.push(`/messages?clientId=${proposal.clientName}`);
  };

  // Handle report issue
  const handleReportIssue = (jobId) => {
    router.push(`/disputes/new?jobId=${jobId}`);
  };

  const tabs = [
    { id: 'all', label: 'All Proposals', count: statusCounts.all },
    { id: 'pending', label: 'Pending', count: statusCounts.pending },
    { id: 'accepted', label: 'Accepted', count: statusCounts.accepted },
    { id: 'rejected', label: 'Rejected', count: statusCounts.rejected },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <FreelancerHeader />
        <Toaster position="top-right" />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">

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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Proposals</h1>
                  <p className="text-gray-600">Track and manage all your job proposals</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{statusCounts.all}</div>
                  <p className="text-sm text-gray-600">Total proposals</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by job title or client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700">
                <Filter size={20} />
                Filter
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
              <div className="flex gap-8 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Proposals List */}
            {filteredProposals.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredProposals.map((proposal, index) => {
                    const statusConfig = STATUS_CONFIG[proposal.status];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <motion.div
                        key={proposal._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            {/* Left Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-4">
                                {/* Client Avatar */}
                                <div className="flex-shrink-0">
                                  <img
                                    src={proposal.clientAvatar}
                                    alt={proposal.clientName}
                                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                                  />
                                </div>

                                {/* Job and Client Info */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                                    {proposal.jobTitle}
                                  </h3>
                                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                                    <div className="flex items-center gap-1">
                                      <User size={14} className="text-gray-400" />
                                      <span className="text-sm text-gray-600">{proposal.clientName}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Star size={14} className="text-yellow-500" fill="currentColor" />
                                      <span className="text-sm font-medium text-gray-700">{proposal.clientRating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar size={14} className="text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {new Date(proposal.submittedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Skills */}
                                  <div className="flex flex-wrap gap-2">
                                    {proposal.skills.slice(0, 3).map(skill => (
                                      <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                        {skill}
                                      </span>
                                    ))}
                                    {proposal.skills.length > 3 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                        +{proposal.skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Content */}
                            <div className="flex-shrink-0 text-right">
                              {/* Bid Amount */}
                              <div className="mb-4">
                                <div className="text-2xl font-bold text-gray-900">
                                  ${proposal.bidAmount}
                                </div>
                                <p className="text-xs text-gray-500">Your bid</p>
                              </div>

                              {/* Status Badge */}
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm ${
                                statusConfig.bgColor
                              } ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                                <StatusIcon size={16} />
                                {statusConfig.label}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                            <button
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowDetails(true);
                              }}
                              className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                            <button
                              onClick={() => handleViewJob(proposal.jobId)}
                              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                              <ExternalLink size={16} />
                              View Job
                            </button>
                            <button
                              onClick={() => handleReportIssue(proposal.jobId)}
                              className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                              title="Report an issue with this job"
                            >
                              <Flag size={16} />
                            </button>
                            {proposal.status === 'pending' && (
                              <button
                                onClick={() => handleWithdraw(proposal._id)}
                                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No proposals found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : activeTab === 'all'
                    ? "You haven't submitted any proposals yet. Start browsing jobs!"
                    : `You don't have any ${activeTab} proposals`}
                </p>
                <button
                  onClick={() => router.push('/browse-jobs')}
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetails && selectedProposal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Proposal Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Job Title */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedProposal.jobTitle}</h3>
                    <p className="text-gray-600">{selectedProposal.jobCategory}</p>
                  </div>

                  {/* Client Info */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <img
                      src={selectedProposal.clientAvatar}
                      alt={selectedProposal.clientName}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{selectedProposal.clientName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                        <span className="text-sm font-medium text-gray-700">{selectedProposal.clientRating}</span>
                        <span className="text-sm text-gray-500">Client Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Bid and Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Your Bid</p>
                      <p className="text-2xl font-bold text-blue-600">${selectedProposal.bidAmount}</p>
                    </div>
                    <div className={`rounded-xl p-4 ${STATUS_CONFIG[selectedProposal.status].bgColor}`}>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className={`text-lg font-bold ${STATUS_CONFIG[selectedProposal.status].textColor}`}>
                        {STATUS_CONFIG[selectedProposal.status].label}
                      </p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Your Cover Letter</h4>
                    <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed">
                      {selectedProposal.coverLetter}
                    </div>
                  </div>

                  {/* Job Details */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Job Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Briefcase size={16} />
                          Duration
                        </span>
                        <span className="font-medium text-gray-900 capitalize">{selectedProposal.jobDuration}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 flex items-center gap-2">
                          <DollarSign size={16} />
                          Budget
                        </span>
                        <span className="font-medium text-gray-900">
                          ${selectedProposal.jobBudget.min} - ${selectedProposal.jobBudget.max}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Calendar size={16} />
                          Submitted
                        </span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedProposal.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProposal.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                  <button
                    onClick={() => handleMessageClient(selectedProposal)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} />
                    Message Client
                  </button>
                  <button
                    onClick={() => handleViewJob(selectedProposal.jobId)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} />
                    View Job
                  </button>
                  <button
                    onClick={() => {
                      handleReportIssue(selectedProposal.jobId);
                      setShowDetails(false);
                    }}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                    title="Report an issue with this job"
                  >
                    <Flag size={18} />
                    Report
                  </button>
                  {selectedProposal.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleWithdraw(selectedProposal._id);
                      }}
                      className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Withdraw
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
