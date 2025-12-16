"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import axios from 'axios';
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import { X, Upload, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";

const skillSuggestions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "HTML",
  "CSS",
  "TypeScript",
  "Vue.js",
  "Angular",
  "Express.js",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Git",
  "GraphQL",
  "REST API",
  "UI/UX Design",
  "Figma",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Sketch",
  "WordPress",
  "Shopify",
  "Digital Marketing",
  "SEO",
  "Content Writing",
  "Copywriting",
  "Social Media Marketing",
  "Data Analysis",
  "Machine Learning",
  "AI",
  "Next Js",
  "Blockchain",
  "Mobile Development",
  "iOS",
  "Android",
  "Flutter",
  "React Native",
];

export default function FreelancerProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "",
    phone: "",
    profileImage: null,
    hourlyRate: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token");

      if (email) {
        setUserEmail(email);
      } else if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else if (token) {
        router.push("/freelancer-dashboard");
      } else {
        // Allow brief delay for session to load, but redirect if truly unauthenticated
        const timer = setTimeout(() => {
          if (!session && !token && !email) router.push("/signup");
        }, 2000);
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

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    setShowSuggestions(value.length > 0);
  };

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 10) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput("");
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const filteredSuggestions = skillSuggestions.filter(
    (skill) =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1 && selectedSkills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = session?.user?.email
        ? "complete-oauth-profile"
        : "complete-freelancer-profile";

      const response = await api.post(`/api/auth/${endpoint}`, {
        email: userEmail, // Ensure this fallback works if state is empty but localStorage has it
        bio: profileData.bio,
        skills: selectedSkills.join(", "),
        phone: profileData.phone,
        hourlyRate: profileData.hourlyRate,
        role: "freelancer",
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.removeItem("userEmail");
      localStorage.removeItem("oauthUserType");

      toast.success("Profile completed successfully!");
      setTimeout(() => {
        router.push("/freelancer-dashboard");
      }, 1500);
    } catch (error) {
      if (error.response?.data?.existingRole) {
        const existingRole = error.response.data.existingRole;
        toast.error(`Account exists as ${existingRole}. Redirecting...`);
        setTimeout(() => {
          router.push(
            existingRole === "client"
              ? "/client-dashboard"
              : "/freelancer-dashboard"
          );
        }, 2000);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to complete profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Expertise", description: "What do you do?" },
    { number: 2, title: "Details", description: "Rates & Photo" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Complete Your Profile
            </h1>
            <div className="flex justify-center items-center space-x-4">
              {steps.map((s, idx) => (
                <div key={s.number} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                      step >= s.number
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}
                  >
                    {step > s.number ? <Check size={20} /> : s.number}
                  </div>
                  <div
                    className={`ml-3 ${
                      step >= s.number ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-xs">{s.description}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-20 h-1 mx-6 rounded-full ${
                        step > s.number ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleNextStep}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        Tell us about yourself
                      </h2>
                      <p className="text-gray-500 mb-6">
                        Write a bio to connect with clients.
                      </p>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Professional Bio
                      </label>
                      <textarea
                        name="bio"
                        placeholder="I am a Full Stack Developer with 5 years of experience..."
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-gray-700"
                        required
                      />
                      <p className="text-xs text-right text-gray-400 mt-1">
                        {profileData.bio.length} chars
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Skills & Expertise
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. React, Python (Press Enter)"
                          value={skillInput}
                          onChange={handleSkillInputChange}
                          onKeyPress={handleSkillKeyPress}
                          onFocus={() =>
                            setShowSuggestions(skillInput.length > 0)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-xl">
                            {filteredSuggestions.slice(0, 8).map((skill) => (
                              <div
                                key={skill}
                                onClick={() => addSkill(skill)}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm transition-colors"
                              >
                                {skill}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
                        {selectedSkills.map((skill) => (
                          <motion.span
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={skill}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 group"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-blue-400 group-hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                        {selectedSkills.length === 0 && (
                          <span className="text-sm text-gray-400 italic">
                            No skills selected
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                      >
                        Next Step <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleFinalSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        Final Details
                      </h2>
                      <p className="text-gray-500 mb-6">
                        Set your rate and add a photo.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hourly Rate ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                              $
                            </span>
                            <input
                              type="number"
                              name="hourlyRate"
                              placeholder="0.00"
                              value={profileData.hourlyRate}
                              onChange={handleInputChange}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+1 (555)..."
                            value={profileData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Profile Photo
                      </label>
                      <div className="flex items-center gap-6 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
                          {profileData.profileImage ? (
                            <img
                              src={URL.createObjectURL(
                                profileData.profileImage
                              )}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="bg-blue-100 p-4 rounded-full">
                              <Upload size={24} className="text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label
                            htmlFor="photo-upload"
                            className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-all"
                          >
                            Upload Photo
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            JPG, PNG max 5MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft size={20} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? "Completing..." : "Complete Profile"}{" "}
                        <Check size={20} />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Live Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <h3 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider text-sm shadow-sm">
                  Live Preview
                </h3>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Banner/Header */}
                  <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                  <div className="px-8 pb-8">
                    {/* Avatar */}
                    <div className="relative -mt-12 mb-4 flex justify-between items-end">
                      <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          {profileData.profileImage ? (
                            <img
                              src={URL.createObjectURL(
                                profileData.profileImage
                              )}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-gray-300">
                              {userEmail ? userEmail[0].toUpperCase() : "U"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Available
                      </div>
                    </div>

                    {/* User Info */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {userEmail ? userEmail.split("@")[0] : "Your Name"}
                    </h2>
                    <p className="text-blue-600 font-medium mb-4">Freelancer</p>

                    <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100 mb-6">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                          Hourly Rate
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ${profileData.hourlyRate || "0"}
                          <span className="text-sm font-normal text-gray-500">
                            /hr
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                          Location
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          Remote
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">About</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {profileData.bio ||
                          "Your professional bio will appear here. Write something that highlights your experience and personality."}
                      </p>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.length > 0 ? (
                          selectedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            No skills added yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
