'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FreelancerHeader from '../../../components/FreelancerHeader';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { Flag, ArrowLeft, Send, Upload, Clock, CheckCircle, AlertCircle, X, MessageSquare, Calendar, DollarSign, User, FileText, Download } from 'lucide-react';

const MOCK_DISPUTE = {
  id: 1,
  jobTitle: 'React Dashboard Development',
  client: 'TechCorp Inc.',
  freelancer: 'John Developer',
  amount: 2500,
  status: 'open',
  priority: 'high',
  createdDate: '2024-01-25',
  updatedDate: '2024-01-28',
  reason: 'Quality issues with deliverables',
  description: 'The dashboard does not meet the specifications. Several components are not working as expected.',
  messages: [
    {
      id: 1,
      sender: 'TechCorp Inc.',
      senderType: 'client',
      message: 'The dashboard components are not functioning properly. The data table is not sorting correctly and the charts are not displaying.',
      timestamp: '2024-01-25T10:30:00',
      attachments: []
    },
    {
      id: 2,
      sender: 'John Developer',
      senderType: 'freelancer',
      message: 'I apologize for the issues. I have reviewed the code and found the bugs. I can fix them within 2 days. Can we extend the deadline?',
      timestamp: '2024-01-25T14:15:00',
      attachments: []
    },
    {
      id: 3,
      sender: 'TechCorp Inc.',
      senderType: 'client',
      message: 'The deadline was already extended once. We need this completed by end of week. If you cannot deliver, we want a refund.',
      timestamp: '2024-01-26T09:00:00',
      attachments: []
    },
    {
      id: 4,
      sender: 'John Developer',
      senderType: 'freelancer',
      message: 'I understand. I have fixed the issues and uploaded the corrected files. Please review and let me know if there are any remaining issues.',
      timestamp: '2024-01-27T16:45:00',
      attachments: [
        { id: 1, name: 'dashboard-fixed.zip', size: '2.4 MB', type: 'zip' }
      ]
    },
    {
      id: 5,
      sender: 'TechCorp Inc.',
      senderType: 'client',
      message: 'Still having issues. The sorting is working but the charts are still broken. This is not acceptable.',
      timestamp: '2024-01-28T11:20:00',
      attachments: []
    }
  ],
  resolution: null,
  evidence: []
};

const STATUS_CONFIG = {
  open: { bg: 'bg-red-100', text: 'text-red-700', label: 'Open', icon: AlertCircle },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress', icon: Clock },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved', icon: CheckCircle }
};

const PRIORITY_CONFIG = {
  low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Low' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
  high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' }
};

