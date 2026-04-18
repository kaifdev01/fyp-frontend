'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Briefcase, Search, Edit, Trash2, Eye, MessageSquare, Clock, Users, X, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { notificationEvents } from '../../../lib/notificationEvents';
import { useSocket } from '../../../lib/useSocket';
import api from '../../../lib/api';

const STATUS_COLORS = {
  open: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
  completed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' },
};

const getStatusColor = (status) => STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status || 'Unknown' };

const DURATION_LABELS = {
  'less-than-week': 'Less than a week',
  '1-2-weeks': '1-2 weeks',
  '2-4-weeks': '2-4 weeks',
  '1-3-months': '1-3 months',
  '3-6-months': '3-6 months',
  'more-than-6-months': 'More than 6 months'
};

function JobPreviewModal({ job, onClose }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Job Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(job.status).bg} ${getStatusColor(job.status).text}`}>
              {getStatusColor(job.status).label}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Budget</p>
              <p className="font-bold text-green-600">${job.budget.amount.toLocaleString()}{job.budget.type === 'hourly' ? '/hr' : ''}</p>
              <p className="text-xs text-gray-400 capitalize">{job.budget.type}</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="font-bold text-gray-900 text-sm">{DURATION_LABELS[job.duration] || job.duration}</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Experience</p>
              <p className="font-bold text-gray-900 capitalize">{job.experienceLevel}</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Proposals</p>
              <p className="font-bold text-gray-900">{job.proposalCount || 0}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{job.category}</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Description</p>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>

          {job.skills?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
            <Calendar size={14} />
            Posted on {new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [previewJob, setPreviewJob] = useState(null);

  const socket = useSocket();

  useEffect(() => { fetchMyJobs(); }, []);

  // Real-time Socket.IO listener for job updates
  useEffect(() => {
    if (!socket) return;

    const handleJobUpdated = (updatedJob) => {
      console.log('📢 Job updated:', updatedJob);
      setJobs(prevJobs => 
        prevJobs.map(job => job._id === updatedJob._id ? updatedJob : job)
      );
      if (previewJob && previewJob._id === updatedJob._id) {
        setPreviewJob(updatedJob);
      }
    };

    const handleJobDeleted = ({ jobId }) => {
      console.log('🗑️ Job deleted:', jobId);
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      if (previewJob && previewJob._id === jobId) {
        setPreviewJob(null);
      }
    };

    socket.on('job:updated', handleJobUpdated);
    socket.on('job:deleted', handleJobDeleted);

    return () => {
      socket.off('job:updated', handleJobUpdated);
      socket.off('job:deleted', handleJobDeleted);
    };
  }, [socket, previewJob]);

  const fetchMyJobs = async () => {
    try {
      const response = await api.get('/api/jobs/client/my-jobs');
      setJobs(response.data.jobs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;
    try {
      await api.delete(`/api/jobs/${jobId}`);
      toast.success(`"${jobTitle}" has been deleted.`);
      notificationEvents.refresh();
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'budget-high') return b.budget.amount - a.budget.amount;
      if (sortBy === 'budget-low') return a.budget.amount - b.budget.amount;
      if (sortBy === 'proposals') return (b.proposalCount || 0) - (a.proposalCount || 0);
      return 0;
    });

  const stats = {
    active: jobs.filter(j => j.status === 'open').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    closed: jobs.filter(j => j.status === 'closed' || j.status === 'cancelled').length,
    total: jobs.length
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
          <ClientHeader />
          <div className="pt-24 pb-16 px-4 flex items-center justify-center">
            <Loader2 className="animate-spin text-green-600" size={48} />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <ClientHeader />
        {previewJob && <JobPreviewModal job={previewJob} onClose={() => setPreviewJob(null)} />}

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Briefcase className="text-green-600" size={32} />
                My Jobs
              </h1>
              <p className="text-gray-600">Manage all your posted jobs and track proposals</p>
            </div>

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

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative w-full lg:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="Search jobs..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium">
                    <option value="all">All Status</option>
                    <option value="open">Active</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium">
                    <option value="recent">Most Recent</option>
                    <option value="budget-high">Budget: High to Low</option>
                    <option value="budget-low">Budget: Low to High</option>
                    <option value="proposals">Most Proposals</option>
                  </select>
                  <Link href="/post-job">
                    <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">+ Post New Job</button>
                  </Link>
                </div>
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(job.status).bg} ${getStatusColor(job.status).text}`}>
                        {getStatusColor(job.status).label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1"><Briefcase size={14} className="text-gray-400" />{job.category}</div>
                      <div className="flex items-center gap-1"><Clock size={14} className="text-gray-400" />{DURATION_LABELS[job.duration] || job.duration}</div>
                      <div className="flex items-center gap-1"><Users size={14} className="text-gray-400" />{job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Budget</p>
                        <p className="text-lg font-bold text-green-600">${job.budget.amount.toLocaleString()}{job.budget.type === 'hourly' ? '/hr' : ''}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Proposals</p>
                        <p className="text-lg font-bold text-gray-900">{job.proposalCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hired</p>
                        <p className="text-lg font-bold text-gray-900">{job.hiredCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Posted</p>
                        <p className="text-lg font-bold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setPreviewJob(job)}
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm flex items-center gap-2">
                        <Eye size={16} /> Preview
                      </button>
                      <Link href={`/edit-job/${job._id}`}>
                        <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2">
                          <Edit size={16} /> Edit
                        </button>
                      </Link>
                      <Link href={`/client-dashboard/proposals?jobId=${job._id}`}>
                        <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2">
                          <MessageSquare size={16} /> Proposals ({job.proposalCount || 0})
                        </button>
                      </Link>
                      <button onClick={() => handleDeleteJob(job._id, job.title)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm flex items-center gap-2">
                        <Trash2 size={16} /> Delete
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
                  {searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters' : "You haven't posted any jobs yet."}
                </p>
                {!searchQuery && filterStatus === 'all' && (
                  <Link href="/post-job">
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">Post Your First Job</button>
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
