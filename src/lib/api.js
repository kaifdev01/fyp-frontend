import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://fyp-backend-liard-eight.vercel.app",

  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's an inactivity logout
    if (error.response?.data?.code === "INACTIVE_LOGOUT") {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");

      // Redirect to login
      window.location.href = "/login?message=Session expired due to inactivity";
    }

    return Promise.reject(error);
  }
);

export default api;
