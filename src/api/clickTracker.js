import axios from "axios";

// Use environment variable or fallback to Render URL
const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "https://saimr-backend-1.onrender.com";
const PUBLIC_API_URL = `${base}/api`;

// Public API for click tracking (no authentication required)
const PublicAPI = axios.create({
  baseURL: PUBLIC_API_URL,
  timeout: 10000,
});

// Add response interceptor for debugging
PublicAPI.interceptors.response.use(
  (response) => {
    console.log('✅ Public API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Public API Error:', error.config?.url, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Public click tracking - works for both logged-in and non-logged-in users
export const trackClickPublic = async (clickData) => {
  try {
    console.log('📊 Tracking click (public):', clickData);
    
    const response = await PublicAPI.post("/clicks/track", {
      ...clickData,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    console.log('✅ Click tracked successfully:', response.data);
    return response.data;
  } catch (error) {
    console.warn('⚠️ Click tracking failed:', error.message);
    // Fail gracefully - don't break the user experience
    return { success: false, message: 'Tracking failed but action completed' };
  }
};

export default PublicAPI;