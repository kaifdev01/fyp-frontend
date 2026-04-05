'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import FreelancerHeader from '../../components/FreelancerHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import JobCard from '../../components/jobs/JobCard';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Star, Eye, Calendar, TrendingUp, Edit,
  ExternalLink, RefreshCw, Zap, CheckCircle, AlertCircle, Clock, XCircle
} from 'lucide-react';

const MOCK_JOBS = [
  {
    _id: '1', title: 'Full Stack Developer Needed for E-commerce Platform',
    description: 'We are looking for an experienced full stack developer to build a modern e-commerce platform using React and Node.js. The project involves building product listings, cart, checkout, and admin panel.',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'REST API'],
    budgetType: 'fixed', budgetMin: 1500, budgetMax: 3000,
    duration: 'medium', experienceLevel: 'Intermediate',
    proposalCount: 12, isNew: true, isFeatured: true, isSaved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    client: { name: 'TechCorp Inc.', rating: 4.8, isVerified: true },
  },
  {
    _id: '2', title: 'React Native Mobile App for Food Delivery Startup',
    description: 'Looking for a React Native developer to build a cross-platform food delivery app. Features include real-time tracking, payment integration, and push notifications.',
    skills: ['React Native', 'Firebase', 'Redux', 'Stripe'],
    budgetType: 'fixed', budgetMin: 2000, budgetMax: 4000,
    duration: 'long', experienceLevel: 'Expert',
    proposalCount: 7, isNew: true, isFeatured: false, isSaved: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    client: { name: 'FoodRush', rating: 4.5, isVerified: true },
  },
  {
    _id: '3', title: 'UI/UX Designer for SaaS Dashboard Redesign',
    description: 'We need a talented UI/UX designer to redesign our SaaS analytics dashboard. Must have experience with Figma and data visualization design patterns.',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'],
    budgetType: 'hourly', hourlyMin: 25, hourlyMax: 50,
    duration: 'short', experienceLevel: 'Intermediate',
    proposalCount: 19, isNew: false, isFeatured: false, isSaved: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    client: { name: 'DataViz Co.', rating: 4.2, isVerified: false },
  },
];

