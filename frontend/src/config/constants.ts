export const APP_NAME = "LuxWatch POS";
export const APP_DESCRIPTION = "Watch shop point of sale and management system.";
export const DEFAULT_THEME: "light" | "dark" = "light";
export const THEME_STORAGE_KEY = "luxwatch-theme";
export const API_BASE_URL_STORAGE_KEY = "luxwatch-api-base-url";
export const DEFAULT_API_TIMEOUT = 15000;
export const DEFAULT_QUERY_STALE_TIME = 5 * 60_000;
export const DEFAULT_QUERY_GC_TIME = 10 * 60_000;

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  me: "/auth/me",
} as const;
