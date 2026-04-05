'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Search, Star, MapPin, DollarSign, Briefcase, Users, Filter, X, MessageSquare, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const MOCK_FREELANCERS = [
  {
    id: 1,
    name: 'John Developer',
    title: 'Full Stack Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    rating: 4.8,
    reviews: 24,
    hourlyRate: 35,
    location: 'New York, USA',
    bio: 'Experienced full-stack developer with 5+ years in React, Node.js, and MongoDB',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    completedProjects: 45,
    responseTime: '< 2 hours',
    isVerified: true,
    category: 'Web Development'
  },
  {
    id: 2,
    name: 'Sarah Designer',
    title: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 4.9,
    reviews: 32,
    hourlyRate: 40,
    location: 'San Francisco, USA',
    bio: 'Creative UI/UX designer specializing in SaaS and mobile apps',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Adobe XD'],
    completedProjects: 58,
    responseTime: '< 1 hour',
    isVerified: true,
    category: 'Design'
  },
  {
    id: 3,
    name: 'Mike Backend',
    title: 'Backend Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    rating: 4.7,
    reviews: 18,
    hourlyRate: 45,
    location: 'London, UK',
    bio: 'Backend specialist with expertise in scalable APIs and databases',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Kubernetes'],
    completedProjects: 32,
    responseTime: '< 3 hours',
    isVerified: true,
    category: 'Web Development'
  },
  {
    id: 4,
    name: 'Emma Mobile',
    title: 'React Native Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    rating: 4.6,
    reviews: 15,
    hourlyRate: 38,
    location: 'Toronto, Canada',
    bio: 'Mobile app developer with 4+ years of React Native experience',
    skills: ['React Native', 'JavaScript', 'Firebase', 'iOS', 'Android'],
    completedProjects: 28,
    responseTime: '< 4 hours',
    isVerified: false,
    category: 'Mobile Development'
  },
  {
    id: 5,
    name: 'Alex Marketer',
    title: 'Digital Marketing Specialist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rating: 4.5,
    reviews: 22,
    hourlyRate: 30,
    location: 'Austin, USA',
    bio: 'Digital marketing expert with focus on SEO and content strategy',
    skills: ['SEO', 'Content Marketing', 'Google Ads', 'Analytics', 'Social Media'],
    completedProjects: 41,
    responseTime: '< 2 hours',
    isVerified: true,
    category: 'Marketing'
  },
  {
    id: 6,
    name: 'Lisa Writer',
    title: 'Content Writer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    rating: 4.8,
    reviews: 28,
    hourlyRate: 25,
    location: 'Melbourne, Australia',
    bio: 'Professional content writer specializing in tech and SaaS blogs',
    skills: ['Content Writing', 'Copywriting', 'Blog Writing', 'SEO Writing', 'Editing'],
    completedProjects: 67,
    responseTime: '< 1 hour',
    isVerified: true,
    category: 'Writing'
  },
  {
    id: 7,
    name: 'David DevOps',
    title: 'DevOps Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 4.7,
    reviews: 12,
    hourlyRate: 50,
    location: 'Berlin, Germany',
    bio: 'DevOps specialist with expertise in cloud infrastructure and CI/CD',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    completedProjects: 25,
    responseTime: '< 5 hours',
    isVerified: true,
    category: 'Web Development'
  },
  {
    id: 8,
    name: 'Nina Illustrator',
    title: 'Graphic Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina',
    rating: 4.9,
    reviews: 35,
    hourlyRate: 35,
    location: 'Paris, France',
    bio: 'Talented graphic designer creating stunning visuals and illustrations',
    skills: ['Graphic Design', 'Illustration', 'Branding', 'Adobe Creative Suite', 'Animation'],
    completedProjects: 72,
    responseTime: '< 2 hours',
    isVerified: true,
    category: 'Design'
  }
];

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Design', 'Marketing', 'Writing'];

