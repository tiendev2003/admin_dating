import axios from "axios";

const baseURL = import.meta.env.VITE_URL_BACKEND+"/api";
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
