'use client';
import { useState } from 'react';
import AdminHeader from '../../../components/AdminHeader';
import { Users, Search, Filter, Eye, CheckCircle, AlertCircle, X, Shield, Ban, MoreVertical, Mail, MapPin, Calendar, Star, Briefcase } from 'lucide-react';

const MOCK_USERS = [
  {
    id: 1,
    name: 'John Developer',
    email: 'john@example.com',
    type: 'freelancer',
    status: 'verified',
    joinDate: '2023-11-15',
    location: 'San Francisco, USA',
    rating: 4.8,
    completedJobs: 24,
    totalEarnings: 12500,
    profileImage: 'JD',
    bio: 'Full-stack developer with 5+ years experience',
    skills: ['React', 'Node.js', 'MongoDB'],
    verificationDate: '2023-11-20'
  },
  {
    id: 2,
    name: 'TechCorp Inc.',
    email: 'contact@techcorp.com',
    type: 'client',
    status: 'verified',
    joinDate: '2023-10-01',
    location: 'New York, USA',
    rating: 4.9,
    postedJobs: 15,
    totalSpent: 45000,
    profileImage: 'TC',
    bio: 'Leading tech company looking for talented developers',
    verificationDate: '2023-10-05'
  },
  {
    id: 3,
    name: 'Sarah Designer',
    email: 'sarah@example.com',
    type: 'freelancer',
    status: 'verified',
    joinDate: '2023-12-01',
    location: 'London, UK',
    rating: 4.7,
    completedJobs: 18,
    totalEarnings: 8900,
    profileImage: 'SD',
    bio: 'UI/UX Designer specializing in mobile apps',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    verificationDate: '2023-12-05'
  },
  {
    id: 4,
    name: 'Mike Backend',
    email: 'mike@example.com',
    type: 'freelancer',
    status: 'pending_verification',
    joinDate: '2024-01-10',
    location: 'Toronto, Canada',
    rating: 0,
    completedJobs: 0,
    totalEarnings: 0,
    profileImage: 'MB',
    bio: 'Backend developer with Python expertise',
    skills: ['Python', 'Django', 'PostgreSQL'],
    verificationDate: null
  },
  {
    id: 5,
    name: 'FoodRush',
    email: 'hello@foodrush.com',
    type: 'client',
    status: 'verified',
    joinDate: '2023-09-15',
    location: 'Los Angeles, USA',
    rating: 4.6,
    postedJobs: 8,
    totalSpent: 22000,
    profileImage: 'FR',
    bio: 'Food delivery startup',
    verificationDate: '2023-09-20'
  },
  {
    id: 6,
    name: 'Emma Designer',
    email: 'emma@example.com',
    type: 'freelancer',
    status: 'suspended',
    joinDate: '2023-08-20',
    location: 'Berlin, Germany',
    rating: 3.2,
    completedJobs: 5,
    totalEarnings: 2100,
    profileImage: 'ED',
    bio: 'Graphic designer',
    skills: ['Adobe Suite', 'Branding'],
    verificationDate: '2023-08-25',
    suspensionReason: 'Multiple quality complaints'
  },
  {
    id: 7,
    name: 'Lisa Copywriter',
    email: 'lisa@example.com',
    type: 'freelancer',
    status: 'verified',
    joinDate: '2023-11-05',
    location: 'Sydney, Australia',
    rating: 4.5,
    completedJobs: 12,
    totalEarnings: 5600,
    profileImage: 'LC',
    bio: 'Content writer and copywriter',
    skills: ['Content Writing', 'SEO', 'Copywriting'],
    verificationDate: '2023-11-10'
  },
  {
    id: 8,
    name: 'David Developer',
    email: 'david@example.com',
    type: 'freelancer',
    status: 'verified',
    joinDate: '2023-07-12',
    location: 'Singapore',
    rating: 4.4,
    completedJobs: 31,
    totalEarnings: 18900,
    profileImage: 'DD',
    bio: 'WordPress and PHP specialist',
    skills: ['WordPress', 'PHP', 'MySQL'],
    verificationDate: '2023-07-18'
  }
];

