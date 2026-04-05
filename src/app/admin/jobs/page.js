'use client';
import { useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import { Briefcase, Search, Filter, Eye, CheckCircle, AlertCircle, X, Clock, DollarSign, User, Calendar, Tag, TrendingUp, Flag } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: 1,
    title: 'React Dashboard Development',
    client: 'TechCorp Inc.',
    category: 'Web Development',
    budget: 2500,
    status: 'active',
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    proposals: 12,
    acceptedProposal: 'John Developer',
    description: 'Build a responsive admin dashboard with React and Tailwind CSS',
    skills: ['React', 'Tailwind CSS', 'JavaScript'],
    level: 'intermediate',
    duration: '4 weeks',
    disputes: 0,
    completion: 45
  },
  {
    id: 2,
    title: 'Backend API Development',
    client: 'TechCorp Inc.',
    category: 'Backend Development',
    budget: 5000,
    status: 'active',
    postedDate: '2024-01-10',
    deadline: '2024-03-10',
    proposals: 8,
    acceptedProposal: 'Mike Backend',
    description: 'Develop RESTful API with Node.js and MongoDB',
    skills: ['Node.js', 'MongoDB', 'Express'],
    level: 'advanced',
    duration: '6 weeks',
    disputes: 0,
    completion: 30
  },
  {
    id: 3,
    title: 'Mobile App UI Design',
    client: 'FoodRush',
    category: 'UI/UX Design',
    budget: 1500,
    status: 'active',
    postedDate: '2024-01-18',
    deadline: '2024-02-18',
    proposals: 15,
    acceptedProposal: 'Sarah Designer',
    description: 'Design mobile app UI for food delivery platform',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    level: 'intermediate',
    duration: '3 weeks',
    disputes: 0,
    completion: 60
  },
  {
    id: 4,
    title: 'Logo Design',
    client: 'Creative Agency',
    category: 'Graphic Design',
    budget: 800,
    status: 'completed',
    postedDate: '2024-01-15',
    deadline: '2024-01-20',
    proposals: 22,
    acceptedProposal: 'Emma Designer',
    description: 'Create modern logo for tech startup',
    skills: ['Adobe Suite', 'Branding', 'Logo Design'],
    level: 'beginner',
    duration: '1 week',
    disputes: 0,
    completion: 100
  },
  {
    id: 5,
    title: 'WordPress Website Redesign',
    client: 'TechCorp Inc.',
    category: 'Web Development',
    budget: 1200,
    status: 'disputed',
    postedDate: '2023-12-20',
    deadline: '2024-01-20',
    proposals: 5,
    acceptedProposal: 'David Developer',
    description: 'Redesign existing WordPress website',
    skills: ['WordPress', 'PHP', 'CSS'],
    level: 'beginner',
    duration: '2 weeks',
    disputes: 1,
    completion: 70,
    disputeReason: 'Quality issues with implementation'
  },
  {
    id: 6,
    title: 'Content Writing - Blog Posts',
    client: 'DataViz Co.',
    category: 'Content Writing',
    budget: 600,
    status: 'open',
    postedDate: '2024-01-08',
    deadline: '2024-01-15',
    proposals: 3,
    acceptedProposal: null,
    description: 'Write 5 blog posts about data visualization',
    skills: ['Content Writing', 'SEO', 'Research'],
    level: 'beginner',
    duration: '2 weeks',
    disputes: 0,
    completion: 0
  },
  {
    id: 7,
    title: 'Python Web Scraper',
    client: 'TechCorp Inc.',
    category: 'Backend Development',
    budget: 1800,
    status: 'active',
    postedDate: '2024-01-12',
    deadline: '2024-02-12',
    proposals: 7,
    acceptedProposal: 'David Developer',
    description: 'Build web scraper for e-commerce data',
    skills: ['Python', 'Web Scraping', 'BeautifulSoup'],
    level: 'intermediate',
    duration: '3 weeks',
    disputes: 0,
    completion: 25
  },
  {
    id: 8,
    title: 'Mobile App Development - iOS',
    client: 'FoodRush',
    category: 'Mobile Development',
    budget: 8000,
    status: 'active',
    postedDate: '2024-01-05',
    deadline: '2024-04-05',
    proposals: 4,
    acceptedProposal: 'John Developer',
    description: 'Develop iOS app for food delivery platform',
    skills: ['Swift', 'iOS Development', 'Firebase'],
    level: 'advanced',
    duration: '12 weeks',
    disputes: 0,
    completion: 15
  }
];

