import axios from "axios";

const API = axios.create({
  baseURL: "https://saimr-backend-1.onrender.com/api/admin",
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log('🔑 Adding token to request:', token.substring(0, 20) + '...');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('❌ No token found in localStorage');
  }
  return config;
});

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Test connection first
export const testConnection = () => API.get("/test");

// Existing exports...
export const fetchPendingProperties = () => API.get("/properties/pending");
export const fetchPropertiesByStatus = (status) => API.get(`/properties?status=${status}`);
export const approveProperty = (id) => API.put(`/properties/approve/${id}`);
export const rejectProperty = (id, reason) => API.put(`/properties/reject/${id}`, { reason });
export const toggleFeatured = (id) => API.put(`/properties/feature/${id}`);
export const fetchAllUsers = (page = 1, limit = 10, search = '') => 
  API.get(`/users?page=${page}&limit=${limit}&search=${search}`);
export const fetchUserById = (id) => API.get(`/users/${id}`);

// New exports for property management
export const fetchAllProperties = (params = {}) => {
  console.log('📡 Fetching all properties with params:', params);
  return API.get("/properties/all", { params });
};

export const updatePropertyOrder = (id, data) => 
  API.put(`/properties/order/${id}`, data);

export const bulkUpdateProperties = (data) => 
  API.put("/properties/bulk-update", data);

export const fetchPropertyStats = () => 
  API.get("/properties/stats");

// Add to your existing adminApi.js
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const patchProperty = (id, data) => API.patch(`/properties/${id}`, data);
// Add to your adminApi.js
// export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);