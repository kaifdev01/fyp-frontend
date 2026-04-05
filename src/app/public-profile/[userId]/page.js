'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FreelancerHeader from '../../../components/FreelancerHeader';
import ClientHeader from '../../../components/ClientHeader';
import api from '../../../lib/api';
import {
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Award,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  User,
  Briefcase,
  GraduationCap,
  Languages,
  Eye,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';

export default function PublicProfile() {
  const { userId } = useParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioPage, setPortfolioPage] = useState(0);
  const [currentUserRole, setCurrentUserRole] = useState('freelancer');
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfileData({ user: response.data.user });
        const role = localStorage.getItem('userRole') || 'freelancer';
        setCurrentUserRole(role);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError('Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  const Header = currentUserRole === 'client' ? ClientHeader : FreelancerHeader;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600">The profile you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const { user } = profileData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
            <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-2 rounded-full backdrop-blur-md border text-sm font-medium ${user?.isAvailable
                  ? 'bg-green-500/20 border-green-300/50 text-green-100'
                  : 'bg-red-500/20 border-red-300/50 text-red-100'
                  }`}>
                  {user?.isAvailable ? 'Available for hire' : 'Currently busy'}
                </span>
              </div>
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-20 mb-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-40 h-40 rounded-full bg-white p-3 shadow-2xl mb-6">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={56} className="text-white" />
                      )}
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <h1 className="text-4xl font-bold text-gray-900">{user?.name}</h1>
                      {user?.kyc?.status === 'verified' && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          <CheckCircle size={18} fill="currentColor" />
                          Verified
                        </div>
                      )}
                    </div>
                    {user?.intro && (
                      <p className="text-xl text-gray-700 mb-4 font-medium">{user.intro}</p>
                    )}

                    <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {user?.primaryRole === 'freelancer' ? '🚀 Freelancer' : '💼 Client'}
                      </span>
                      <div className="flex items-center gap-1 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-semibold">
                        <Star size={16} fill="currentColor" className="text-yellow-500" />
                        <span>{user?.rating || 0.0}</span>
                        <span className="text-yellow-600">({user?.completedProjects || 0})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 mb-8">
                      {user?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-blue-500" />
                          <span className="font-medium">{user.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-green-500" />
                        <span className="font-bold text-lg">${user?.hourlyRate || 0}/hr</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => router.push('/messages')}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={20} />
                        Send Message
                      </button>
                      <button
                        onClick={() => router.push(`/submit-proposal/${userId}`)}
                        className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all hover:shadow-lg"
                      >
                        🤝 Hire Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* About */}
              {user?.bio && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <User className="text-blue-600" size={24} />
                    About Me
                  </h2>
                  <p className="text-gray-700 leading-relaxed break-words">{user.bio}</p>
                </div>
              )}

              {/* Skills */}
              {user?.skills?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Briefcase className="text-blue-600" size={24} />
                    Skills & Expertise
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {user?.languages?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Languages className="text-green-600" size={24} />
                    Languages
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="font-medium text-gray-900">{lang.language}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {user?.education?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <GraduationCap className="text-purple-600" size={24} />
                    Education
                  </h2>
                  <div className="space-y-6">
                    {user.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-6 py-4">
                        <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-purple-600 font-medium text-lg">{edu.school}</p>
                        {edu.field && <p className="text-gray-600 mt-1">{edu.field}</p>}
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                            <Calendar size={14} />
                            {edu.startYear} - {edu.endYear || 'Present'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews/Testimonials */}
              {user?.reviews?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Star className="text-yellow-500" size={24} />
                    Client Reviews
                  </h2>
                  <div className="space-y-4">
                    {user.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{review.clientName}</p>
                            <p className="text-sm text-gray-500">{review.jobTitle}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Award className="text-indigo-600" size={24} />
                  Portfolio
                </h2>
                {user?.portfolio?.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.portfolio.slice(portfolioPage * itemsPerPage, (portfolioPage + 1) * itemsPerPage).map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                          {item.media?.length > 0 ? (
                            <div className="relative h-48 overflow-hidden">
                              {item.media[0].type === 'image' ? (
                                <img
                                  src={item.media[0].url}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <video
                                  src={item.media[0].url}
                                  className="w-full h-full object-cover"
                                  controls={false}
                                  muted
                                />
                              )}
                              {item.media.length > 1 && (
                                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                                  +{item.media.length - 1} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <Award size={32} className="text-gray-400" />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                            {item.description && (
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3 break-words">{item.description}</p>
                            )}
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                              >
                                <Globe size={16} />
                                View Project
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {user.portfolio.length > itemsPerPage && (
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={() => setPortfolioPage(Math.max(0, portfolioPage - 1))}
                          disabled={portfolioPage === 0}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm text-gray-600">
                          {portfolioPage + 1} of {Math.ceil(user.portfolio.length / itemsPerPage)}
                        </span>
                        <button
                          onClick={() => setPortfolioPage(Math.min(Math.ceil(user.portfolio.length / itemsPerPage) - 1, portfolioPage + 1))}
                          disabled={portfolioPage >= Math.ceil(user.portfolio.length / itemsPerPage) - 1}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Award size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No portfolio items yet</p>
                    <p className="text-gray-400 text-sm">Portfolio projects will appear here once added</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">

              {/* KYC Verification Card */}
              {user?.kyc?.status && (
                <div className={`rounded-2xl shadow-lg border p-6 ${
                  user.kyc.status === 'verified'
                    ? 'bg-green-50 border-green-200'
                    : user.kyc.status === 'pending'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${
                    user.kyc.status === 'verified'
                      ? 'text-green-700'
                      : user.kyc.status === 'pending'
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}>
                    <CheckCircle size={20} fill="currentColor" />
                    ID Verification
                  </h3>
                  <p className={`text-sm ${
                    user.kyc.status === 'verified'
                      ? 'text-green-600'
                      : user.kyc.status === 'pending'
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}>
                    {user.kyc.status === 'verified'
                      ? '✓ Identity verified'
                      : user.kyc.status === 'pending'
                      ? '⏳ Verification pending'
                      : '✗ Verification rejected'}
                  </p>
                </div>
              )}

              {/* Response Time Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Response Time
                </h3>
                <p className="text-2xl font-bold text-blue-600">{user?.responseTime || '< 24 hours'}</p>
                <p className="text-sm text-gray-600 mt-1">Typically responds within this time</p>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="text-green-600" size={20} />
                  Statistics
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Total Earnings</span>
                    <span className="font-bold text-green-600 text-lg">${user?.totalEarnings || 0}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Projects Done</span>
                    <span className="font-bold text-blue-600 text-lg">{user?.completedProjects || 0}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star size={16} fill="currentColor" className="text-yellow-500" />
                      <span className="font-bold text-gray-900 text-lg">{user?.rating || 0.0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly Rate Comparison */}
              {user?.hourlyRate && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={20} />
                    Rate Comparison
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">This Freelancer</span>
                      <span className="font-bold text-gray-900">${user.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Market Average</span>
                      <span className="font-bold text-gray-900">$45/hr</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className={`text-sm font-medium ${
                        user.hourlyRate <= 45 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {user.hourlyRate <= 45 ? '✓ Competitive rate' : '⚠ Above market average'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {user?.socialLinks && Object.keys(user.socialLinks).some(key => user.socialLinks[key]) && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="text-blue-600" size={20} />
                    Connect
                  </h3>
                  <div className="space-y-2">
                    {user.socialLinks.email && (
                      <a href={`mailto:${user.socialLinks.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                        <Mail size={16} />
                        Email
                      </a>
                    )}
                    {user.socialLinks.phone && (
                      <a href={`tel:${user.socialLinks.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                        <Phone size={16} />
                        Phone
                      </a>
                    )}
                    {user.socialLinks.website && (
                      <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                        <Globe size={16} />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Availability Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                <div className={`p-4 rounded-xl text-center ${user?.isAvailable
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
                  }`}>
                  <p className={`font-semibold ${user?.isAvailable ? 'text-green-700' : 'text-red-700'
                    }`}>
                    {user?.isAvailable ? '🟢 Available for new projects' : '🔴 Currently unavailable'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}