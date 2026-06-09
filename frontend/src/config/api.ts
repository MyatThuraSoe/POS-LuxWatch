import axios from "axios";
import { DEFAULT_API_TIMEOUT } from "./constants";
import { getEnv } from "./env";
import { useAuthStore } from "../stores/authStore";

const env = getEnv();

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs ?? DEFAULT_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: env.apiUseCredentials,
});

// Backwards-compatible alias expected by some modules
export const api = apiClient;

export default apiClient;

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }


  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  },
);
