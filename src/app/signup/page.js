"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "../../components/AuthLayout";

// Modular Components
import RoleSelection from "../../components/signup/RoleSelection";
import SignupForm from "../../components/signup/SignupForm";
import OTPVerification from "../../components/signup/OTPVerification";

// Utils
import {
  countries,
  checkPasswordStrength,
} from "../../components/signup/signupUtils";

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    agreeToTerms: false,
  });

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

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    if (!fullName) {
      toast.error("Please enter your full name");
      return false;
    }

    if (!formData.email) {
      toast.error("Please enter your email");
      return false;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      toast.error("Please go back and select a role first");
      setStep(1);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await api.post("/api/auth/register", {
        name: fullName,
        email: formData.email,
        password: formData.password,
        location: formData.country,
        role: userType,
      });

      toast.success("OTP sent to your email!");
      setStep(3);
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length) {
        data.errors.forEach(e => toast.error(e.msg));
      } else {
        toast.error(data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Auto-uppercase the input
    const upperValue = value.toUpperCase();
    
    if (upperValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = upperValue;
      setOtp(newOtp);

      if (upperValue && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otpCode = otp.join("").toUpperCase();
      const response = await api.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: otpCode,
      });

      if (response.data.isAddingRole) {
        toast.success(`${response.data.newRole} role added successfully!`);
        setTimeout(() => {
          localStorage.setItem("userEmail", formData.email);
          window.location.href =
            response.data.newRole === "client"
              ? "/complete-profile"
              : "/freelancer-profile";
        }, 1500);
      } else {
        toast.success("Account created successfully!");
        setTimeout(() => {
          localStorage.setItem("userEmail", formData.email);
          window.location.href =
            userType === "client" ? "/complete-profile" : "/freelancer-profile";
        }, 1500);
      }
    } catch (error) {
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
      await api.post("/api/auth/resend-otp", { email: formData.email });
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
    if (!userType)
      return toast.error(
        "Please select whether you are a freelancer or client first"
      );
    localStorage.setItem("selectedRole", userType);
    localStorage.setItem("authFlow", "signup");
    signIn("google", { callbackUrl: "/oauth-handler", redirect: true });
  };

  const handleGitHubSignIn = () => {
    if (!userType)
      return toast.error(
        "Please select whether you are a freelancer or client first"
      );
    localStorage.setItem("selectedRole", userType);
    localStorage.setItem("authFlow", "signup");
    signIn("github", { callbackUrl: "/oauth-handler", redirect: true });
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
          <RoleSelection
            userType={userType}
            setUserType={setUserType}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <SignupForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleGoogleSignIn={handleGoogleSignIn}
            handleGitHubSignIn={handleGitHubSignIn}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            passwordStrength={passwordStrength}
            countries={countries}
            loading={loading}
            onBack={() => setStep(1)}
            userType={userType}
          />
        )}

        {step === 3 && (
          <OTPVerification
            otp={otp}
            handleOtpChange={handleOtpChange}
            handleOtpSubmit={handleOtpSubmit}
            loading={loading}
            resendTimer={resendTimer}
            handleResendOTP={handleResendOTP}
            onBack={() => setStep(2)}
          />
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
