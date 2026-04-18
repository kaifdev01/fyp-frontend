'use client';
import { useState, useEffect, useCallback } from 'react';
import FreelancerHeader from '../../components/FreelancerHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import JobCard from '../../components/jobs/JobCard';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useSocket } from '../../lib/useSocket';
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp,
  Briefcase, RefreshCw, Loader2
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'Design & Creative',
  'Writing & Translation',
  'Marketing & Sales',
  'Admin & Customer Support',
  'Data Science & Analytics',
  'Engineering & Architecture',
  'Legal',
  'Accounting & Finance',
  'Other'
];

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
    category: 'Web Development',
  },
  {
    _id: '2', title: 'React Native Mobile App for Food Delivery Startup',
    description: 'Looking for a React Native developer to build a cross-platform food delivery app. Features include real-time tracking, payment integration, and push notifications.',
    skills: ['React Native', 'Firebase', 'Redux', 'Stripe'],
    budgetType: 'fixed', budgetMin: 2000, budgetMax: 4000,
    duration: 'long', experienceLevel: 'Expert',
    proposalCount: 7, isNew: true, isFeatured: false, isSaved: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    client: { name: 'FoodRush', rating: 4.5, isVerified: true },
    category: 'Mobile Development',
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
    category: 'UI/UX Design',
  },
  {
    _id: '4', title: 'Python Developer for Machine Learning Model Integration',
    description: 'Seeking a Python developer with ML experience to integrate a trained model into our existing Flask API. Knowledge of scikit-learn and TensorFlow required.',
    skills: ['Python', 'Machine Learning', 'Flask', 'TensorFlow', 'scikit-learn'],
    budgetType: 'fixed', budgetMin: 800, budgetMax: 1500,
    duration: 'short', experienceLevel: 'Expert',
    proposalCount: 5, isNew: false, isFeatured: true, isSaved: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    client: { name: 'AI Ventures', rating: 5.0, isVerified: true },
    category: 'AI & Machine Learning',
  },
  {
    _id: '5', title: 'WordPress Website for Local Restaurant',
    description: 'Need a simple WordPress website for a local restaurant. Should include menu, gallery, contact form, and online reservation system.',
    skills: ['WordPress', 'PHP', 'CSS', 'WooCommerce'],
    budgetType: 'fixed', budgetMin: 300, budgetMax: 600,
    duration: 'short', experienceLevel: 'Entry',
    proposalCount: 24, isNew: false, isFeatured: false, isSaved: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    client: { name: 'La Bella Italia', rating: 4.0, isVerified: false },
    category: 'Web Development',
  },
  {
    _id: '6', title: 'Content Writer for Tech Blog (Ongoing)',
    description: 'Looking for a skilled tech content writer to produce 4 articles per month covering AI, web development, and startup topics. SEO knowledge is a plus.',
    skills: ['Content Writing', 'SEO', 'Technical Writing', 'Research'],
    budgetType: 'hourly', hourlyMin: 15, hourlyMax: 30,
    duration: 'long', experienceLevel: 'Intermediate',
    proposalCount: 31, isNew: false, isFeatured: false, isSaved: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    client: { name: 'TechBlog Media', rating: 4.6, isVerified: true },
    category: 'Content Writing',
  },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button onClick={() => setOpen(!open)} className="flex justify-between items-center w-full mb-3">
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
};

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    budgetType: '',
    budgetMin: '',
    budgetMax: '',
    experienceLevel: [],
    duration: [],
    sortBy: 'newest',
  });

  const socket = useSocket();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/jobs/all?limit=100');
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Real-time Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewJob = (newJob) => {
      console.log('📢 New job received:', newJob);
      setJobs(prevJobs => [newJob, ...prevJobs]);
    };

    const handleJobUpdated = (updatedJob) => {
      console.log('📝 Job updated:', updatedJob);
      setJobs(prevJobs => 
        prevJobs.map(job => job._id === updatedJob._id ? updatedJob : job)
      );
    };

    const handleJobDeleted = ({ jobId }) => {
      console.log('🗑️ Job deleted:', jobId);
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
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

  const activeFilterCount = [
    filters.category !== 'All Categories',
    filters.budgetType,
    filters.budgetMin || filters.budgetMax,
    filters.experienceLevel.length > 0,
    filters.duration.length > 0,
  ].filter(Boolean).length;

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All Categories', budgetType: '', budgetMin: '', budgetMax: '',
      experienceLevel: [], duration: [], sortBy: 'newest',
    });
    setSearch('');
  };

  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (search && !job.title.toLowerCase().includes(search.toLowerCase()) &&
      !job.description.toLowerCase().includes(search.toLowerCase()) &&
      !job.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    
    // Category filter
    if (filters.category !== 'All Categories' && job.category !== filters.category) return false;
    
    // Budget type filter (fixed vs hourly)
    if (filters.budgetType && job.budget?.type !== filters.budgetType) return false;
    
    // Experience level filter
    if (filters.experienceLevel.length && !filters.experienceLevel.map(l => l.toLowerCase()).includes(job.experienceLevel)) return false;
    
    // Duration filter - map backend values to frontend values
    if (filters.duration.length > 0) {
      const durationMap = {
        'less-than-week': 'short',
        '1-2-weeks': 'short',
        '2-4-weeks': 'short',
        '1-3-months': 'medium',
        '3-6-months': 'medium',
        'more-than-6-months': 'long'
      };
      const jobDurationCategory = durationMap[job.duration] || 'medium';
      if (!filters.duration.includes(jobDurationCategory)) return false;
    }
    
    // Budget range filter
    if (filters.budgetMin || filters.budgetMax) {
      const jobBudget = job.budget?.amount || 0;
      if (filters.budgetMin && jobBudget < parseFloat(filters.budgetMin)) return false;
      if (filters.budgetMax && jobBudget > parseFloat(filters.budgetMax)) return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (filters.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (filters.sortBy === 'budget_high') return (b.budget?.amount || 0) - (a.budget?.amount || 0);
    if (filters.sortBy === 'budget_low') return (a.budget?.amount || 0) - (b.budget?.amount || 0);
    return 0;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <FreelancerHeader />

        <div className="pt-16">
          {/* Search Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Find Your Next Project</h1>
              <p className="text-blue-100 mb-6">Browse thousands of jobs posted by top clients</p>
              <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-xl">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search size={20} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, skill, or keyword..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 outline-none text-gray-700 text-sm"
                  />
                  {search && (
                    <button onClick={() => setSearch('')}>
                      <X size={16} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-gray-900">{filteredJobs.length}</span> jobs found
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                    <X size={12} /> Clear filters ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget_high">Budget: High to Low</option>
                  <option value="budget_low">Budget: Low to High</option>
                </select>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium bg-white hover:bg-gray-50"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-8">
              {/* Sidebar Filters */}
              <aside className={`w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal size={18} className="text-blue-600" />
                      Filters
                    </h2>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <FilterSection title="Category">
                    <div className="space-y-1">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Budget Type */}
                  <FilterSection title="Budget Type">
                    <div className="flex gap-2">
                      {['fixed', 'hourly'].map(type => (
                        <button
                          key={type}
                          onClick={() => setFilters(prev => ({ ...prev, budgetType: prev.budgetType === type ? '' : type }))}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors capitalize ${filters.budgetType === type
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Experience Level */}
                  <FilterSection title="Experience Level">
                    <div className="space-y-2">
                      {['beginner', 'intermediate', 'expert'].map(level => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.experienceLevel.includes(level)}
                            onChange={() => toggleArrayFilter('experienceLevel', level)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Project Duration */}
                  <FilterSection title="Project Duration">
                    <div className="space-y-2">
                      {[
                        { value: 'short', label: 'Short Term (< 1 month)' },
                        { value: 'medium', label: 'Medium Term (1-3 months)' },
                        { value: 'long', label: 'Long Term (3+ months)' },
                      ].map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.duration.includes(value)}
                            onChange={() => toggleArrayFilter('duration', value)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Budget Range */}
                  <FilterSection title="Budget Range ($)" defaultOpen={false}>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min budget"
                        value={filters.budgetMin}
                        onChange={e => setFilters(prev => ({ ...prev, budgetMin: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"
                      />
                      <input
                        type="number"
                        placeholder="Max budget"
                        value={filters.budgetMax}
                        onChange={e => setFilters(prev => ({ ...prev, budgetMax: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  </FilterSection>
                </div>
              </aside>

              {/* Job Listings */}
              <div className="flex-1 min-w-0">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                    <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map(job => (
                      <JobCard key={job._id} job={job} />
                    ))}

                    {/* Load More */}
                    <div className="text-center pt-4">
                      <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                        Load More Jobs
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
