'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Briefcase, Search, Filter, Edit, Trash2, Eye, MessageSquare, Clock, Users, DollarSign, ChevronDown, MoreVertical } from 'lucide-react';
import Link from 'next/link';

const MOCK_JOBS = [
  {
    id: 1,
    title: 'React Dashboard Development',
    description: 'Build a comprehensive admin dashboard with React and Node.js',
    status: 'active',
    budget: 2500,
    proposals: 12,
    hired: 1,
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '2-3 months'
  },
  {
    id: 2,
    title: 'Mobile App UI Design',
    description: 'Design beautiful UI for iOS and Android mobile app',
    status: 'active',
    budget: 1500,
    proposals: 8,
    hired: 0,
    postedDate: '2024-01-18',
    deadline: '2024-02-18',
    category: 'Design',
    level: 'Beginner',
    duration: '1-2 months'
  },
  {
    id: 3,
    title: 'Backend API Development',
    description: 'Create RESTful API with Node.js and MongoDB',
    status: 'active',
    budget: 5000,
    proposals: 15,
    hired: 2,
    postedDate: '2024-01-10',
    deadline: '2024-03-10',
    category: 'Web Development',
    level: 'Advanced',
    duration: '3-4 months'
  },
  {
    id: 4,
    title: 'WordPress Website Redesign',
    description: 'Redesign existing WordPress website with modern design',
    status: 'completed',
    budget: 1200,
    proposals: 5,
    hired: 1,
    postedDate: '2023-12-20',
    deadline: '2024-01-20',
    category: 'Web Development',
    level: 'Beginner',
    duration: '2-3 weeks'
  },
  {
    id: 5,
    title: 'Logo Design',
    description: 'Create a professional logo for tech startup',
    status: 'closed',
    budget: 800,
    proposals: 20,
    hired: 1,
    postedDate: '2023-12-10',
    deadline: '2024-01-10',
    category: 'Design',
    level: 'Beginner',
    duration: '1-2 weeks'
  }
];

const STATUS_COLORS = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' }
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('list');

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.postedDate) - new Date(a.postedDate);
      if (sortBy === 'budget-high') return b.budget - a.budget;
      if (sortBy === 'budget-low') return a.budget - b.budget;
      if (sortBy === 'proposals') return b.proposals - a.proposals;
      return 0;
    });

  const stats = {
    active: jobs.filter(j => j.status === 'active').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    total: jobs.length
  };

  const handleDeleteJob = (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(j => j.id !== jobId));
    }
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
                <Briefcase className="text-green-600" size={32} />
                My Jobs
              </h1>
              <p className="text-gray-600">Manage all your posted jobs and track proposals</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Total Jobs</p>
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
                <p className="text-gray-600 text-sm mb-2">Closed</p>
                <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
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
                    placeholder="Search jobs..."
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
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="budget-high">Budget: High to Low</option>
                    <option value="budget-low">Budget: Low to High</option>
                    <option value="proposals">Most Proposals</option>
                  </select>

                  <Link href="/post-job">
                    <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                      + Post New Job
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 flex-1">{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_COLORS[job.status].bg} ${STATUS_COLORS[job.status].text}`}>
                            {STATUS_COLORS[job.status].label}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{job.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Briefcase size={16} className="text-gray-400" />
                            {job.category}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={16} className="text-gray-400" />
                            {job.duration}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users size={16} className="text-gray-400" />
                            {job.level}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Budget</p>
                        <p className="text-lg font-bold text-green-600">${job.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Proposals</p>
                        <p className="text-lg font-bold text-gray-900">{job.proposals}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hired</p>
                        <p className="text-lg font-bold text-gray-900">{job.hired}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Posted</p>
                        <p className="text-lg font-bold text-gray-900">{new Date(job.postedDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                        <Eye size={16} />
                        View Proposals
                      </button>
                      {job.status === 'active' && (
                        <>
                          <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="flex-1 md:flex-none px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </>
                      )}
                      <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        Messages
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You haven\'t posted any jobs yet. Start by posting your first job!'}
                </p>
                {!searchQuery && filterStatus === 'all' && (
                  <Link href="/post-job">
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                      Post Your First Job
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