export default function DisputeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [dispute, setDispute] = useState(MOCK_DISPUTE);
  const [newMessage, setNewMessage] = useState('');
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false);
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [resolutionType, setResolutionType] = useState('');
  const [resolutionAmount, setResolutionAmount] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
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

  const StatusConfig = STATUS_CONFIG[dispute.status];
  const PriorityConfig = PRIORITY_CONFIG[dispute.priority];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: dispute.messages.length + 1,
      sender: 'You',
      senderType: 'user',
      message: newMessage,
      timestamp: new Date().toISOString(),
      attachments: []
    };

    setDispute(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    setNewMessage('');
  };

  const handleSubmitResolution = () => {
    if (!resolutionType || !resolutionNotes.trim()) return;

    setDispute(prev => ({
      ...prev,
      status: 'resolved',
      resolution: {
        type: resolutionType,
        amount: resolutionAmount ? parseFloat(resolutionAmount) : null,
        notes: resolutionNotes,
        resolvedDate: new Date().toISOString()
      }
    }));
    setShowResolutionForm(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {userRole === 'client' ? <ClientHeader /> : <FreelancerHeader />}

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Disputes
              </button>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Flag className="text-red-600" size={32} />
                    {dispute.jobTitle}
                  </h1>
                  <p className="text-gray-600">{dispute.reason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${StatusConfig.bg} ${StatusConfig.text}`}>
                      <StatusConfig.icon size={16} />
                      {StatusConfig.label}
                    </span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${PriorityConfig.bg} ${PriorityConfig.text}`}>
                      {PriorityConfig.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 mb-1">Client</p>
                <p className="font-semibold text-gray-900">{dispute.client}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 mb-1">Freelancer</p>
                <p className="font-semibold text-gray-900">{dispute.freelancer}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 mb-1">Amount</p>
                <p className="font-semibold text-gray-900">${dispute.amount.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600 mb-1">Created</p>
                <p className="font-semibold text-gray-900">{new Date(dispute.createdDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Messages */}
              <div className="lg:col-span-2 space-y-6">

                {/* Description */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Dispute Description</h2>
                  <p className="text-gray-600">{dispute.description}</p>
                </div>

                {/* Messages Thread */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Conversation ({dispute.messages.length} messages)</h2>
                  
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {dispute.messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.senderType === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold ${
                          msg.senderType === 'client' ? 'bg-blue-600' :
                          msg.senderType === 'freelancer' ? 'bg-green-600' :
                          'bg-gray-600'
                        }`}>
                          {msg.sender[0]}
                        </div>
                        <div className={`flex-1 ${msg.senderType === 'user' ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{msg.sender}</p>
                            <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
                          </div>
                          <div className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                            msg.senderType === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          {msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.attachments.map(att => (
                                <div key={att.id} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                  <Download size={14} />
                                  {att.name} ({att.size})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                      >
                        <Send size={16} />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* Evidence */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Evidence</h3>
                    <button
                      onClick={() => setShowEvidenceUpload(!showEvidenceUpload)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                    >
                      {showEvidenceUpload ? 'Cancel' : 'Upload'}
                    </button>
                  </div>

                  {showEvidenceUpload && (
                    <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                      <input type="file" className="hidden" />
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        Choose Files
                      </button>
                    </div>
                  )}

                  {dispute.evidence.length > 0 ? (
                    <div className="space-y-2">
                      {dispute.evidence.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600 flex-1">{file.name}</span>
                          <Download size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No evidence uploaded yet</p>
                  )}
                </div>

                {/* Resolution */}
                {dispute.status === 'open' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Resolve Dispute</h3>
                    
                    {!showResolutionForm ? (
                      <button
                        onClick={() => setShowResolutionForm(true)}
                        className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                      >
                        Propose Resolution
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Resolution Type</label>
                          <select
                            value={resolutionType}
                            onChange={(e) => setResolutionType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
                          >
                            <option value="">Select type...</option>
                            <option value="full_refund">Full Refund</option>
                            <option value="partial_refund">Partial Refund</option>
                            <option value="rework">Rework Required</option>
                            <option value="mutual_agreement">Mutual Agreement</option>
                          </select>
                        </div>

                        {(resolutionType === 'partial_refund') && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Refund Amount ($)</label>
                            <input
                              type="number"
                              value={resolutionAmount}
                              onChange={(e) => setResolutionAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Resolution Notes</label>
                          <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Explain the resolution..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm resize-none"
                            rows="3"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleSubmitResolution}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                          >
                            Submit Resolution
                          </button>
                          <button
                            onClick={() => setShowResolutionForm(false)}
                            className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Resolution Result */}
                {dispute.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-3">Resolution</h3>
                    <div className="space-y-2 text-sm text-green-800">
                      <p><span className="font-semibold">Type:</span> {dispute.resolution.type.replace(/_/g, ' ').toUpperCase()}</p>
                      {dispute.resolution.amount && (
                        <p><span className="font-semibold">Amount:</span> ${dispute.resolution.amount.toLocaleString()}</p>
                      )}
                      <p><span className="font-semibold">Notes:</span> {dispute.resolution.notes}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium text-gray-900">{new Date(dispute.createdDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium text-gray-900">{new Date(dispute.updatedDate).toLocaleDateString()}</span>
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
