'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientHeader from '../../components/ClientHeader';
import ProtectedRoute from '../../components/ProtectedRoute';
import JobCard from '../../components/jobs/JobCard';
import {
  ChevronRight, ChevronLeft, Check, Briefcase, DollarSign,
  Clock, Users, AlertCircle, X, Plus, Trash2, Loader2
} from 'lucide-react';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'UI/UX Design',
  'Graphic Design', 'Digital Marketing', 'Content Writing',
  'Data Science', 'AI & Machine Learning', 'Video & Animation'
];

const SUBCATEGORIES = {
  'Web Development': ['Frontend', 'Backend', 'Full Stack', 'WordPress'],
  'Mobile Development': ['iOS', 'Android', 'React Native', 'Flutter'],
  'UI/UX Design': ['Web Design', 'App Design', 'Prototyping'],
  'Graphic Design': ['Logo Design', 'Branding', 'Illustration'],
  'Digital Marketing': ['SEO', 'Social Media', 'Content Marketing'],
  'Content Writing': ['Blog Posts', 'Copywriting', 'Technical Writing'],
  'Data Science': ['Data Analysis', 'Machine Learning', 'Visualization'],
  'AI & Machine Learning': ['NLP', 'Computer Vision', 'Model Training'],
  'Video & Animation': ['Video Editing', '2D Animation', '3D Animation']
};

const EXPERIENCE_LEVELS = ['Entry', 'Intermediate', 'Expert'];
const DURATIONS = ['Short Term (< 1 month)', 'Medium Term (1-3 months)', 'Long Term (3+ months)'];

