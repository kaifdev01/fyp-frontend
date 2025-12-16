"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import axios from 'axios';
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../components/Header";

export default function CompleteProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profileData, setProfileData] = useState({
    companySize: "",
    companyName: "",
    website: "",
  });

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
        // Only redirect to signup if no email, no session, and no token
        const timer = setTimeout(() => {
          router.push("/signup");
        }, 2000); // Give more time for OAuth callback

        return () => clearTimeout(timer);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use OAuth endpoint if user came from OAuth, regular endpoint otherwise
      const endpoint = session?.user?.email
        ? "complete-oauth-profile"
        : "complete-profile";

      const response = await api.post(`/api/auth/${endpoint}`, {
        email: userEmail,
        companyName: profileData.companyName,
        companySize: profileData.companySize,
        website: profileData.website,
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many people are in your company?
                </label>
                <select
                  name="companySize"
                  value={profileData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-all duration-200"
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
                  Company name
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter your company name"
                  value={profileData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-all duration-200"
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
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-all duration-200"
                />
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
