import axios from 'axios';

// IMPORTANT: Ensure this URL matches your backend server's address and port.
// Your backend is running on port 8000, and routes are prefixed with /api.
const API_BASE_URL = 'http://localhost:8000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Request timeout after 10 seconds
  withCredentials: true, // Crucial for sending cookies/auth headers (like JWTs)
});

// Optional: Add an interceptor to include the Authorization header for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
