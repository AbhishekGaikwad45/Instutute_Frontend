import axios from "axios";
import API from "../Api/api";

const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
