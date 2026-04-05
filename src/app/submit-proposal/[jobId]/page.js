'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Briefcase, DollarSign, Clock, Users, ChevronLeft,
  Sparkles, AlertCircle, CheckCircle, Loader2, X,
  Star, MapPin, RefreshCw, Send, Info
} from 'lucide-react';

const MOCK_JOB = {
  _id: '1',
  title: 'Full Stack Developer Needed for E-commerce Platform',
  description: 'We are looking for an experienced full stack developer to build a modern e-commerce platform from scratch using React and Node.js.',
  skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'REST API', 'Next.js'],
  budgetType: 'fixed',
  budgetMin: 1500,
  budgetMax: 3000,
  duration: 'medium',
  experienceLevel: 'Intermediate',
  proposalCount: 12,
  client: {
    name: 'TechCorp Inc.',
    rating: 4.8,
    isVerified: true,
    location: 'New York, USA',
    totalJobsPosted: 24,
    hireRate: 78,
  },
};

const MOCK_USER = {
  name: 'John Developer',
  credits: 1,
  isFreeTrialUsed: false,
  hourlyRate: 45,
};

const AI_GENERATED_PROPOSAL = `Dear TechCorp Inc. Team,

I am excited to apply for the Full Stack Developer position for your e-commerce platform project. With over 5 years of hands-on experience building scalable web applications using React and Node.js, I am confident I can deliver exactly what you're looking for.

**Why I'm the right fit:**

Having built 3 similar e-commerce platforms from scratch, I understand the technical challenges involved — from optimizing product listing performance to implementing secure Stripe checkout flows. My most recent project, a marketplace for 500+ vendors, handles 10,000+ daily transactions with 99.9% uptime.

**My approach to your project:**

1. Week 1-2: Architecture setup, authentication system, and database schema design
2. Week 3-5: Core product listings, cart, and checkout with Stripe integration
3. Week 6-8: Admin panel, shipping API integration, and performance optimization
4. Week 9-10: Testing, bug fixes, and deployment to AWS

**Technical stack I'll use:**
- Frontend: Next.js 14 with Tailwind CSS for a fast, SEO-optimized storefront
- Backend: Node.js with Express, MongoDB for flexible product data
- Infrastructure: AWS S3 for media, Redis for caching, Docker for deployment

I am available to start immediately and can dedicate 40 hours/week to this project. I'd love to schedule a quick call to discuss your vision in more detail.

Looking forward to working with you!

Best regards,
John Developer`;

