// api/adminApi.js
import axios from 'axios';

const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "https://saimr-backend-1.onrender.com";
const ADMIN_BASE_URL = `${base}/api/admin`;

const API = axios.create({
  baseURL: ADMIN_BASE_URL,
  timeout: 15000, // Reduced timeout
  withCredentials: true,
});

// Enhanced request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No auth token found');
  }
  
  // Ensure CORS headers
  config.headers['Content-Type'] = 'application/json';
  
  console.log(`🔐 Admin API: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Enhanced response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`✅ Admin API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    };
    
    console.error('❌ Admin API Error:', errorDetails);

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (error.response?.status === 403) {
      throw new Error('Access denied. Admin privileges required.');
    }

    if (!error.response) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }

    // Backend is up but returned error
    const backendError = error.response.data?.message || error.response.data?.error;
    if (backendError) {
      throw new Error(backendError);
    }

    throw error;
  }
);

// Add retry mechanism for critical requests
const fetchWithRetry = async (apiCall, retries = 2) => {
  try {
    return await apiCall();
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || !error.response)) {
      console.log(`🔄 Retrying request... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(apiCall, retries - 1);
    }
    throw error;
  }
};

// Update your API calls to use retry for critical ones
export const fetchAllProperties = (params = {}) => {
  console.log('📡 Fetching properties with params:', params);
  return fetchWithRetry(() => API.get("/properties/all", { params }));
};

export const fetchPendingProperties = () => {
  return fetchWithRetry(() => API.get("/properties/pending"));
};

// Click Analytics Endpoints
export const fetchClickAnalytics = (timeframe = '7d', type, propertyId) => {
  const params = { timeframe };
  if (type) params.type = type;
  if (propertyId) params.propertyId = propertyId;
  
  console.log('📊 Fetching click analytics with params:', params);
  return fetchWithRetry(() => API.get("/analytics/clicks", { params }));
};

export const fetchClickStatsByType = (timeframe = '30d') => {
  console.log('📈 Fetching click stats by type for timeframe:', timeframe);
  return fetchWithRetry(() => API.get("/analytics/clicks/by-type", { params: { timeframe } }));
};

export const fetchPopularClicks = (timeframe = '7d', limit = 10) => {
  console.log('🏆 Fetching popular clicks:', { timeframe, limit });
  return fetchWithRetry(() => API.get("/analytics/clicks/popular", { 
    params: { timeframe, limit: parseInt(limit) } 
  }));
};

export const fetchClickTrends = (timeframe = '30d', groupBy = 'day') => {
  console.log('📅 Fetching click trends:', { timeframe, groupBy });
  return fetchWithRetry(() => API.get("/analytics/clicks/trends", { 
    params: { timeframe, groupBy } 
  }));
};

// User Analytics Endpoints
export const fetchUserAnalytics = async (timeframe = '30d', userId = null) => {
  try {
    const params = { timeframe };
    if (userId) params.userId = userId;
    
    console.log('👤 Fetching user analytics:', params);
    const response = await fetchWithRetry(() => API.get("/analytics/users", { params }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCompleteAnalytics = async (timeframe = '7d', includeRawData = false) => {
  try {
    const response = await fetchWithRetry(() => API.get("/analytics/clicks", { 
      params: { timeframe, includeRawData, limit: 500 } 
    }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRawClickData = async (params = {}) => {
  try {
    const response = await fetchWithRetry(() => API.get("/analytics/clicks/raw", { params }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserSessions = async (timeframe = '7d', limit = 50) => {
  try {
    const response = await fetchWithRetry(() => API.get("/analytics/clicks/sessions", { 
      params: { timeframe, limit } 
    }));
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
    
    const response = await fetchWithRetry(() => API.get("/analytics/clicks/export", {
      params: { format, timeframe },
      responseType: format === 'csv' ? 'blob' : 'json'
    }));

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
    
    const response = await fetchWithRetry(() => API.get("/analytics/clicks/hourly", { 
      params: { timeframe, groupBy } 
    }));
    
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
export const fetchPropertiesByStatus = (status) => fetchWithRetry(() => API.get(`/properties?status=${status}`));
export const approveProperty = (id) => API.put(`/properties/approve/${id}`);
export const rejectProperty = (id, reason) => API.put(`/properties/reject/${id}`, { reason });
export const toggleFeatured = (id) => API.put(`/properties/feature/${id}`);
export const fetchAllUsers = (page = 1, limit = 10, search = '') => 
  fetchWithRetry(() => API.get(`/users?page=${page}&limit=${limit}&search=${search}`));
export const fetchUserById = (id) => fetchWithRetry(() => API.get(`/users/${id}`));

// Property Management
export const updatePropertyOrder = (id, data) => 
  API.put(`/properties/order/${id}`, data);

export const bulkUpdateProperties = (data) => 
  API.put("/properties/bulk-update", data);

export const fetchPropertyStats = () => 
  fetchWithRetry(() => API.get("/properties/stats"));

export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const patchProperty = (id, data) => API.patch(`/properties/${id}`, data);