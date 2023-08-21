import axios from "axios";
import { getItem } from "./cookieStorage";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getItem("token");
  config.params = config.params || {};
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
