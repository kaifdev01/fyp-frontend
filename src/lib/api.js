import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://fyp-backend-blond.vercel.app",
  withCredentials: true, // Important for cookies/sessions if you use them
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
