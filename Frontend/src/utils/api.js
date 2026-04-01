// utils/api.js

import { getToken } from "./auth";

export const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getAuthHeadersOnly = () => {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};