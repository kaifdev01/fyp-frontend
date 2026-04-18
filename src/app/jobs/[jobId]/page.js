'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import FreelancerHeader from '../../../components/FreelancerHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import JobCard from '../../../components/jobs/JobCard';
import api from '../../../lib/api';
import { useSocket } from '../../../lib/useSocket';
import toast from 'react-hot-toast';
import {
  MapPin, Clock, DollarSign, Bookmark, BookmarkCheck,
  Star, Users, Calendar, Briefcase, ChevronLeft,
  CheckCircle, AlertCircle, Globe, Flag, Share2, Zap, RefreshCw, Loader2
} from 'lucide-react';

export default function JobDetail() {
  const { jobId } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [jobDeleted, setJobDeleted] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  // Real-time Socket.IO listener for job deletion
  useEffect(() => {
    if (!socket || !jobId) return;

    const handleJobDeleted = ({ jobId: deletedJobId }) => {
      if (deletedJobId === jobId) {
        console.log('🗑️ Current job was deleted');
        setJobDeleted(true);
        setJob(null);
      }
    };

    const handleJobUpdated = (updatedJob) => {
      if (updatedJob._id === jobId) {
        console.log('📝 Current job was updated');
        setJob(updatedJob);
      }
    };

    socket.on('job:deleted', handleJobDeleted);
    socket.on('job:updated', handleJobUpdated);

    return () => {
      socket.off('job:deleted', handleJobDeleted);
      socket.off('job:updated', handleJobUpdated);
    };
  }, [socket, jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/jobs/${jobId}`);
      setJob(response.data.job);
      
      const userId = localStorage.getItem('userId');
      setSaved(response.data.job.savedBy?.includes(userId));
      
      if (response.data.job.category) {
        const similarResponse = await api.get(`/api/jobs/all?category=${response.data.job.category}&limit=3`);
        setSimilarJobs(similarResponse.data.jobs.filter(j => j._id !== jobId));
      }
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      if (error.response?.status === 404) {
        setJobDeleted(true);
      } else {
        toast.error('Failed to load job details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (jobDeleted) {
      toast.error('This job is no longer available');
      return;
    }
    
    try {
      const response = await api.post(`/api/jobs/${jobId}/save`);
      setSaved(response.data.saved);
      toast.success(response.data.saved ? 'Job saved!' : 'Job unsaved');
    } catch (error) {
      console.error('Failed to save job:', error);
      if (error.response?.status === 404) {
        setJobDeleted(true);
        toast.error('This job is no longer available');
      } else {
        toast.error('Failed to save job');
      }
    }
  };

  const handleReportIssue = () => {
    router.push(`/disputes/new?jobId=${jobId}`);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    
    if (mins < 60) return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
    if (hrs < 24) return `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`;
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <FreelancerHeader />
          <div className="pt-24 pb-16 px-4 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!job || jobDeleted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <FreelancerHeader />
          <div className="pt-16 flex items-center justify-center h-screen">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {jobDeleted ? 'Job No Longer Available' : 'Job Not Found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {jobDeleted 
                  ? 'This job has been removed by the client or is no longer accepting proposals.'
                  : 'The job you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              <Link 
                href="/browse-jobs" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Available Jobs
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <FreelancerHeader />

        <div className="pt-16">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
              <Link href="/browse-jobs" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <ChevronLeft size={16} />
                Browse Jobs
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium line-clamp-1">{job.title}</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-6">

                {/* Job Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{job.category}</span>
                        <span className="text-xs text-gray-400">Posted {timeAgo(job.createdAt)}</span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={handleSaveJob}
                        className={`p-2.5 rounded-xl border transition-colors ${saved ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600'}`}
                      >
                        {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                      </button>
                      <button className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors">
                        <Share2 size={20} />
                      </button>
                      <button className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors">
                        <Flag size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="font-bold text-gray-900">
                        {job.budget?.type === 'fixed'
                          ? `$${job.budget.amount}`
                          : `$${job.budget?.amount}/hr`}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{job.budget?.type} price</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-bold text-gray-900">{job.duration}</p>
                      <p className="text-xs text-gray-400">Project length</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Experience</p>
                      <p className="font-bold text-gray-900 capitalize">{job.experienceLevel}</p>
                      <p className="text-xs text-gray-400">Level needed</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Proposals</p>
                      <p className="font-bold text-gray-900">{job.proposalCount || 0}</p>
                      <p className="text-xs text-gray-400">Submitted</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                    <div
                      className="prose prose-sm max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Job Activity</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl text-center">
                      <Users size={20} className="text-blue-500 mx-auto mb-2" />
                      <p className="font-bold text-gray-900">{job.proposalCount || 0}</p>
                      <p className="text-xs text-gray-500">Proposals</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl text-center">
                      <Globe size={20} className="text-purple-500 mx-auto mb-2" />
                      <p className="font-bold text-gray-900">{job.views || 0}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl text-center">
                      <Clock size={20} className="text-orange-500 mx-auto mb-2" />
                      <p className="font-bold text-gray-900">{timeAgo(job.createdAt)}</p>
                      <p className="text-xs text-gray-500">Posted</p>
                    </div>
                  </div>
                </div>

                {/* Similar Jobs */}
                {similarJobs.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h2>
                    <div className="space-y-4">
                      {similarJobs.map(j => <JobCard key={j._id} job={j} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-24 space-y-5">

                {/* Submit Proposal CTA */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <Link
                    href={`/submit-proposal/${job._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mb-3"
                  >
                    <Briefcase size={18} />
                    Submit Proposal
                  </Link>

                  {/* AI Proposal CTA */}
                  <Link
                    href={`/submit-proposal/${job._id}?ai=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 mb-5"
                  >
                    <Zap size={18} className="text-yellow-300" fill="currentColor" />
                    Write with AI
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">5 credits</span>
                  </Link>

                  {/* Report Issue Button */}
                  <button
                    onClick={handleReportIssue}
                    className="w-full bg-red-50 text-red-600 py-3.5 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-200 flex items-center justify-center gap-2 mb-5"
                  >
                    <Flag size={18} />
                    Report Issue
                  </button>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><DollarSign size={14} /> Budget</span>
                      <span className="font-semibold text-gray-900">${job.budget?.amount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Clock size={14} /> Duration</span>
                      <span className="font-semibold text-gray-900">{job.duration}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Users size={14} /> Experience</span>
                      <span className="font-semibold text-gray-900 capitalize">{job.experienceLevel}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Globe size={14} /> Visibility</span>
                      <span className="font-semibold text-gray-900 capitalize">{job.visibility}</span>
                    </div>
                  </div>
                </div>

                {/* Client Info */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">About the Client</h3>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {job.clientId?.name?.[0] || 'C'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{job.clientId?.name || 'Anonymous Client'}</p>
                      <div className="flex items-center gap-1">
                        {job.clientId?.isVerified && (
                          <span className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
                            <CheckCircle size={12} /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Star size={14} className="text-yellow-400" /> Rating</span>
                      <span className="font-semibold text-gray-900">{job.clientId?.rating || 0} / 5.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><MapPin size={14} /> Location</span>
                      <span className="font-semibold text-gray-900">{job.location || 'Remote'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Briefcase size={14} /> Company</span>
                      <span className="font-semibold text-gray-900">{job.clientId?.companySize || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
