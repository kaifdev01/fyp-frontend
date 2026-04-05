"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Upload, Check, ChevronLeft, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import FreelancerHeader from "../../components/FreelancerHeader";
import { uploadImageToCloudinary } from "../../lib/cloudinary";

export default function VerifyIdentity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [kycData, setKycData] = useState({
    documentType: "",
    documentNumber: "",
    documentImage: null,
    selfieImage: null,
    dateOfBirth: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserEmail(user.email);
        setKycStatus(user.kyc?.status || "not_started");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKycData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Document must be less than 5MB");
        return;
      }
      setKycData((prev) => ({
        ...prev,
        documentImage: file,
      }));
      setDocumentPreview(URL.createObjectURL(file));
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Selfie must be less than 5MB");
        return;
      }
      setKycData((prev) => ({
        ...prev,
        selfieImage: file,
      }));
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kycData.documentType) {
      toast.error("Please select a document type");
      return;
    }
    if (!kycData.documentNumber) {
      toast.error("Please enter document number");
      return;
    }
    if (!kycData.dateOfBirth) {
      toast.error("Please enter date of birth");
      return;
    }
    if (!kycData.country) {
      toast.error("Please select country");
      return;
    }
    if (!kycData.address) {
      toast.error("Please enter address");
      return;
    }
    if (!kycData.city) {
      toast.error("Please enter city");
      return;
    }
    if (!kycData.postalCode) {
      toast.error("Please enter postal code");
      return;
    }
    if (!documentPreview) {
      toast.error("Please upload document image");
      return;
    }
    if (!selfiePreview) {
      toast.error("Please upload selfie");
      return;
    }

    setLoading(true);

    try {
      let documentImageUrl = "";
      let selfieImageUrl = "";

      if (kycData.documentImage) {
        const result = await uploadImageToCloudinary(kycData.documentImage);
        documentImageUrl = result.url;
      }

      if (kycData.selfieImage) {
        const result = await uploadImageToCloudinary(kycData.selfieImage);
        selfieImageUrl = result.url;
      }

      const payload = {
        email: userEmail,
        kyc: {
          documentType: kycData.documentType,
          documentNumber: kycData.documentNumber,
          documentImage: documentImageUrl,
          selfieImage: selfieImageUrl,
          dateOfBirth: kycData.dateOfBirth,
          country: kycData.country,
          address: kycData.address,
          city: kycData.city,
          postalCode: kycData.postalCode,
        },
      };

      const response = await api.post("/api/auth/complete-freelancer-profile", payload);

      // Update local user data with new KYC status
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.kyc = { status: "pending" };
      localStorage.setItem("user", JSON.stringify(user));
      setKycStatus("pending");

      toast.success("Identity verification submitted successfully!");
      setTimeout(() => {
        router.push("/freelancer-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to submit verification."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    switch (kycStatus) {
      case "verified":
        return {
          icon: CheckCircle,
          color: "green",
          title: "Identity Verified",
          message: "Your identity has been successfully verified",
          showForm: false,
        };
      case "pending":
        return {
          icon: Clock,
          color: "amber",
          title: "Verification Pending",
          message: "Your identity verification is under review",
          showForm: false,
        };
      case "rejected":
        return {
          icon: AlertCircle,
          color: "red",
          title: "Verification Rejected",
          message: "Please try again with correct documents",
          showForm: true,
        };
      default:
        return {
          icon: AlertCircle,
          color: "gray",
          title: "Verify Your Identity",
          message: "Complete identity verification to unlock all features",
          showForm: true,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const colorClasses = {
    green: "bg-green-50 border-green-200",
    amber: "bg-amber-50 border-amber-200",
    red: "bg-red-50 border-red-200",
    gray: "bg-gray-50 border-gray-200",
  };

  const textClasses = {
    green: "text-green-700",
    amber: "text-amber-700",
    red: "text-red-700",
    gray: "text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <FreelancerHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
            >
              <ChevronLeft size={20} /> Back
            </button>

            <div className={`border-2 ${colorClasses[statusInfo.color]} rounded-2xl p-8`}>
              <div className="flex items-start gap-4">
                <StatusIcon size={32} className={textClasses[statusInfo.color]} />
                <div className="flex-1">
                  <h1 className={`text-2xl font-bold ${textClasses[statusInfo.color]} mb-2`}>
                    {statusInfo.title}
                  </h1>
                  <p className={`${textClasses[statusInfo.color]} opacity-80`}>
                    {statusInfo.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          {statusInfo.showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    name="documentType"
                    value={kycData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select document type</option>
                    <option value="passport">Passport</option>
                    <option value="nationalId">National ID</option>
                    <option value="drivingLicense">Driving License</option>
                  </select>
                </div>

                {/* Document Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Number
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    placeholder="Enter your document number"
                    value={kycData.documentNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={kycData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Enter your country"
                    value={kycData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your street address"
                    value={kycData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={kycData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal code"
                      value={kycData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Document Image
                  </label>
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
                      {documentPreview ? (
                        <img
                          src={documentPreview}
                          alt="Document"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDocumentUpload}
                        className="hidden"
                        id="document-upload"
                      />
                      <label
                        htmlFor="document-upload"
                        className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-all"
                      >
                        Upload Document
                      </label>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Selfie Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Selfie with Document
                  </label>
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
                      {selfiePreview ? (
                        <img
                          src={selfiePreview}
                          alt="Selfie"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelfieUpload}
                        className="hidden"
                        id="selfie-upload"
                      />
                      <label
                        htmlFor="selfie-upload"
                        className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-all"
                      >
                        Upload Selfie
                      </label>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? "Submitting..." : "Submit Verification"} <Check size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Verified State */}
          {kycStatus === "verified" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center"
            >
              <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Identity Verified
              </h2>
              <p className="text-gray-600 mb-6">
                Your identity has been successfully verified. You can now access all platform features.
              </p>
              <button
                onClick={() => router.push("/freelancer-dashboard")}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}

          {/* Pending State */}
          {kycStatus === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center"
            >
              <Clock size={64} className="text-amber-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Under Review
              </h2>
              <p className="text-gray-600 mb-6">
                Your identity verification is being reviewed by our team. This usually takes 24-48 hours.
              </p>
              <button
                onClick={() => router.push("/freelancer-dashboard")}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