const STATUS_COLORS = {
  verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified', icon: CheckCircle },
  pending_verification: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: AlertCircle },
  suspended: { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspended', icon: Ban }
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || u.type === filterType;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: users.length,
    clients: users.filter(u => u.type === 'client').length,
    freelancers: users.filter(u => u.type === 'freelancer').length,
    verified: users.filter(u => u.status === 'verified').length,
    pending: users.filter(u => u.status === 'pending_verification').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  const handleVerifyUser = (userId) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: 'verified', verificationDate: new Date().toISOString().split('T')[0] } : u
    ));
    setShowDetails(false);
    setShowActionMenu(null);
  };

  const handleSuspendUser = (userId, reason) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: 'suspended', suspensionReason: reason } : u
    ));
    setShowDetails(false);
    setShowActionMenu(null);
  };

  const handleReactivateUser = (userId) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: 'verified', suspensionReason: null } : u
    ));
    setShowDetails(false);
    setShowActionMenu(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <AdminHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Users className="text-blue-600" size={32} />
              Users Management
            </h1>
            <p className="text-gray-600">Manage platform users, verify accounts, and monitor activity</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Clients</p>
              <p className="text-3xl font-bold text-blue-600">{stats.clients}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Freelancers</p>
              <p className="text-3xl font-bold text-green-600">{stats.freelancers}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Verified</p>
              <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <p className="text-gray-600 text-sm mb-2">Suspended</p>
              <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
              >
                <option value="all">All Types</option>
                <option value="client">Clients</option>
                <option value="freelancer">Freelancers</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending_verification">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Rating</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const StatusIcon = STATUS_COLORS[user.status].icon;
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                              {user.profileImage}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.type === 'client'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.type === 'client' ? 'Client' : 'Freelancer'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[user.status].bg} ${STATUS_COLORS[user.status].text}`}>
                            <StatusIcon size={14} />
                            {STATUS_COLORS[user.status].label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {user.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-500 fill-yellow-500" size={16} />
                              <span className="font-semibold text-gray-900">{user.rating}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No rating</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetails(false);
            setShowActionMenu(null);
          }}
          onVerify={() => handleVerifyUser(selectedUser.id)}
          onSuspend={(reason) => handleSuspendUser(selectedUser.id, reason)}
          onReactivate={() => handleReactivateUser(selectedUser.id)}
        />
      )}
    </div>
  );
}

function UserDetailsModal({ user, onClose, onVerify, onSuspend, onReactivate }) {
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showSuspendForm, setShowSuspendForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 sm:my-8">
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Profile Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
              {user.profileImage}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail size={16} />
                {user.email}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  user.type === 'client'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {user.type === 'client' ? 'Client' : 'Freelancer'}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[user.status].bg} ${STATUS_COLORS[user.status].text}`}>
                  {STATUS_COLORS[user.status].label}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Bio</p>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}

          {/* Location & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                <MapPin size={14} />
                Location
              </p>
              <p className="font-semibold text-gray-900">{user.location}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                <Calendar size={14} />
                Joined
              </p>
              <p className="font-semibold text-gray-900">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Verification Info */}
          {user.verificationDate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <span className="font-semibold">Verified on:</span> {new Date(user.verificationDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Suspension Info */}
          {user.status === 'suspended' && user.suspensionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                <span className="font-semibold">Suspension Reason:</span> {user.suspensionReason}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.type === 'freelancer' ? (
              <>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-blue-600 mb-1 flex items-center gap-2">
                    <Briefcase size={14} />
                    Completed Jobs
                  </p>
                  <p className="text-2xl font-bold text-blue-900">{user.completedJobs}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-green-600 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-900">${user.totalEarnings.toLocaleString()}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-blue-600 mb-1 flex items-center gap-2">
                    <Briefcase size={14} />
                    Posted Jobs
                  </p>
                  <p className="text-2xl font-bold text-blue-900">{user.postedJobs}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-purple-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-purple-900">${user.totalSpent.toLocaleString()}</p>
                </div>
              </>
            )}
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          {user.rating > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">Rating</p>
                  <p className="text-lg font-bold text-yellow-900">{user.rating} / 5.0</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 space-y-3">
          {user.status === 'pending_verification' && (
            <button
              onClick={onVerify}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Verify User
            </button>
          )}

          {user.status === 'verified' && (
            <button
              onClick={() => setShowSuspendForm(!showSuspendForm)}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Ban size={18} />
              Suspend User
            </button>
          )}

          {user.status === 'suspended' && (
            <button
              onClick={onReactivate}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Reactivate User
            </button>
          )}

          {showSuspendForm && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter suspension reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (suspensionReason.trim()) {
                      onSuspend(suspensionReason);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                >
                  Confirm Suspension
                </button>
                <button
                  onClick={() => {
                    setShowSuspendForm(false);
                    setSuspensionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
