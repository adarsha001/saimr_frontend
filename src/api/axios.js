import axios from 'axios';

// Use relative paths in production, full URL in development
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? 'https://saimr-backend-1.onrender.com/api'
  : '/api'; // Relative path in production - Vercel will proxy this

const API = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['Content-Type'] = 'application/json';
    
    // Log only in development to avoid console noise in production
    if (isDevelopment) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
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
    if (isDevelopment) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect here to avoid loops
    }

    if (error.response?.status === 403) {
      throw new Error('You do not have permission to access this resource.');
    }

    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    return Promise.reject(error);
  }
);

// API functions
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

export default API;