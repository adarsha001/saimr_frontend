import axios from "axios";

// Use environment variable or fallback to Render URL
const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "https://saimr-backend-1.onrender.com";
const PUBLIC_API_URL = `${base}/api`;

// Public API for click tracking (no authentication required)
const PublicAPI = axios.create({
  baseURL: PUBLIC_API_URL,
  timeout: 10000,
});

// Add request interceptor to log all outgoing requests
PublicAPI.interceptors.request.use((config) => {
  console.log('📤 Public API Request:', {
    url: config.url,
    method: config.method,
    data: config.data
  });
  return config;
});

// Add response interceptor for debugging
PublicAPI.interceptors.response.use(
  (response) => {
    console.log('✅ Public API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Public API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Enhanced public click tracking that includes user data from localStorage
export const trackClickPublic = async (clickData) => {
  try {
    // Get user data directly from localStorage
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    // Get or create session ID
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('sessionId', sessionId);
    }

    // Prepare user data if logged in
    const userData = user ? {
      userId: user.id || user._id,
      userName: user.name || user.username || user.gmail || user.email
    } : {};

    const trackingData = {
      ...clickData,
      ...userData,
      sessionId: sessionId,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    console.log('📤 Tracking click with user data:', {
      ...trackingData,
      hasUser: !!user,
      userId: user?.id,
      userName: user?.name
    });

    const response = await PublicAPI.post("/clicks/track", trackingData);
    
    console.log('✅ Click tracked successfully:', response.data);
    return response.data;
  } catch (error) {
    console.warn('⚠️ Click tracking failed:', error.message);
    // Fail gracefully - don't break the user experience
    return { 
      success: false, 
      message: 'Tracking failed but action completed',
      error: error.message 
    };
  }
};

// Legacy function for components that don't need user data
export const trackClickAnonymous = async (clickData) => {
  try {
    console.log('📊 Tracking click (anonymous):', clickData);
    
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
    return { success: false, message: 'Tracking failed but action completed' };
  }
};

export default PublicAPI;