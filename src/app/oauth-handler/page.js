"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import axios from 'axios';
import api from "../../lib/api";

export default function OAuthHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const handleOAuthFlow = async () => {
      if (status === "loading") return;

      if (session?.user?.email) {
        try {
          const provider = session.provider || "google";
          const providerId = session.user.id;
          const authFlow = localStorage.getItem("authFlow") || "login";
          const selectedRole = localStorage.getItem("selectedRole");

          console.log("Processing OAuth with:", {
            email: session.user.email,
            provider,
            providerId,
            role: selectedRole,
            flow: authFlow
          });

          // Call unified OAuth endpoint
          const response = await api.post("/api/auth/oauth-login", {
            email: session.user.email,
            name: session.user.name || session.user.email.split("@")[0],
            provider,
            providerId,
            ...(selectedRole && { role: selectedRole }),
          });

          // Store token and user data
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.removeItem("authFlow");
          localStorage.removeItem("selectedRole");

          // Handle routing based on user status
          if (response.data.needsRoleSelection) {
            // New user needs to select role
            localStorage.setItem("oauthEmail", session.user.email);
            localStorage.setItem("oauthName", session.user.name || "");
            router.push("/role-selection");
          } else if (response.data.needsProfileCompletion) {
            // User has role but needs to complete profile
            localStorage.setItem("userEmail", session.user.email);
            // Use the newly selected role for profile completion, not primary role
            const roleForProfile = selectedRole || response.data.user.primaryRole;
            router.push(
              roleForProfile === "client"
                ? "/complete-profile"
                : "/freelancer-profile"
            );
          } else {
            // No flags set - redirect to dashboard of selected role or primary role
            const redirectRole = selectedRole || response.data.user.primaryRole;
            router.push(
              redirectRole === "client"
                ? "/client-dashboard"
                : "/freelancer-dashboard"
            );
          }
        } catch (error) {
          console.error("OAuth flow failed:", error);
          const errorMsg =
            error.response?.data?.message || "Authentication failed";
          router.push(`/login?error=${encodeURIComponent(errorMsg)}`);
        }
      } else {
        router.push("/login?error=NoSessionEmail");
      }
      setChecking(false);
    };

    handleOAuthFlow();
  }, [session, status, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return null;
}