function SubmitProposalContent() {
  const { jobId } = useParams();
  const searchParams = useSearchParams();
  const isAIMode = searchParams.get('ai') === 'true';

  const [mode, setMode] = useState(isAIMode ? 'ai' : 'manual');
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [credits, setCredits] = useState(MOCK_USER.credits);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const job = MOCK_JOB;
  const user = MOCK_USER;

  const wordCount = coverLetter.trim().split(/\s+/).filter(Boolean).length;
  const charCount = coverLetter.length;
  const isFormValid = coverLetter.trim().length >= 100 && bidAmount && deliveryTime;

  const handleGenerateAI = async () => {
    if (credits <= 0 && user.isFreeTrialUsed) {
      setShowCreditModal(true);
      return;
    }
    setAiGenerating(true);
    // Simulate AI generation delay
    await new Promise(r => setTimeout(r, 2500));
    setCoverLetter(AI_GENERATED_PROPOSAL);
    setBidAmount('2200');
    setDeliveryTime('10');
    setAiGenerated(true);
    setAiGenerating(false);
    setCredits(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Proposal Submitted!</h2>
          <p className="text-gray-500 mb-2">Your proposal for</p>
          <p className="font-semibold text-gray-800 mb-6">"{job.title}"</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Your Bid</span>
              <span className="font-bold text-gray-900">${bidAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Time</span>
              <span className="font-bold text-gray-900">{deliveryTime} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-bold text-green-600">Submitted ✓</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-8">The client will review your proposal and reach out if interested.</p>
          <div className="space-y-3">
            <button onClick={() => window.close()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Close Tab
            </button>
            <Link href="/my-proposals" className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
              View My Proposals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.close()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
              <X size={20} />
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-500">Submitting proposal for</p>
              <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">{job.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-xl">
              <Zap size={14} className="text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">{credits} credit{credits !== 1 ? 's' : ''}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user.name[0]}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — Proposal Form */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Mode Toggle */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 flex gap-2">
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  mode === 'manual'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Briefcase size={16} />
                Write Manually
              </button>
              <button
                onClick={() => setMode('ai')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  mode === 'ai'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Zap size={16} className={mode === 'ai' ? 'text-yellow-300' : ''} />
                AI Proposal Writer
                {credits > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${mode === 'ai' ? 'bg-white/20' : 'bg-violet-100 text-violet-600'}`}>
                  {user.isFreeTrialUsed ? '5 credits' : 'Free'}
                </span>}
              </button>
            </div>

            {/* AI Mode Banner */}
            {mode === 'ai' && (
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles size={24} className="text-yellow-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">AI Proposal Writer</h3>
                    <p className="text-purple-100 text-sm mb-4">
                      Our AI analyzes the job description and your profile to write a personalized, high-converting proposal in seconds.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {['Personalized to job', 'Professional tone', 'Highlights your skills', 'Optimized to win'].map(f => (
                        <span key={f} className="flex items-center gap-1.5 text-xs bg-white/15 px-3 py-1.5 rounded-full">
                          <CheckCircle size={12} /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-white/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-purple-100">
                    <Info size={14} />
                    {credits > 0 && !user.isFreeTrialUsed
                      ? <span><strong className="text-white">1 free trial</strong> available — no credits used</span>
                      : <span>Uses <strong className="text-white">5 credits</strong> per generation ({credits} remaining)</span>
                    }
                  </div>
                  <button
                    onClick={handleGenerateAI}
                    disabled={aiGenerating}
                    className="flex items-center gap-2 bg-white text-purple-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors disabled:opacity-70 flex-shrink-0"
                  >
                    {aiGenerating ? (
                      <><Loader2 size={16} className="animate-spin" /> Generating...</>
                    ) : aiGenerated ? (
                      <><RefreshCw size={16} /> Regenerate</>
                    ) : (
                      <><Zap size={16} /> Generate Proposal</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* AI Generating Animation */}
            {aiGenerating && (
              <div className="bg-white rounded-2xl border border-violet-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
                      <Sparkles size={28} className="text-violet-600 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-violet-300 border-t-violet-600 animate-spin" />
                  </div>
                </div>
                <p className="font-bold text-gray-900 mb-2">AI is writing your proposal...</p>
                <p className="text-sm text-gray-500">Analyzing job requirements and crafting a personalized cover letter</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {!aiGenerating && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Cover Letter</h3>
                  {aiGenerated && mode === 'ai' && (
                    <span className="flex items-center gap-1.5 text-xs text-violet-600 bg-violet-50 px-3 py-1 rounded-full font-medium border border-violet-200">
                      <Sparkles size={12} /> AI Generated — feel free to edit
                    </span>
                  )}
                </div>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder={mode === 'ai' && !aiGenerated
                    ? "Click 'Generate Proposal' above to let AI write your cover letter, or start typing manually..."
                    : "Introduce yourself and explain why you're the best fit for this job. Mention relevant experience, your approach to the project, and why you're excited about it..."}
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{wordCount} words · {charCount} characters</p>
                  {charCount < 100 && charCount > 0 && (
                    <p className="text-xs text-amber-500">Minimum 100 characters required</p>
                  )}
                  {charCount >= 100 && (
                    <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Good length</p>
                  )}
                </div>
              </div>
            )}

            {/* Bid Details */}
            {!aiGenerating && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-5">Bid Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Bid Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-semibold"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Client budget: ${job.budgetMin} – ${job.budgetMax}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Time (days)
                    </label>
                    <input
                      type="number"
                      value={deliveryTime}
                      onChange={e => setDeliveryTime(e.target.value)}
                      placeholder="e.g. 14"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      Project duration: 1–3 months
                    </p>
                  </div>
                </div>

                {/* Earnings breakdown */}
                {bidAmount && (
                  <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm font-semibold text-green-800 mb-2">Earnings Breakdown</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Your bid</span>
                        <span className="font-medium">${parseFloat(bidAmount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>WorkDeck service fee (10%)</span>
                        <span className="font-medium text-red-500">-${(parseFloat(bidAmount || 0) * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-green-700 pt-1.5 border-t border-green-200">
                        <span>You receive</span>
                        <span>${(parseFloat(bidAmount || 0) * 0.9).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {!aiGenerating && (
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || submitting}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 size={20} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={20} /> Submit Proposal</>
                )}
              </button>
            )}
          </div>

          {/* Right — Job Summary */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-5">

              {/* Job Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-500">Job Summary</h3>
                <p className="font-semibold text-gray-900 mb-4 leading-snug">{job.title}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1.5"><DollarSign size={13} /> Budget</span>
                    <span className="font-semibold text-gray-900">${job.budgetMin}–${job.budgetMax}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1.5"><Clock size={13} /> Duration</span>
                    <span className="font-semibold text-gray-900">1–3 months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1.5"><Users size={13} /> Level</span>
                    <span className="font-semibold text-gray-900">{job.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1.5"><Briefcase size={13} /> Proposals</span>
                    <span className="font-semibold text-gray-900">{job.proposalCount}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 6).map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {job.client.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{job.client.name}</p>
                    {job.client.isVerified && (
                      <span className="text-xs text-blue-600 flex items-center gap-0.5">
                        <CheckCircle size={11} /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Star size={12} fill="currentColor" className="text-yellow-400" />
                      {job.client.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jobs Posted</span>
                    <span className="font-semibold">{job.client.totalJobsPosted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hire Rate</span>
                    <span className="font-semibold text-green-600">{job.client.hireRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-semibold">{job.client.location}</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <Info size={15} /> Proposal Tips
                </h3>
                <ul className="space-y-2 text-xs text-amber-700">
                  <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Address the client by name</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Mention specific skills from the job post</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Share a relevant past project or result</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Keep it concise — under 300 words is ideal</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">•</span> End with a clear call to action</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Credits Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Out of Credits</h3>
                <p className="text-gray-500 text-sm mt-1">Purchase credits to use AI Proposal Writer</p>
              </div>
              <button onClick={() => setShowCreditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { credits: 100, price: 50, tag: null },
                { credits: 250, price: 110, tag: 'Popular' },
                { credits: 500, price: 200, tag: 'Best Value' },
              ].map(({ credits, price, tag }) => (
                <button key={credits} className="w-full flex items-center justify-between p-4 border-2 border-gray-200 hover:border-violet-400 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Zap size={18} className="text-violet-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{credits} Credits</p>
                      <p className="text-xs text-gray-500">{credits / 5} proposals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {tag && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium block mb-1">{tag}</span>}
                    <p className="font-bold text-gray-900">${price}</p>
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all">
              Purchase Credits
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmitProposal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <SubmitProposalContent />
    </Suspense>
  );
}
