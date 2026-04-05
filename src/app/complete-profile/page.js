"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import axios from 'axios';
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../components/Header";
import { X, Upload } from "lucide-react";

export default function CompleteProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profileData, setProfileData] = useState({
    companySize: "",
    companyName: "",
    website: "",
    industry: "",
    companyDescription: "",
    companyLogo: null,
    phone: "",
    budgetRange: "",
    preferredSkills: [],
    projectTypes: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [projectTypeInput, setProjectTypeInput] = useState("");

  // Get user email from localStorage, URL params, or session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email =
        localStorage.getItem("userEmail") ||
        new URLSearchParams(window.location.search).get("email");
      const token = localStorage.getItem("token");

      if (email) {
        setUserEmail(email);
      } else if (session?.user?.email) {
        // OAuth user - use session email
        setUserEmail(session.user.email);
      } else if (token) {
        // User is already authenticated, redirect to dashboard
        router.push("/client-dashboard");
      } else {
        // No authentication, redirect to login
        router.push("/login");
      }
    }
  }, [router, session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        companyLogo: file,
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profileData.preferredSkills.includes(skillInput.trim()) && profileData.preferredSkills.length < 10) {
      setProfileData(prev => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setProfileData(prev => ({
      ...prev,
      preferredSkills: prev.preferredSkills.filter(s => s !== skill)
    }));
  };

  const addProjectType = () => {
    if (projectTypeInput.trim() && !profileData.projectTypes.includes(projectTypeInput.trim()) && profileData.projectTypes.length < 5) {
      setProfileData(prev => ({
        ...prev,
        projectTypes: [...prev.projectTypes, projectTypeInput.trim()]
      }));
      setProjectTypeInput("");
    }
  };

  const removeProjectType = (type) => {
    setProfileData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.filter(t => t !== type)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use OAuth endpoint if user came from OAuth, regular endpoint otherwise
      const endpoint = session?.user?.email
        ? "complete-oauth-profile"
        : "complete-profile";

      let logoUrl = "";
      if (profileData.companyLogo) {
        try {
          const { uploadImageToCloudinary } = await import("../../lib/cloudinary");
          const result = await uploadImageToCloudinary(profileData.companyLogo);
          logoUrl = result.url;
        } catch (error) {
          toast.error("Company logo upload failed");
          setLoading(false);
          return;
        }
      }

      const response = await api.post(`/api/auth/${endpoint}`, {
        email: userEmail,
        companyName: profileData.companyName,
        companySize: profileData.companySize,
        website: profileData.website,
        industry: profileData.industry,
        companyDescription: profileData.companyDescription,
        companyLogo: logoUrl,
        phone: profileData.phone,
        budgetRange: profileData.budgetRange,
        preferredSkills: profileData.preferredSkills,
        projectTypes: profileData.projectTypes,
        role: "client",
      });

      // Store authentication token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.removeItem("userEmail");
      localStorage.removeItem("oauthUserType");

      toast.success("Profile completed successfully!");
      setTimeout(() => {
        router.push("/client-dashboard");
      }, 1500);
    } catch (error) {
      if (error.response?.data?.existingRole) {
        const existingRole = error.response.data.existingRole;
        toast.error(
          `Account exists as ${existingRole}. Redirecting to ${existingRole} dashboard...`
        );
        setTimeout(() => {
          router.push(
            existingRole === "client"
              ? "/client-dashboard"
              : "/freelancer-dashboard"
          );
        }, 2000);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to complete profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />

      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-10">
            <h1 className="text-3xl font-bold text-center mb-3">
              Welcome to WorkDeck!
            </h1>
            <p className="text-gray-600 text-center mb-10">Tell us about you</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter your company name"
                    value={profileData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <input
                    type="text"
                    name="industry"
                    placeholder="e.g. Technology, Healthcare"
                    value={profileData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description *
                </label>
                <textarea
                  name="companyDescription"
                  placeholder="Tell us about your company..."
                  value={profileData.companyDescription}
                  onChange={handleInputChange}
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                  required
                />
                <p className="text-xs text-right text-gray-400 mt-1">
                  {profileData.companyDescription.length}/500
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size *
                  </label>
                  <select
                    name="companySize"
                    value={profileData.companySize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="1">Just me (1)</option>
                    <option value="2-10">Small team (2-10)</option>
                    <option value="11-50">Medium company (11-50)</option>
                    <option value="51-200">Large company (51-200)</option>
                    <option value="200+">Enterprise (200+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budgetRange"
                    value={profileData.budgetRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  >
                    <option value="">Select budget range</option>
                    <option value="<$1000">Less than $1,000</option>
                    <option value="$1000-$5000">$1,000 - $5,000</option>
                    <option value="$5000-$10000">$5,000 - $10,000</option>
                    <option value="$10000-$50000">$10,000 - $50,000</option>
                    <option value="$50000+">$50,000+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555)..."
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://yourcompany.com"
                    value={profileData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                    {profileData.companyLogo ? (
                      <img
                        src={URL.createObjectURL(profileData.companyLogo)}
                        alt="Logo Preview"
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
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all"
                    >
                      Upload Logo
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG max 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Skills <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="e.g. React, Python"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Types <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="e.g. Web Development, Mobile App"
                    value={projectTypeInput}
                    onChange={(e) => setProjectTypeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProjectType())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addProjectType}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.projectTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-100"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => removeProjectType(type)}
                        className="ml-2 text-green-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Completing Profile..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
