import axios from "axios";
import { getItem, removeItem } from "./cookieStorage";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getItem("token");
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

// A rejected token is dead everywhere — drop it and send the user to /login
// once, instead of letting every page surface its own "Unauthorized" toast.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && getItem("token")) {
      removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

/** Pull the most useful message out of an axios error. */
export const errorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

export default axiosInstance;
