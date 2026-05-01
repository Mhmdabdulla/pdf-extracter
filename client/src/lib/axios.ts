import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Using Vite proxy to handle CORS and routing
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
