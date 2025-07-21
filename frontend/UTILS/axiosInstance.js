// src/UTILS/axiosInstance.js

import axios from "axios";
//import { store } from "../Redux/store"; // Store import agar zarurat ho logout ke liye
import { logout } from "../Redux/Slice/authSlice"; // logout action

export const setStore = (_store) => {
  store = _store;
}
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use Vite .env variable for baseURL
  withCredentials: true, // IMPORTANT: Cookies ko bhejne ke liye
});

// Response Interceptor
let isRefreshing = false;
let failedQueue = [];
let store;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Yahan refresh token call maarenge
        await axiosInstance.get("/api/v1/user/refreshtoken", {
          withCredentials: true,
        });

        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout()); // Redux se logout krdo
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
