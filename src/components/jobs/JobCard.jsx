'use client';
import Link from 'next/link';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Star, Users } from 'lucide-react';
import { useState } from 'react';

const EXPERIENCE_COLORS = {
  Entry: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Expert: 'bg-purple-100 text-purple-700',
};

const DURATION_LABELS = {
  short: 'Short Term',
  medium: 'Medium Term',
  long: 'Long Term',
};

export default function JobCard({ job }) {
  const [saved, setSaved] = useState(job.isSaved || false);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    return `${mins}m ago`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-6 group">
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {job.isNew && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">New</span>
            )}
            {job.isFeatured && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">⭐ Featured</span>
            )}
            <span className="text-xs text-gray-400">{timeAgo(job.createdAt)}</span>
          </div>
          <Link href={`/jobs/${job._id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer">
              {job.title}
            </h3>
          </Link>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
        >
          {saved ? <BookmarkCheck size={20} className="text-blue-600" /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {job.client?.name?.[0] || 'C'}
        </div>
        <span className="text-sm text-gray-600 font-medium">{job.client?.name || 'Anonymous Client'}</span>
        {job.client?.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star size={12} fill="currentColor" className="text-yellow-400" />
            <span>{job.client.rating}</span>
          </div>
        )}
        {job.client?.isVerified && (
          <span className="text-xs text-blue-600 font-medium">✓ Verified</span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 5).map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">+{job.skills.length - 5}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {/* Budget */}
          <div className="flex items-center gap-1 font-semibold text-gray-800">
            <DollarSign size={15} className="text-green-500" />
            {job.budgetType === 'fixed'
              ? `$${job.budgetMin} - $${job.budgetMax}`
              : `$${job.hourlyMin} - $${job.hourlyMax}/hr`}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{DURATION_LABELS[job.duration] || job.duration}</span>
          </div>

          {/* Location */}
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{job.location}</span>
            </div>
          )}

          {/* Proposals count */}
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{job.proposalCount || 0} proposals</span>
          </div>
        </div>

        {/* Experience Badge */}
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${EXPERIENCE_COLORS[job.experienceLevel] || 'bg-gray-100 text-gray-600'}`}>
          {job.experienceLevel}
        </span>
      </div>
    </div>
  );
}
