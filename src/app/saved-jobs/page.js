'use client';
import { useState, useEffect } from 'react';
import FreelancerHeader from '../../components/FreelancerHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import JobCard from '../../components/jobs/JobCard';
import { Bookmark, Search, Filter, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Design & Creative',
  'Writing & Translation', 'Marketing & Sales', 'Admin & Customer Support',
  'Data Science & Analytics', 'Engineering & Architecture', 'Legal',
  'Accounting & Finance', 'Other'
];

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/api/jobs/saved/my-saved');
      setJobs(response.data.jobs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setJobs(jobs.filter(j => j._id !== jobId));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || job.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <FreelancerHeader />
          <div className="pt-24 pb-16 px-4 flex items-center justify-center">
            <Loader2 className="animate-spin text-green-600" size={48} />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <FreelancerHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Bookmark className="text-green-600" size={32} />
                Saved Jobs
              </h1>
              <p className="text-gray-600">Jobs you've saved for later ({jobs.length})</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full lg:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search saved jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} onUnsave={handleUnsave} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Bookmark size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No saved jobs</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterCategory !== 'all'
                    ? 'No jobs match your filters'
                    : 'Start saving jobs to view them here later'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
