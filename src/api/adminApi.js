import axios from "axios";

// Use environment variable or fallback to Render URL
const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "https://saimr-backend-1.onrender.com";
const ADMIN_BASE_URL = `${base}/api/admin`;

const API = axios.create({
  baseURL: ADMIN_BASE_URL,
  timeout: 30000,
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log('🔑 Adding token to admin request');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('❌ No token found in localStorage');
  }
  return config;
});

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('✅ Admin API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Admin API Error:', error.config?.url, error.response?.status, error.message);
    
    // Handle unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Click Analytics Endpoints
export const fetchClickAnalytics = (timeframe = '7d', type, propertyId) => {
  const params = { timeframe };
  if (type) params.type = type;
  if (propertyId) params.propertyId = propertyId;
  
  console.log('📊 Fetching click analytics with params:', params);
  return API.get("/analytics/clicks", { params });
};

export const fetchClickStatsByType = (timeframe = '30d') => {
  console.log('📈 Fetching click stats by type for timeframe:', timeframe);
  return API.get("/analytics/clicks/by-type", { params: { timeframe } });
};

export const fetchPopularClicks = (timeframe = '7d', limit = 10) => {
  console.log('🏆 Fetching popular clicks:', { timeframe, limit });
  return API.get("/analytics/clicks/popular", { 
    params: { timeframe, limit: parseInt(limit) } 
  });
};

export const fetchClickTrends = (timeframe = '30d', groupBy = 'day') => {
  console.log('📅 Fetching click trends:', { timeframe, groupBy });
  return API.get("/analytics/clicks/trends", { 
    params: { timeframe, groupBy } 
  });
};

// User Analytics Endpoints
export const fetchUserAnalytics = async (timeframe = '30d', userId = null) => {
  try {
    const params = { timeframe };
    if (userId) params.userId = userId;
    
    console.log('👤 Fetching user analytics:', params);
    const response = await API.get("/analytics/users", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCompleteAnalytics = async (timeframe = '7d', includeRawData = false) => {
  try {
    const response = await API.get("/analytics/clicks", { 
      params: { timeframe, includeRawData, limit: 500 } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRawClickData = async (params = {}) => {
  try {
    const response = await API.get("/analytics/clicks/raw", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserSessions = async (timeframe = '7d', limit = 50) => {
  try {
    const response = await API.get("/analytics/clicks/sessions", { 
      params: { timeframe, limit } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const trackClick = async (clickData) => {
  try {
    const response = await API.post("/analytics/track", clickData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportClickData = async (format = 'json', timeframe = '30d') => {
  try {
    console.log('📥 Exporting click data:', { format, timeframe });
    
    const response = await API.get("/analytics/clicks/export", {
      params: { format, timeframe },
      responseType: format === 'csv' ? 'blob' : 'json'
    });

    if (format === 'csv') {
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `click-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true, message: 'CSV exported successfully' };
    } else {
      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `click-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true, message: 'JSON exported successfully' };
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

export const fetchHourlyDistribution = async (timeframe = '7d', groupBy = 'hour') => {
  try {
    console.log('🕒 Fetching hourly distribution for timeframe:', timeframe);
    
    const response = await API.get("/analytics/clicks/hourly", { 
      params: { timeframe, groupBy } 
    });
    
    console.log('✅ Hourly distribution API response:', response.data);
    
    if (response.data.success && response.data.data) {
      console.log('📊 Detailed data structure:');
      console.log('- Hourly distribution array length:', response.data.data.hourlyDistribution?.length);
      console.log('- First hour data:', response.data.data.hourlyDistribution?.[0]);
      console.log('- Summary:', response.data.data.summary);
      console.log('- Total clicks:', response.data.data.summary?.totalClicks);
      
      const activeHours = response.data.data.hourlyDistribution?.filter(hour => hour.clicks > 0);
      console.log('- Active hours:', activeHours);
    }
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Hourly distribution fetch error:', error);
    throw error;
  }
};

// Test connection first
export const testConnection = () => API.get("/test");

// Property Management
export const fetchPendingProperties = () => API.get("/properties/pending");
export const fetchPropertiesByStatus = (status) => API.get(`/properties?status=${status}`);
export const approveProperty = (id) => API.put(`/properties/approve/${id}`);
export const rejectProperty = (id, reason) => API.put(`/properties/reject/${id}`, { reason });
export const toggleFeatured = (id) => API.put(`/properties/feature/${id}`);
export const fetchAllUsers = (page = 1, limit = 10, search = '') => 
  API.get(`/users?page=${page}&limit=${limit}&search=${search}`);
export const fetchUserById = (id) => API.get(`/users/${id}`);

// Property Management
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

export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const patchProperty = (id, data) => API.patch(`/properties/${id}`, data);