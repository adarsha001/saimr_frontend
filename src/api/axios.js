// api/axios.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://saimr-backend-1.onrender.com';

const API = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 15000, // Reduced timeout from 30s to 15s
  withCredentials: true,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CORS headers
    config.headers['Content-Type'] = 'application/json';
    
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
      throw new Error('Request timeout. Please check your connection.');
    }

    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect here to avoid loops, handle in components
    }

    if (error.response?.status === 403) {
      console.log('🚫 Forbidden access');
      throw new Error('You do not have permission to access this resource.');
    }

    if (!error.response) {
      console.log('🌐 Network error - backend may be down');
      throw new Error('Network error. Please check your connection and try again.');
    }

    return Promise.reject(error);
  }
);

export default API;

export const getProperties = () => API.get("/properties");
export const getPropertyById = (id) => API.get(`/properties/${id}`);
export const createProperty = (formData) => API.post("/properties", formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Like APIs
export const likeProperty = (propertyId) => API.post(`/users/like/${propertyId}`);
export const unlikeProperty = (propertyId) => API.delete(`/users/like/${propertyId}`);
export const checkIfLiked = (propertyId) => API.get(`/users/like/${propertyId}/check`);
export const toggleLike = (propertyId) => API.post(`/users/like/${propertyId}/toggle`);
export const getAllProperties = () => API.get("/properties");