const STATUS_COLORS = {
  open: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open', icon: Clock },
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active', icon: CheckCircle },
  completed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Completed', icon: CheckCircle },
  disputed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Disputed', icon: AlertCircle }
};

const LEVEL_COLORS = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700'
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || j.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || j.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(jobs.map(j => j.category))];

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    active: jobs.filter(j => j.status === 'active').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    disputed: jobs.filter(j => j.status === 'disputed').length,
    totalBudget: jobs.reduce((sum, j) => sum + j.budget, 0)
  };

  const handleApproveJob = (jobId) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'active' } : j));
    setShowDetails(false);
  };

  const handleRejectJob = (jobId) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'rejected' } : j));
    setShowDetails(false);
  };

  const handleResolveDispute = (jobId) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'active', disputes: 0, disputeReason: null } : j));
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <AdminHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Briefcase className="text-blue-600" size={32} />
              Jobs Management
            </h1>
            <p className="text-gray-600">Monitor jobs, manage disputes, and track completion</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Open</p>
              <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Completed</p>
              <p className="text-3xl font-bold text-purple-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Disputed</p>
              <p className="text-3xl font-bold text-red-600">{stats.disputed}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Budget</p>
              <p className="text-3xl font-bold text-purple-600">${(stats.totalBudget / 1000).toFixed(1)}K</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by job title or client..."
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
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="disputed">Disputed</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Job Title</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Budget</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Progress</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const StatusIcon = STATUS_COLORS[job.status].icon;
                    return (
                      <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-gray-900">{job.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{job.category}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-900">{job.client}</td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">${job.budget.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status].bg} ${STATUS_COLORS[job.status].text}`}>
                            <StatusIcon size={14} />
                            {STATUS_COLORS[job.status].label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${job.completion}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-600">{job.completion}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
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

      {/* Job Details Modal */}
      {showDetails && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setShowDetails(false)}
          onApprove={() => handleApproveJob(selectedJob.id)}
          onReject={() => handleRejectJob(selectedJob.id)}
          onResolveDispute={() => handleResolveDispute(selectedJob.id)}
        />
      )}
    </div>
  );
}

function JobDetailsModal({ job, onClose, onApprove, onReject, onResolveDispute }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4 sm:my-8">
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{job.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Client</p>
              <p className="font-bold text-gray-900 flex items-center gap-2">
                <User size={16} />
                {job.client}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Budget</p>
              <p className="text-2xl font-bold text-blue-600">${job.budget.toLocaleString()}</p>
            </div>
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${STATUS_COLORS[job.status].bg} ${STATUS_COLORS[job.status].text}`}>
                {STATUS_COLORS[job.status].label}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Category</p>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700">
                <Tag size={14} />
                {job.category}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Level</p>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${LEVEL_COLORS[job.level]}`}>
                {job.level.charAt(0).toUpperCase() + job.level.slice(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Description</p>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                <Calendar size={14} />
                Posted Date
              </p>
              <p className="font-semibold text-gray-900">{new Date(job.postedDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                <Clock size={14} />
                Deadline
              </p>
              <p className="font-semibold text-gray-900">{new Date(job.deadline).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                <TrendingUp size={14} />
                Duration
              </p>
              <p className="font-semibold text-gray-900">{job.duration}</p>
            </div>
          </div>

          {/* Proposals & Freelancer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-1">Proposals Received</p>
              <p className="text-2xl font-bold text-blue-900">{job.proposals}</p>
            </div>
            {job.acceptedProposal && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900 mb-1">Accepted Freelancer</p>
                <p className="text-lg font-bold text-green-900">{job.acceptedProposal}</p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Completion Progress</p>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${job.completion}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{job.completion}% Complete</p>
            </div>
          </div>

          {/* Dispute Info */}
          {job.disputes > 0 && job.disputeReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Flag className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-red-900 mb-1">Active Dispute</p>
                  <p className="text-sm text-red-800">{job.disputeReason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 space-y-3">
          {job.status === 'open' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onApprove}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Approve Job
              </button>
              <button
                onClick={onReject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                <X size={18} />
                Reject Job
              </button>
            </div>
          )}

          {job.status === 'disputed' && (
            <button
              onClick={onResolveDispute}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Resolve Dispute
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
