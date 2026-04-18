'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { MessageSquare, Search, Filter, CheckCircle, Clock, XCircle, Star, DollarSign, User, Calendar, Eye, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

const MOCK_PROPOSALS = [
  {
    id: 1,
    freelancerId: 1,
    freelancerName: 'John Developer',
    freelancerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    freelancerRating: 4.8,
    jobId: 1,
    jobTitle: 'React Dashboard Development',
    bidAmount: 2200,
    coverLetter: 'I have 5+ years of experience with React and Node.js. I can deliver this project in 3 weeks.',
    status: 'pending',
    submittedDate: '2024-01-20',
    estimatedDuration: '3 weeks',
    experience: '5+ years'
  },
  {
    id: 2,
    freelancerId: 2,
    freelancerName: 'Sarah Designer',
    freelancerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    freelancerRating: 4.9,
    jobId: 2,
    jobTitle: 'Mobile App UI Design',
    bidAmount: 1400,
    coverLetter: 'I specialize in mobile UI design with Figma. I can create stunning designs for your app.',
    status: 'pending',
    submittedDate: '2024-01-21',
    estimatedDuration: '2 weeks',
    experience: '6+ years'
  },
  {
    id: 3,
    freelancerId: 3,
    freelancerName: 'Mike Backend',
    freelancerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    freelancerRating: 4.7,
    jobId: 3,
    jobTitle: 'Backend API Development',
    bidAmount: 4800,
    coverLetter: 'Expert in building scalable APIs with Node.js and MongoDB. Ready to start immediately.',
    status: 'accepted',
    submittedDate: '2024-01-19',
    estimatedDuration: '4 weeks',
    experience: '7+ years'
  },
  {
    id: 4,
    freelancerId: 4,
    freelancerName: 'Emma Mobile',
    freelancerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    freelancerRating: 4.6,
    jobId: 1,
    jobTitle: 'React Dashboard Development',
    bidAmount: 2500,
    coverLetter: 'I can build a responsive dashboard with React. Let me know if you need any clarifications.',
    status: 'rejected',
    submittedDate: '2024-01-20',
    estimatedDuration: '3 weeks',
    experience: '4+ years'
  },
  {
    id: 5,
    freelancerId: 5,
    freelancerName: 'Alex Marketer',
    freelancerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    freelancerRating: 4.5,
    jobId: 2,
    jobTitle: 'Mobile App UI Design',
    bidAmount: 1200,
    coverLetter: 'Great design skills and quick turnaround. I can deliver within your timeline.',
    status: 'pending',
    submittedDate: '2024-01-22',
    estimatedDuration: '2 weeks',
    experience: '3+ years'
  },
  {
    id: 6,
    freelancerId: 6,
    freelancerName: 'Lisa Writer',
    freelancerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    freelancerRating: 4.8,
    jobId: 3,
    jobTitle: 'Backend API Development',
    bidAmount: 5000,
    coverLetter: 'Experienced backend developer with expertise in scalable systems. Perfect fit for this project.',
    status: 'accepted',
    submittedDate: '2024-01-18',
    estimatedDuration: '4 weeks',
    experience: '8+ years'
  }
];

const STATUS_CONFIG = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
  accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted', icon: CheckCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle }
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedProposal, setSelectedProposal] = useState(null);

  const filteredProposals = proposals
    .filter(proposal => {
      const matchesSearch = proposal.freelancerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.submittedDate) - new Date(a.submittedDate);
      if (sortBy === 'bid-high') return b.bidAmount - a.bidAmount;
      if (sortBy === 'bid-low') return a.bidAmount - b.bidAmount;
      if (sortBy === 'rating') return b.freelancerRating - a.freelancerRating;
      return 0;
    });

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length
  };

  const handleAcceptProposal = (proposalId) => {
    setProposals(proposals.map(p =>
      p.id === proposalId ? { ...p, status: 'accepted' } : p
    ));
    setSelectedProposal(null);
  };

  const handleRejectProposal = (proposalId) => {
    setProposals(proposals.map(p =>
      p.id === proposalId ? { ...p, status: 'rejected' } : p
    ));
    setSelectedProposal(null);
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
                <MessageSquare className="text-green-600" size={32} />
                Proposals Received
              </h1>
              <p className="text-gray-600">Review and manage all proposals from freelancers</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Total Proposals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Accepted</p>
                <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
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
                    placeholder="Search by freelancer or job..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="bid-high">Bid: High to Low</option>
                    <option value="bid-low">Bid: Low to High</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Proposals List */}
            {filteredProposals.length > 0 ? (
              <div className="space-y-4">
                {filteredProposals.map((proposal) => {
                  const StatusIcon = STATUS_CONFIG[proposal.status].icon;
                  return (
                    <div
                      key={proposal.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                        {/* Freelancer Info */}
                        <div className="flex gap-4 flex-1">
                          <img
                            src={proposal.freelancerAvatar}
                            alt={proposal.freelancerName}
                            className="w-16 h-16 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{proposal.freelancerName}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_CONFIG[proposal.status].bg} ${STATUS_CONFIG[proposal.status].text}`}>
                                {STATUS_CONFIG[proposal.status].label}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{proposal.jobTitle}</p>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{proposal.coverLetter}</p>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Star size={16} className="text-yellow-500" fill="currentColor" />
                                <span className="font-semibold">{proposal.freelancerRating}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar size={16} className="text-gray-400" />
                                {new Date(proposal.submittedDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock size={16} className="text-gray-400" />
                                {proposal.estimatedDuration}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bid and Actions */}
                        <div className="flex flex-col items-end gap-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                            <p className="text-2xl font-bold text-green-600">${proposal.bidAmount.toLocaleString()}</p>
                          </div>

                          <div className="flex gap-2">
                            {proposal.status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcceptProposal(proposal.id);
                                  }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectProposal(proposal.id);
                                  }}
                                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2">
                              <MessageSquare size={16} />
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No proposals found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You haven\'t received any proposals yet. Post a job to get started!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Proposal Detail Modal */}
        {selectedProposal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Proposal Details</h2>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">

                {/* Freelancer Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <img
                    src={selectedProposal.freelancerAvatar}
                    alt={selectedProposal.freelancerName}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedProposal.freelancerName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={16} className="text-yellow-500" fill="currentColor" />
                      <span className="font-semibold text-gray-900">{selectedProposal.freelancerRating}</span>
                      <span className="text-gray-500 text-sm">({selectedProposal.freelancerRating * 10} reviews)</span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_CONFIG[selectedProposal.status].bg} ${STATUS_CONFIG[selectedProposal.status].text}`}>
                    {STATUS_CONFIG[selectedProposal.status].label}
                  </span>
                </div>

                {/* Job Info */}
                <div className="pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Job</h4>
                  <p className="text-gray-600">{selectedProposal.jobTitle}</p>
                </div>

                {/* Bid Details */}
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                    <p className="text-2xl font-bold text-green-600">${selectedProposal.bidAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Estimated Duration</p>
                    <p className="text-lg font-bold text-gray-900">{selectedProposal.estimatedDuration}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Experience</p>
                    <p className="text-lg font-bold text-gray-900">{selectedProposal.experience}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(selectedProposal.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Cover Letter</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedProposal.coverLetter}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedProposal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleAcceptProposal(selectedProposal.id);
                        }}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                      >
                        Accept Proposal
                      </button>
                      <button
                        onClick={() => {
                          handleRejectProposal(selectedProposal.id);
                        }}
                        className="flex-1 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold"
                      >
                        Reject Proposal
                      </button>
                    </>
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
