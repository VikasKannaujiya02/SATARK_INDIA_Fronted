import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://satark-india-backend.onrender.com')
    : '';

let lastErrorTime = 0;
const ERROR_COOLDOWN = 5000; // Show toast at most every 5 seconds

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/** Same-origin API (Next.js routes). Use for auth so login works without the backend. */
export const sameOriginApi = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('satark_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined') {
      const now = Date.now();
      
      // Handle Network Errors (Server Offline)
      if (!err.response && now - lastErrorTime > ERROR_COOLDOWN) {
        toast.error("🚨 Server Offline: Satark Engine is currently unreachable.", {
          id: 'server-offline-toast',
          duration: 4000
        });
        lastErrorTime = now;
      }

      // Handle Authentication Errors
      if (err.response?.status === 401) {
        localStorage.removeItem('satark_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);
