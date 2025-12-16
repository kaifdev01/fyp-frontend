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
          // Get provider info
          const provider = session.provider || "google"; // Default to google
          const providerId = session.user.id || session.user.email;

          // Call unified OAuth endpoint
          const response = await api.post("/api/auth/oauth-login", {
            email: session.user.email,
            name: session.user.name || session.user.email.split("@")[0],
            provider,
            providerId,
          });

          // Store token and user data
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // Handle routing based on user status
          if (response.data.needsRoleSelection) {
            // User needs to select role (new user or incomplete profile)
            const preSelectedRole = localStorage.getItem("selectedRole");
            localStorage.removeItem("selectedRole");

            if (preSelectedRole) {
              localStorage.setItem("preSelectedRole", preSelectedRole);
            }

            localStorage.setItem("oauthEmail", session.user.email);
            localStorage.setItem("oauthName", session.user.name || "");
            router.push("/role-selection");
          } else {
            // Existing user with complete profile - redirect to dashboard
            const userRole = response.data.user.primaryRole;
            router.push(
              userRole === "client"
                ? "/client-dashboard"
                : "/freelancer-dashboard"
            );
          }
        } catch (error) {
          console.error("OAuth flow failed:", error);
          router.push("/login");
        }
      } else {
        router.push("/login");
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
