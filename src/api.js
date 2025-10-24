import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getProperties = () => API.get("/properties");
export const getPropertyById = (id) => API.get(`/properties/${id}`);
