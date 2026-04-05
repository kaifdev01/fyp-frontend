'use client';
import { useState } from 'react';
import { FileCheck, Download, MessageSquare, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function DeliverableVerification({ contract, onClose }) {
  const [deliverables, setDeliverables] = useState(
    contract.deliverables.map((item, idx) => ({
      id: idx,
      name: item,
      verified: false,
      comment: '',
      status: 'pending'
    }))
  );
  const [overallComment, setOverallComment] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('pending');

  const handleVerifyDeliverable = (id) => {
    setDeliverables(deliverables.map(d =>
      d.id === id ? { ...d, verified: !d.verified, status: !d.verified ? 'verified' : 'pending' } : d
    ));
  };

  const handleCommentChange = (id, comment) => {
    setDeliverables(deliverables.map(d =>
      d.id === id ? { ...d, comment } : d
    ));
  };

  const allVerified = deliverables.length > 0 && deliverables.every(d => d.verified);
  const hasComments = deliverables.some(d => d.comment) || overallComment;

  return (
    <div className="space-y-6">
      {/* Submission Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Submitted:</span> {contract.submittedDate ? new Date(contract.submittedDate).toLocaleDateString() : 'Not yet submitted'}
        </p>
      </div>

      {/* Deliverables List */}
      {contract.deliverables.length > 0 ? (
        <div className="space-y-4">
          <p className="font-semibold text-gray-900 mb-4">Review Deliverables:</p>

          {deliverables.map((deliverable) => (
            <div key={deliverable.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <FileCheck className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{deliverable.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(contract.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  title="Download deliverable"
                >
                  <Download size={18} />
                </button>
              </div>

              {/* Verification Checkbox */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={deliverable.verified}
                  onChange={() => handleVerifyDeliverable(deliverable.id)}
                  className="w-4 h-4 text-green-600 rounded cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                  Mark as verified
                </label>
                {deliverable.verified && (
                  <CheckCircle className="text-green-600" size={18} />
                )}
              </div>

              {/* Comment Section */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                  <MessageSquare size={14} className="inline mr-1" />
                  Verification Notes
                </label>
                <textarea
                  value={deliverable.comment}
                  onChange={(e) => handleCommentChange(deliverable.id, e.target.value)}
                  placeholder="Add comments about this deliverable (quality, issues, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  rows="2"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <FileCheck className="mx-auto mb-3 text-yellow-600" size={32} />
          <p className="text-sm text-yellow-900 font-semibold">No deliverables submitted yet</p>
          <p className="text-xs text-yellow-700 mt-1">Waiting for freelancer to submit work</p>
        </div>
      )}

      {/* Overall Comment */}
      {contract.deliverables.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Overall Verification Comment
          </label>
          <textarea
            value={overallComment}
            onChange={(e) => setOverallComment(e.target.value)}
            placeholder="Add overall feedback about the deliverables quality and approval decision..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            rows="3"
          />
        </div>
      )}

      {/* Verification Summary */}
      {contract.deliverables.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-900">Verification Status</p>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              allVerified
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {allVerified ? 'All Verified' : `${deliverables.filter(d => d.verified).length}/${deliverables.length} verified`}
            </span>
          </div>
          <div className="space-y-2">
            {deliverables.map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-sm">
                {d.verified ? (
                  <CheckCircle className="text-green-600" size={16} />
                ) : (
                  <AlertCircle className="text-yellow-600" size={16} />
                )}
                <span className="text-gray-700">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">Note:</span> Verify all deliverables and add comments before approving payment. You can still approve payment even if not all deliverables are marked as verified.
        </p>
      </div>
    </div>
  );
}
