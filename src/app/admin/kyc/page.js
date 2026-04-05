"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Check, X, Eye, Download, AlertCircle, RefreshCw } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";

export default function KYCVerification() {
  const router = useRouter();
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchKycs();
  }, [filter]);

  const fetchKycs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/kyc?status=${filter}`);
      setKycs(response.data.kycs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch KYC data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setActionLoading(true);
      await api.post(`/api/admin/kyc/${userId}/approve`);
      toast.success("KYC approved successfully");
      fetchKycs();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve KYC");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/api/admin/kyc/${userId}/reject`, {
        reason: rejectionReason,
      });
      toast.success("KYC rejected successfully");
      fetchKycs();
      setShowModal(false);
      setRejectionReason("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject KYC");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return badges[status] || badges.pending;
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      passport: "Passport",
      nationalId: "National ID",
      drivingLicense: "Driving License",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <AdminHeader />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              KYC Verification
            </h1>
            <p className="text-gray-600">
              Review and verify freelancer identity documents
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 items-center justify-between">
            <div className="flex gap-4">
              {["pending", "verified", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${filter === status
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchKycs()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>

          {/* KYC List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : kycs.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                No {filter} KYC submissions found
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {kycs.map((kyc) => (
                <div
                  key={kyc._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {kyc.user?.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{kyc.user?.email}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                        kyc.kyc?.status
                      )}`}
                    >
                      {kyc.kyc?.status?.charAt(0).toUpperCase() +
                        kyc.kyc?.status?.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-t border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Document Type
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {getDocumentTypeLabel(kyc.kyc?.documentType)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Document Number
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {kyc.kyc?.documentNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Date of Birth
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {kyc.kyc?.dateOfBirth
                          ? new Date(kyc.kyc.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Country
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {kyc.kyc?.country}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </p>
                      <p className="text-gray-600 text-sm">
                        {kyc.kyc?.address}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {kyc.kyc?.city}, {kyc.kyc?.postalCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Submission Date
                      </p>
                      <p className="text-gray-600 text-sm">
                        {new Date(kyc.createdAt).toLocaleDateString()} at{" "}
                        {new Date(kyc.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {kyc.kyc?.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-sm font-semibold text-red-900 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-red-800 text-sm">
                        {kyc.kyc.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedKyc(kyc);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
                    >
                      <Eye size={18} /> View Documents
                    </button>
                    {kyc.kyc?.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(kyc._id)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                        >
                          <Check size={18} /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedKyc(kyc);
                            setShowModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          <X size={18} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Modal */}
      {showModal && selectedKyc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                KYC Documents - {selectedKyc.user?.name}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Document Image */}
              {selectedKyc.kyc?.documentImage && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {getDocumentTypeLabel(selectedKyc.kyc?.documentType)}
                  </h3>
                  <img
                    src={selectedKyc.kyc.documentImage}
                    alt="Document"
                    className="w-full rounded-lg border border-gray-200 max-h-96 object-contain"
                  />
                </div>
              )}

              {/* Selfie Image */}
              {selectedKyc.kyc?.selfieImage && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Selfie with Document
                  </h3>
                  <img
                    src={selectedKyc.kyc.selfieImage}
                    alt="Selfie"
                    className="w-full rounded-lg border border-gray-200 max-h-96 object-contain"
                  />
                </div>
              )}

              {/* Rejection Reason Input */}
              {selectedKyc.kyc?.status === "pending" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why the KYC is being rejected..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {selectedKyc.kyc?.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedKyc._id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    <Check size={20} /> Approve KYC
                  </button>
                  <button
                    onClick={() => handleReject(selectedKyc._id)}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    <X size={20} /> Reject KYC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
