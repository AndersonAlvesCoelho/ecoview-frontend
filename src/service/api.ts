import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

export const geoserverUrl = import.meta.env.VITE_GEOSERVER_URL ?? "http://localhost:8080/geoserver";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error("[API Error]", error?.response?.status, error?.config?.url);
    }
    return Promise.reject(error);
  },
);
