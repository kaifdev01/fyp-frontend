"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import axios from 'axios'; // Removed direct axios import
import api from "../../lib/api"; // Use centralized API
import toast, { Toaster } from "react-hot-toast";
import { User, Building2 } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../components/AuthLayout";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    agreeToTerms: false,
  });

  // Check for OAuth user data on component mount
  useEffect(() => {
    const oauthEmail = localStorage.getItem("oauthEmail");
    const oauthName = localStorage.getItem("oauthName");

    if (oauthEmail) {
      setIsOAuthUser(true);
      const nameParts = oauthName ? oauthName.split(" ") : ["", ""];
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: oauthEmail,
        agreeToTerms: true,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        // Used api.post
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        location: formData.country,
        role: userType,
      });

      console.log("Registration successful:", response.data);
      toast.success("OTP sent to your email!");
      setStep(3);
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otpCode = otp.join("");
      const response = await api.post("/api/auth/verify-otp", {
        // Used api.post
        email: formData.email,
        otp: otpCode,
      });

      console.log("OTP verification successful:", response.data);
      toast.success("Account created successfully!");
      setTimeout(() => {
        localStorage.setItem("userEmail", formData.email);
        if (userType === "client") {
          window.location.href = "/complete-profile";
        } else {
          window.location.href = "/freelancer-profile";
        }
      }, 1500);
    } catch (error) {
      console.error(
        "OTP verification failed:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/resend-otp", {
        // Used api.post
        email: formData.email,
      });

      toast.success("New OTP sent to your email!");
      setResendTimer(60);

      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!userType) {
      toast.error("Please select whether you are a freelancer or client first");
      return;
    }
    localStorage.setItem("selectedRole", userType);
    signIn("google", {
      callbackUrl: "/oauth-handler",
      redirect: true,
    });
  };

  const handleGitHubSignIn = () => {
    if (!userType) {
      toast.error("Please select whether you are a freelancer or client first");
      return;
    }
    localStorage.setItem("selectedRole", userType);
    signIn("github", {
      callbackUrl: "/oauth-handler",
      redirect: true,
    });
  };

  const getTitle = () => {
    if (step === 1) return "Join as a freelancer or client";
    if (step === 2) return `Sign up as a ${userType}`;
    if (step === 3) return "Verify your email";
    return "Sign Up";
  };

  const getSubtitle = () => {
    if (step === 1) return "Choose how you want to use WorkDeck";
    if (step === 2) return "Create your WorkDeck account";
    if (step === 3) return `We've sent a 6-digit code to ${formData.email}`;
    return "";
  };

  return (
    <AuthLayout title={getTitle()} subtitle={getSubtitle()}>
      <Toaster position="top-right" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                onClick={() => setUserType("freelancer")}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  userType === "freelancer"
                    ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-1">I'm a freelancer</h3>
                  <p className="text-sm text-gray-500">Looking for work</p>
                </div>
              </div>

              <div
                onClick={() => setUserType("client")}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  userType === "client"
                    ? "border-green-500 bg-green-50/50 shadow-md ring-2 ring-green-500/20"
                    : "border-gray-200 hover:border-green-300 hover:shadow-sm"
                }`}
              >
                <div className="text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-1">I'm a client</h3>
                  <p className="text-sm text-gray-500">Hiring for a project</p>
                </div>
              </div>
            </div>

            {userType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Continue as{" "}
                  {userType === "freelancer" ? "Freelancer" : "Client"}
                </button>
              </motion.div>
            )}

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-bold"
              >
                Log In
              </Link>
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3 mb-8">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleGitHubSignIn}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="#181717"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Work email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (8+ chars)"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>

              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                required
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-600 leading-tight">
                  I agree to the WorkDeck{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setStep(1)}
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Back to role selection
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-bold"
              >
                Log In
              </Link>
            </p>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleOtpSubmit} className="space-y-8">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otp.some((digit) => !digit)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                ← Back
              </button>
              <p className="text-sm text-gray-600">
                Didn't receive code?
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || loading}
                  className="text-blue-600 hover:underline font-bold disabled:opacity-50 disabled:cursor-not-allowed ml-1"
                >
                  {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend"}
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
