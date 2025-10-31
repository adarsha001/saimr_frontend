import axios from "axios";

// Use environment variable or fallback to localhost:5000
const BASE_URL = "https://saimr-backend-1.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000, // Increase timeout for file uploads
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = '/login';
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