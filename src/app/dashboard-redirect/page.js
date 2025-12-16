"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import axios from 'axios';
import api from "../../lib/api";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const handleOAuthUser = async () => {
      if (status === "loading") return;

      if (session?.user?.email) {
        try {
          // Try to login with OAuth email to check if user exists
          const response = await api.post("/api/auth/login", {
            email: session.user.email,
            password: "oauth-check", // This will fail but we check if user exists
          });

          // User exists - store token and redirect to dashboard
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          const userRole = response.data.user.role;
          router.push(
            userRole === "client"
              ? "/client-dashboard"
              : "/freelancer-dashboard"
          );
        } catch (error) {
          // User doesn't exist - redirect to signup for role selection
          if (
            error.response?.status === 401 ||
            error.response?.status === 404
          ) {
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