export default function FindFreelancersPage() {
  const [freelancers, setFreelancers] = useState(MOCK_FREELANCERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRate, setMinRate] = useState(0);
  const [maxRate, setMaxRate] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredFreelancers = freelancers
    .filter(freelancer => {
      const matchesSearch = freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || freelancer.category === selectedCategory;
      const matchesRate = freelancer.hourlyRate >= minRate && freelancer.hourlyRate <= maxRate;
      const matchesRating = freelancer.rating >= minRating;
      return matchesSearch && matchesCategory && matchesRate && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'rate-low') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'rate-high') return b.hourlyRate - a.hourlyRate;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'projects') return b.completedProjects - a.completedProjects;
      return 0;
    });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <ClientHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Users className="text-green-600" size={32} />
                Find Freelancers
              </h1>
              <p className="text-gray-600">Browse and hire talented freelancers for your projects</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, title, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Sidebar Filters */}
              <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Filter size={20} />
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-1 hover:bg-gray-100 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Category</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                            selectedCategory === category
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Hourly Rate</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Min: ${minRate}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={minRate}
                          onChange={(e) => setMinRate(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Max: ${maxRate}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={maxRate}
                          onChange={(e) => setMaxRate(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Minimum Rating</h4>
                    <div className="space-y-2">
                      {[0, 3.5, 4, 4.5, 4.8].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                            minRating === rating
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {rating === 0 ? 'All Ratings' : (
                            <>
                              <Star size={14} fill="currentColor" />
                              {rating}+
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">

                {/* Sort and View Options */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600 font-medium">
                    Showing <span className="font-bold text-gray-900">{filteredFreelancers.length}</span> freelancers
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowFilters(true)}
                      className="lg:hidden px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <Filter size={16} />
                      Filters
                    </button>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium"
                    >
                      <option value="rating">Highest Rated</option>
                      <option value="rate-low">Lowest Rate</option>
                      <option value="rate-high">Highest Rate</option>
                      <option value="reviews">Most Reviews</option>
                      <option value="projects">Most Projects</option>
                    </select>
                  </div>
                </div>

                {/* Freelancer Cards */}
                {filteredFreelancers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFreelancers.map(freelancer => (
                      <div
                        key={freelancer.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-6">

                          {/* Avatar and Basic Info */}
                          <div className="flex gap-4 flex-1">
                            <img
                              src={freelancer.avatar}
                              alt={freelancer.name}
                              className="w-20 h-20 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">{freelancer.name}</h3>
                                {freelancer.isVerified && (
                                  <CheckCircle size={18} className="text-blue-600" fill="currentColor" />
                                )}
                              </div>
                              <p className="text-green-600 font-semibold text-sm mb-2">{freelancer.title}</p>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{freelancer.bio}</p>

                              {/* Location and Rate */}
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <MapPin size={16} className="text-gray-400" />
                                  {freelancer.location}
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <DollarSign size={16} className="text-green-600" />
                                  <span className="font-semibold">${freelancer.hourlyRate}/hr</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Stats and Actions */}
                          <div className="flex flex-col items-end gap-4">

                            {/* Rating and Stats */}
                            <div className="text-right">
                              <div className="flex items-center justify-end gap-1 mb-1">
                                <Star size={18} className="text-yellow-500" fill="currentColor" />
                                <span className="font-bold text-gray-900">{freelancer.rating}</span>
                              </div>
                              <p className="text-xs text-gray-500">({freelancer.reviews} reviews)</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 text-center">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Projects</p>
                                <p className="font-bold text-gray-900">{freelancer.completedProjects}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Response</p>
                                <p className="font-bold text-gray-900 text-xs">{freelancer.responseTime}</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 w-full md:w-auto">
                              <button
                                onClick={() => setSelectedFreelancer(freelancer)}
                                className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                              >
                                Hire
                              </button>
                              <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                                <MessageSquare size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {freelancer.skills.map(skill => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No freelancers found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search query</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hire Modal */}
        {selectedFreelancer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Hire Freelancer</h2>
                <button
                  onClick={() => setSelectedFreelancer(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedFreelancer.avatar}
                  alt={selectedFreelancer.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{selectedFreelancer.name}</h3>
                  <p className="text-green-600 font-semibold text-sm">{selectedFreelancer.title}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Hourly Rate</span>
                  <span className="font-bold text-gray-900">${selectedFreelancer.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                    <span className="font-bold text-gray-900">{selectedFreelancer.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Projects Completed</span>
                  <span className="font-bold text-gray-900">{selectedFreelancer.completedProjects}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold">
                  Send Job Offer
                </button>
                <button
                  onClick={() => setSelectedFreelancer(null)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
