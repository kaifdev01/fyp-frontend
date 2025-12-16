"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import axios from 'axios';
import api from "../../lib/api";

export default function OAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const handleOAuthUser = async () => {
      if (status === "loading") return;

      if (session?.user?.email) {
        try {
          // Check if user exists in database
          const checkResponse = await api.post("/api/auth/login", {
            email: session.user.email,
            password: "oauth-check", // This will fail but we just want to check if user exists
          });

          // If we get here, user exists - redirect to dashboard
          localStorage.setItem("token", checkResponse.data.token);
          localStorage.setItem("user", JSON.stringify(checkResponse.data.user));

          const userRole = checkResponse.data.user.role;
          router.push(
            userRole === "client"
              ? "/client-dashboard"
              : "/freelancer-dashboard"
          );
        } catch (error) {
          // User doesn't exist or wrong password - redirect to signup for role selection
          if (
            error.response?.status === 401 ||
            error.response?.status === 404
          ) {
            // Store OAuth email for signup process
            localStorage.setItem("oauthEmail", session.user.email);
            localStorage.setItem("oauthName", session.user.name || "");
            router.push("/signup");
          } else {
            console.error("OAuth check failed:", error);
            router.push("/login");
          }
        }
      } else {
        router.push("/login");
      }
      setChecking(false);
    };

    handleOAuthUser();
  }, [session, status, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
}