export default function PostJob() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    skills: [],
    skillInput: '',
    budgetType: 'fixed',
    budgetMin: '',
    budgetMax: '',
    hourlyMin: '',
    hourlyMax: '',
    duration: '',
    experienceLevel: '',
    visibility: 'public',
    attachments: [],
    questions: [],
    questionInput: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: ''
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addQuestion = () => {
    if (formData.questionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, prev.questionInput.trim()],
        questionInput: ''
      }));
    }
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const isStep1Valid = formData.title && formData.category && formData.subcategory && formData.description && formData.skills.length > 0;
  const isStep2Valid = formData.budgetType === 'fixed' 
    ? (formData.budgetMin && formData.budgetMax) 
    : (formData.hourlyMin && formData.hourlyMax);
  const isStep3Valid = formData.duration && formData.experienceLevel;

  const previewJob = {
    _id: '1',
    title: formData.title || 'Your Job Title',
    description: formData.description || 'Your job description will appear here...',
    skills: formData.skills,
    budgetType: formData.budgetType,
    budgetMin: formData.budgetMin,
    budgetMax: formData.budgetMax,
    hourlyMin: formData.hourlyMin,
    hourlyMax: formData.hourlyMax,
    duration: formData.duration === 'Short Term (< 1 month)' ? 'short' : formData.duration === 'Medium Term (1-3 months)' ? 'medium' : 'long',
    experienceLevel: formData.experienceLevel,
    proposalCount: 0,
    isNew: true,
    isFeatured: false,
    isSaved: false,
    createdAt: new Date(),
    client: { name: 'Your Company', rating: 0, isVerified: false },
  };

  if (submitted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <ClientHeader />
          <div className="pt-24 flex items-center justify-center px-4 py-16">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted!</h2>
              <p className="text-gray-500 mb-6">Your job is now live and freelancers can start submitting proposals.</p>
              <div className="space-y-3">
                <button onClick={() => router.push('/my-jobs')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                  View My Jobs
                </button>
                <button onClick={() => router.push('/client-dashboard')} className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <ClientHeader />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
                <span className="text-sm font-semibold text-gray-500">Step {step} of 4</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Form */}
              <div className="flex-1 min-w-0">
                {/* Step 1 */}
                {step === 1 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                        placeholder="e.g. Full Stack Developer for E-commerce Platform"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <select name="category" value={formData.category} onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white">
                          <option value="">Select category</option>
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory *</label>
                        <select name="subcategory" value={formData.subcategory} onChange={handleInputChange}
                          disabled={!formData.category}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white disabled:bg-gray-50">
                          <option value="">Select subcategory</option>
                          {formData.category && SUBCATEGORIES[formData.category]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange}
                        placeholder="Describe the job in detail. Include project overview, responsibilities, requirements, and timeline..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none" />
                      <p className="text-xs text-gray-400 mt-1">{formData.description.length} characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills *</label>
                      <div className="flex gap-2 mb-3">
                        <input type="text" value={formData.skillInput} onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          placeholder="Add a skill and press Enter"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                        <button onClick={addSkill} className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200 flex items-center gap-2">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="text-green-400 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Budget Type *</label>
                      <div className="flex gap-3">
                        {['fixed', 'hourly'].map(type => (
                          <button key={type} onClick={() => setFormData(prev => ({ ...prev, budgetType: type }))}
                            className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all capitalize ${
                              formData.budgetType === type
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-gray-200 text-gray-600 hover:border-green-300'
                            }`}>
                            {type === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.budgetType === 'fixed' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Budget ($) *</label>
                          <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleInputChange}
                            placeholder="1000"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Budget ($) *</label>
                          <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleInputChange}
                            placeholder="5000"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rate ($/hr) *</label>
                          <input type="number" name="hourlyMin" value={formData.hourlyMin} onChange={handleInputChange}
                            placeholder="25"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Rate ($/hr) *</label>
                          <input type="number" name="hourlyMax" value={formData.hourlyMax} onChange={handleInputChange}
                            placeholder="100"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project Duration *</label>
                      <select name="duration" value={formData.duration} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white">
                        <option value="">Select duration</option>
                        {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
                      <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white">
                        <option value="">Select level</option>
                        {EXPERIENCE_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
                      <select name="visibility" value={formData.visibility} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all bg-white">
                        <option value="public">Public - All freelancers can see</option>
                        <option value="private">Private - Invite only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Screening Questions (Optional)</label>
                      <div className="flex gap-2 mb-3">
                        <input type="text" value={formData.questionInput} onChange={(e) => setFormData(prev => ({ ...prev, questionInput: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                          placeholder="e.g. What's your experience with React?"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
                        <button onClick={addQuestion} className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.questions.map((q, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{q}</span>
                            <button onClick={() => removeQuestion(i)} className="text-gray-400 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 - Review */}
                {step === 4 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Job</h2>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Title</span>
                        <span className="font-semibold text-gray-900">{formData.title}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Category</span>
                        <span className="font-semibold text-gray-900">{formData.category} - {formData.subcategory}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Budget</span>
                        <span className="font-semibold text-gray-900">
                          {formData.budgetType === 'fixed' ? `$${formData.budgetMin} - $${formData.budgetMax}` : `$${formData.hourlyMin} - $${formData.hourlyMax}/hr`}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-semibold text-gray-900">{formData.duration}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Experience Level</span>
                        <span className="font-semibold text-gray-900">{formData.experienceLevel}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Skills Required</span>
                        <span className="font-semibold text-gray-900">{formData.skills.length} skills</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-gray-500">Visibility</span>
                        <span className="font-semibold text-gray-900 capitalize">{formData.visibility}</span>
                      </div>
                    </div>
                    <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-800">
                        ✓ Your job will be posted immediately and visible to freelancers. You can edit or close it anytime from your dashboard.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft size={18} /> Back
                  </button>
                  {step < 4 ? (
                    <button onClick={() => setStep(step + 1)}
                      disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : !isStep3Valid}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Next <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50">
                      {submitting ? <><Loader2 size={18} className="animate-spin" /> Posting...</> : <>Post Job</>}
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="sticky top-24">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Live Preview</h3>
                  <JobCard job={previewJob} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
