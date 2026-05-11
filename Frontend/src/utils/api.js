// utils/api.js

export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});

export const getAuthHeadersOnly = () => ({});

export const withCredentials = (options = {}) => ({
  ...options,
  credentials: options.credentials || "include",
});
