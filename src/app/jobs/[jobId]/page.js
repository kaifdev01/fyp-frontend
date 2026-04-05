'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import FreelancerHeader from '../../../components/FreelancerHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import JobCard from '../../../components/jobs/JobCard';
import {
  MapPin, Clock, DollarSign, Bookmark, BookmarkCheck,
  Star, Users, Calendar, Briefcase, ChevronLeft,
  CheckCircle, AlertCircle, Globe, Flag, Share2, Zap
} from 'lucide-react';

const MOCK_JOB = {
  _id: '1',
  title: 'Full Stack Developer Needed for E-commerce Platform',
  description: `We are looking for an experienced full stack developer to build a modern e-commerce platform from scratch using React and Node.js.

**Project Overview:**
The platform will serve as a marketplace for local artisans to sell handmade products. We need someone who can handle both frontend and backend development with a strong eye for UI/UX.

**Key Responsibilities:**
- Build responsive product listing and detail pages
- Implement shopping cart and checkout flow with Stripe integration
- Develop admin panel for product and order management
- Set up user authentication (JWT + OAuth)
- Integrate with shipping APIs (FedEx/UPS)
- Optimize for performance and SEO

**Technical Requirements:**
- React 18+ with Next.js
- Node.js with Express or NestJS
- MongoDB or PostgreSQL
- Redis for caching
- AWS S3 for media storage
- Docker for containerization

**Nice to Have:**
- Experience with Shopify or similar platforms
- Knowledge of PWA development
- Previous e-commerce projects in portfolio`,
  skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'REST API', 'Next.js', 'AWS', 'Docker'],
  budgetType: 'fixed',
  budgetMin: 1500,
  budgetMax: 3000,
  duration: 'medium',
  experienceLevel: 'Intermediate',
  category: 'Web Development',
  proposalCount: 12,
  isNew: true,
  isFeatured: true,
  isSaved: false,
  visibility: 'public',
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  client: {
    name: 'TechCorp Inc.',
    rating: 4.8,
    isVerified: true,
    location: 'New York, USA',
    memberSince: 'Jan 2022',
    totalJobsPosted: 24,
    hireRate: 78,
    totalSpent: '$12,400',
    activeContracts: 3,
    avatar: null,
  },
  activity: {
    proposals: 12,
    interviewing: 3,
    invitesSent: 5,
    lastViewed: '5 mins ago',
  },
};

const SIMILAR_JOBS = [
  {
    _id: '3', title: 'React Developer for SaaS Dashboard',
    description: 'Looking for a React developer to build a modern SaaS analytics dashboard with charts and real-time data.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    budgetType: 'fixed', budgetMin: 800, budgetMax: 1500,
    duration: 'short', experienceLevel: 'Intermediate',
    proposalCount: 8, isNew: false, isFeatured: false, isSaved: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    client: { name: 'StartupXYZ', rating: 4.3, isVerified: true },
  },
  {
    _id: '4', title: 'Node.js Backend Developer for API Development',
    description: 'Need an experienced Node.js developer to build RESTful APIs for our mobile application.',
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    budgetType: 'hourly', hourlyMin: 30, hourlyMax: 60,
    duration: 'medium', experienceLevel: 'Expert',
    proposalCount: 5, isNew: true, isFeatured: false, isSaved: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    client: { name: 'MobileFirst Co.', rating: 4.9, isVerified: true },
  },
];

const formatDescription = (text) => {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-bold text-gray-900 mt-5 mb-2">{line.replace(/\*\*/g, '')}</p>;
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="ml-4 text-gray-700">{line.slice(2)}</li>;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="text-gray-700">{line}</p>;
  });
};

export default function JobDetail() {
  const { jobId } = useParams();
  const router = useRouter();
  const [saved, setSaved] = useState(MOCK_JOB.isSaved);
  const job = MOCK_JOB;

  const handleReportIssue = () => {
    router.push(`/disputes/new?jobId=${job._id}`);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  };

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
                        {job.isNew && <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">New</span>}
                        {job.isFeatured && <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">⭐ Featured</span>}
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{job.category}</span>
                        <span className="text-xs text-gray-400">Posted {timeAgo(job.createdAt)}</span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSaved(!saved)}
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
                        {job.budgetType === 'fixed'
                          ? `$${job.budgetMin} - $${job.budgetMax}`
                          : `$${job.hourlyMin} - $${job.hourlyMax}/hr`}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{job.budgetType} price</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-bold text-gray-900">
                        {job.duration === 'short' ? '< 1 month' : job.duration === 'medium' ? '1-3 months' : '3+ months'}
                      </p>
                      <p className="text-xs text-gray-400">Project length</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Experience</p>
                      <p className="font-bold text-gray-900">{job.experienceLevel}</p>
                      <p className="text-xs text-gray-400">Level needed</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Proposals</p>
                      <p className="font-bold text-gray-900">{job.proposalCount}</p>
                      <p className="text-xs text-gray-400">Submitted</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                    <div className="prose prose-sm max-w-none leading-relaxed space-y-1">
                      {formatDescription(job.description)}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Job Activity</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Proposals', value: job.activity.proposals, icon: Users, color: 'blue' },
                      { label: 'Interviewing', value: job.activity.interviewing, icon: CheckCircle, color: 'green' },
                      { label: 'Invites Sent', value: job.activity.invitesSent, icon: Globe, color: 'purple' },
                      { label: 'Last Viewed', value: job.activity.lastViewed, icon: Clock, color: 'orange' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className={`p-4 bg-${color}-50 rounded-xl text-center`}>
                        <Icon size={20} className={`text-${color}-500 mx-auto mb-2`} />
                        <p className="font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Similar Jobs */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h2>
                  <div className="space-y-4">
                    {SIMILAR_JOBS.map(j => <JobCard key={j._id} job={j} />)}
                  </div>
                </div>
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

                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5">
                    <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      You have <span className="font-bold">1 free proposal</span> remaining. Submitting uses 5 credits.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><DollarSign size={14} /> Budget</span>
                      <span className="font-semibold text-gray-900">${job.budgetMin} – ${job.budgetMax}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Clock size={14} /> Duration</span>
                      <span className="font-semibold text-gray-900">1–3 months</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Users size={14} /> Experience</span>
                      <span className="font-semibold text-gray-900">{job.experienceLevel}</span>
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
                      {job.client.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{job.client.name}</p>
                      <div className="flex items-center gap-1">
                        {job.client.isVerified && (
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
                      <span className="font-semibold text-gray-900">{job.client.rating} / 5.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Briefcase size={14} /> Jobs Posted</span>
                      <span className="font-semibold text-gray-900">{job.client.totalJobsPosted}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><CheckCircle size={14} /> Hire Rate</span>
                      <span className="font-semibold text-gray-900">{job.client.hireRate}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><DollarSign size={14} /> Total Spent</span>
                      <span className="font-semibold text-gray-900">{job.client.totalSpent}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><MapPin size={14} /> Location</span>
                      <span className="font-semibold text-gray-900">{job.client.location}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={14} /> Member Since</span>
                      <span className="font-semibold text-gray-900">{job.client.memberSince}</span>
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
