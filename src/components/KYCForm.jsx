"use client";
import { useState } from "react";
import { Upload, X, ChevronLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function KYCForm({ kycData, setKycData, onBack, onSubmit, loading }) {
  const [documentPreview, setDocumentPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

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

  const handleSubmit = (e) => {
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

    onSubmit(e);
  };

  return (
    <motion.form
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Verify Your Identity
        </h2>
        <p className="text-gray-500 mb-6">
          Complete KYC verification to unlock all features and build trust with clients.
        </p>
      </div>

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

      {/* Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? "Verifying..." : "Complete Profile"} <Check size={20} />
        </button>
      </div>
    </motion.form>
  );
}