export default function FreelancerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setCurrentDateTime(`${dateStr} ${timeStr}`);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/freelancer/dashboard');
      setDashboardData(response.data.data);
      const userData = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const { user, analytics, portfolio, stats } = dashboardData || {};

  const getKYCStatusInfo = () => {
    const kycStatus = user?.kyc?.status;
    const hasSubmittedKYC = user?.kyc?.documentNumber || user?.kyc?.documentImage;

    switch (kycStatus) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          badgeColor: 'bg-green-100 text-green-700',
          title: 'ID Verification Complete',
          message: 'Your identity has been verified',
          action: null,
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          badgeColor: 'bg-red-100 text-red-700',
          title: 'ID Verification Rejected',
          message: user?.kyc?.rejectionReason || 'Your verification was rejected. Please resubmit.',
          action: 'Try Again',
          actionLink: '/verify-identity',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'amber',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          badgeColor: 'bg-amber-100 text-amber-700',
          title: 'ID Verification Pending',
          message: 'Your identity verification is under review',
          action: null,
        };
      default:
        return {
          icon: AlertCircle,
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-700',
          title: 'Complete Your KYC',
          message: 'Verify your identity to unlock all features and build trust with clients',
          action: 'Verify Now',
          actionLink: '/verify-identity',
        };
    }
  };

  const kycInfo = getKYCStatusInfo();
  const IconComponent = kycInfo.icon;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <FreelancerHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats / Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-2">{currentDateTime}</p>
                    <h1 className="text-3xl font-bold mb-2">Good Evening, {user?.name?.split(' ')[0]} {user?.name?.split(' ')[1]?.[0]}.</h1>
                    <p className="text-blue-100">You have {stats?.activeProjects || 0} active projects and {stats?.totalProposals || 0} proposals.</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`text-white ${refreshing ? 'animate-spin' : ''}`} size={20} />
                  </button>
                </div>
              </div>

              {/* AI Credits Banner */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap size={24} className="text-yellow-300" fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">AI Proposal Writer</p>
                      <p className="text-purple-100 text-sm mt-0.5">
                        You have <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded-md">1 free proposal</span> remaining
                      </p>
                      <p className="text-purple-200 text-xs mt-1">Win more jobs with AI-powered proposals</p>
                    </div>
                  </div>
                  <Link
                    href="/ai-proposals"
                    className="bg-white text-purple-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors flex-shrink-0 shadow-md"
                  >
                    Try for Free →
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stats?.totalProposals || 0}</div>
                  <p className="text-sm text-gray-600">Total Proposals</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{stats?.acceptedProposals || 0}</div>
                  <p className="text-sm text-gray-600">Accepted</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600 mb-1">{stats?.pendingProposals || 0}</div>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>

              {/* Recommended Jobs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
                  <Link href="/browse-jobs" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    View all <ExternalLink size={14} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {MOCK_JOBS.map(job => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Enhanced Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* KYC Status Card - Only show if not verified */}
              {user?.kyc?.status !== 'verified' && (
                <div className={`${kycInfo.bgColor} border-2 ${kycInfo.borderColor} rounded-2xl p-6`}>
                  <div className="flex items-start gap-3 mb-4">
                    <IconComponent size={24} className={kycInfo.textColor} />
                    <div className="flex-1">
                      <h3 className={`font-bold ${kycInfo.textColor}`}>{kycInfo.title}</h3>
                      <p className={`text-sm ${kycInfo.textColor} opacity-80 mt-1`}>{kycInfo.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${kycInfo.badgeColor}`}>
                      {user?.kyc?.status ? user.kyc.status.charAt(0).toUpperCase() + user.kyc.status.slice(1) : 'Not Submitted'}
                    </span>
                    {kycInfo.action && (
                      <Link
                        href={kycInfo.actionLink}
                        className={`text-sm font-semibold ${kycInfo.textColor} hover:underline`}
                      >
                        {kycInfo.action} →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="px-6 pb-6">
                  <div className="relative -mt-10 mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-500">{user?.name?.[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                      {user?.kyc?.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          <CheckCircle size={16} fill="transparent" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 font-medium text-sm mb-2">Freelancer</p>
                    {user?.intro && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{user.intro}</p>
                    )}
                    <div className="flex justify-center items-center gap-1 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold text-gray-700">{user?.rating || 0.0}</span>
                      <span className="text-gray-400 text-xs">({user?.completedProjects || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-bold text-blue-600">{analytics?.profileCompletion || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analytics?.profileCompletion || 0}%` }}
                      ></div>
                    </div>
                    {(analytics?.profileCompletion || 0) < 100 && (
                      <p className="text-xs text-gray-500 mt-2">Complete your profile to get more opportunities</p>
                    )}
                  </div>

                  {/* Skills */}
                  {user?.skills?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{user.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Hourly Rate</span>
                      <span className="font-bold text-gray-900">${user?.hourlyRate || 0}/hr</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="font-bold text-gray-900">{user?.location || 'Remote'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Total Earnings</span>
                      <span className="font-bold text-green-600">${user?.totalEarnings || 0}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/edit-profile"
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </Link>

                    <Link
                      href={`/public-profile/${user?.id}`}
                      className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} />
                      View Public Profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* Profile Management Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-blue-600 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Management</h3>

                {/* Profile Views */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Profile Views</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{analytics?.weeklyProfileViews || 0}</span>
                  </div>
                  <p className="text-xs text-gray-500">This week</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Total: {analytics?.profileViews || 0} views</span>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Availability</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${analytics?.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}>
                      {analytics?.isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {analytics?.isAvailable ? 'Ready for new projects' : 'Currently unavailable'}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Link
                    href="/edit-profile"
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">Update Profile</span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </Link>
                  <Link
                    href="/edit-profile#portfolio"
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">Manage Portfolio</span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </Link>
                  <Link
                    href="/availability"
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">Set Availability</span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </Link>
                  <Link
                    href="/freelancer-dashboard/proposals"
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">View My Proposals</span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
