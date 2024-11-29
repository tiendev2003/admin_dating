import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://api.example.com/api"
    : "http://localhost:8000/api";
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
