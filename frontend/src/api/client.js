import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all outgoing requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor to detect HTML SPA fallbacks
api.interceptors.response.use(
  (response) => {
    // If hosting (Netlify/Vercel) rewrites an unknown /api route to index.html,
    // axios receives a string starting with <!DOCTYPE html> instead of parsed JSON.
    if (
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!DOCTYPE') ||
       response.data.trim().startsWith('<!doctype') ||
       response.data.trim().startsWith('<html'))
    ) {
      console.warn('API returned HTML document instead of JSON (Netlify SPA fallback detected). Backend API is either not deployed or VITE_API_BASE_URL is not set.');
      const err = new Error('API server returned HTML SPA fallback');
      err.isHtmlFallback = true;
      err.config = response.config;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn('Session expired. Logging out.');
    }
    return Promise.reject(error);
  }
);

export default api;
