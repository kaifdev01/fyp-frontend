import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://fyp-backend-liard-eight.vercel.app",
  // "http://localhost:5000",
  withCredentials: true, // Important for cookies/sessions if you use them
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
