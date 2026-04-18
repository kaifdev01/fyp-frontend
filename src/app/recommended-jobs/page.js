'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerHeader from '../../components/FreelancerHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import JobCard from '../../components/jobs/JobCard';
import api from '../../lib/api';
import { useSocket } from '../../lib/useSocket';
import { Sparkles, RefreshCw, TrendingUp, Target, Zap, Briefcase, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecommendedJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended'); // recommended, best-match, all

  const socket = useSocket();

  const fetchRecommendedJobs = async (showToast = false) => {
    try {
      setRefreshing(true);
      const response = await api.get('/api/jobs/recommended/for-me');
      setJobs(response.data.jobs);
      if (showToast) {
        toast.success('Recommendations refreshed!');
      }
    } catch (error) {
      console.error('Failed to fetch recommended jobs:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const response = await api.get('/api/jobs/all?limit=20');
      setAllJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch all jobs:', error);
    }
  };

  useEffect(() => {
    fetchRecommendedJobs();
    fetchAllJobs();
  }, []);

  // Real-time Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewJob = (newJob) => {
      console.log('📢 New job received in recommended:', newJob);
      setAllJobs(prevJobs => [newJob, ...prevJobs]);
    };

    const handleJobUpdated = (updatedJob) => {
      setJobs(prevJobs => 
        prevJobs.map(job => job._id === updatedJob._id ? updatedJob : job)
      );
      setAllJobs(prevJobs => 
        prevJobs.map(job => job._id === updatedJob._id ? updatedJob : job)
      );
    };

    const handleJobDeleted = ({ jobId }) => {
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      setAllJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    };

    socket.on('job:created', handleNewJob);
    socket.on('job:updated', handleJobUpdated);
    socket.on('job:deleted', handleJobDeleted);

    return () => {
      socket.off('job:created', handleNewJob);
      socket.off('job:updated', handleJobUpdated);
      socket.off('job:deleted', handleJobDeleted);
    };
  }, [socket]);

  const bestMatchJobs = jobs.filter(j => j.matchScore >= 75);
  const displayJobs = activeTab === 'recommended' ? jobs : activeTab === 'best-match' ? bestMatchJobs : allJobs;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <FreelancerHeader />

        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Simple Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={24} className="text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">AI-Powered Job Recommendations</h1>
              </div>
              <p className="text-gray-600">Jobs matched to your skills and experience</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('recommended')}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'recommended'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  For You ({jobs.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('best-match')}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'best-match'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  Best Match ({bestMatchJobs.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'all'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase size={16} />
                  All Jobs ({allJobs.length})
                </div>
              </button>
              <div className="flex-1"></div>
              <button
                onClick={() => fetchRecommendedJobs(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={48} />
              </div>
            ) : displayJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                <Sparkles size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activeTab === 'best-match' ? 'No best matches yet' : 'No recommendations yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  Complete your profile with skills and experience to get personalized job recommendations
                </p>
                <button
                  onClick={() => router.push('/edit-profile')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Complete Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayJobs.map(job => (
                  <div key={job._id} className="relative">
                    {job.matchScore && activeTab !== 'all' && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                          job.matchScore >= 90 ? 'bg-green-500 text-white' :
                          job.matchScore >= 75 ? 'bg-blue-500 text-white' :
                          job.matchScore >= 60 ? 'bg-yellow-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {job.matchScore}% Match
                        </div>
                      </div>
                    )}
                    <JobCard job={job} showMatchScore={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
