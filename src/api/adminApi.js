import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchPendingProperties = () => API.get("/properties/pending");
export const fetchPropertiesByStatus = (status) => API.get(`/properties?status=${status}`);
export const approveProperty = (id) => API.put(`/properties/approve/${id}`); // Changed to approve
export const rejectProperty = (id, reason) => API.put(`/properties/reject/${id}`, { reason });
export const toggleFeatured = (id) => API.put(`/properties/feature/${id}`);