import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://pdf-extracter-011j.onrender.com";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`, // All API calls will be prefixed with /api
  withCredentials: true, // Important for sending/receiving cookies (JWT)
});

// We can add response interceptors here to handle global 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic to handle 401 (e.g., clear auth state and redirect)
      // This will be wired up with Zustand later
    }
    return Promise.reject(error);
  }
);
