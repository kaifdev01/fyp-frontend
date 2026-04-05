'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerHeader from '../../../components/FreelancerHeader';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Flag, ArrowLeft, Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const MOCK_JOBS = [
  { id: 1, title: 'React Dashboard Development', client: 'TechCorp Inc.', amount: 2500, status: 'active' },
  { id: 2, title: 'Backend API Development', client: 'TechCorp Inc.', amount: 4800, status: 'active' },
  { id: 3, title: 'Mobile App UI Design', client: 'FoodRush', amount: 1400, status: 'active' },
  { id: 4, title: 'WordPress Website Redesign', client: 'Creative Agency', amount: 1200, status: 'active' },
];

const DISPUTE_REASONS = [
  { value: 'quality_issues', label: 'Quality Issues with Deliverables' },
  { value: 'delayed_delivery', label: 'Delayed Delivery' },
  { value: 'incomplete_work', label: 'Incomplete Work' },
  { value: 'payment_not_released', label: 'Payment Not Released from Escrow' },
  { value: 'scope_mismatch', label: 'Work Does Not Match Job Description' },
  { value: 'communication_issues', label: 'Communication Issues' },
  { value: 'other', label: 'Other' },
];

export default function FileDisputePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobId: '',
    reason: '',
    description: '',
    priority: 'medium',
    evidence: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState('freelancer');

  // Get user role from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || 'freelancer');
      } catch (e) {
        setUserRole('freelancer');
      }
    }
  }, []);

  const selectedJob = MOCK_JOBS.find(j => j.id === parseInt(formData.jobId));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ...files.map(f => ({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB' }))]
    }));
  };

  const removeEvidence = (index) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobId) newErrors.jobId = 'Please select a job';
    if (!formData.reason) newErrors.reason = 'Please select a dispute reason';
    if (!formData.description.trim()) newErrors.description = 'Please provide a description';
    if (formData.description.trim().length < 50) newErrors.description = 'Description must be at least 50 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <FreelancerHeader />
          <div className="pt-24 pb-16 px-4 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Dispute Filed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your dispute has been submitted. Our team will review it and contact you within 24 hours.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/disputes')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View My Disputes
                </button>
                <button
                  onClick={() => router.push('/freelancer-dashboard')}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
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
        {userRole === 'client' ? <ClientHeader /> : <FreelancerHeader />}

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Back
              </button>

              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Flag className="text-red-600" size={32} />
                File a Dispute
              </h1>
              <p className="text-gray-600">Report an issue with a job or contract</p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <div className="flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Before Filing a Dispute</p>
                  <p className="text-sm text-blue-800">
                    Please try to resolve the issue directly with the other party first. Disputes should only be filed when direct communication has failed.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">

              {/* Job Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Job <span className="text-red-600">*</span>
                </label>
                <select
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm ${
                    errors.jobId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a job...</option>
                  {MOCK_JOBS.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} - ${job.amount.toLocaleString()} ({job.client})
                    </option>
                  ))}
                </select>
                {errors.jobId && <p className="text-red-600 text-sm mt-1">{errors.jobId}</p>}
              </div>

              {/* Job Details */}
              {selectedJob && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Job Title</p>
                      <p className="font-semibold text-gray-900">{selectedJob.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Amount</p>
                      <p className="font-semibold text-gray-900">${selectedJob.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Client</p>
                      <p className="font-semibold text-gray-900">{selectedJob.client}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Status</p>
                      <p className="font-semibold text-gray-900 capitalize">{selectedJob.status}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute Reason */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Dispute Reason <span className="text-red-600">*</span>
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm ${
                    errors.reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a reason...</option>
                  {DISPUTE_REASONS.map(reason => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Priority</label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map(priority => (
                    <label key={priority} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the dispute. Include what happened, when it happened, and what you expect as resolution."
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">{formData.description.length} characters</p>
                  {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
                </div>
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Evidence (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-gray-500 mb-3">Supported: Images, PDFs, Documents (Max 10MB each)</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm cursor-pointer">
                    Choose Files
                  </label>
                </div>

                {/* Evidence List */}
                {formData.evidence.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-900">Uploaded Files ({formData.evidence.length})</p>
                    {formData.evidence.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 flex-1">
                          <Upload size={16} className="text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEvidence(idx)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-yellow-900">
                  <span className="font-semibold">Important:</span> Filing a false dispute may result in account suspension. Please ensure all information is accurate and truthful.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Filing...
                    </>
                  ) : (
                    <>
                      <Flag size={18} />
                      File Dispute
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
