// services/authService.js

import { setToken, removeToken } from "../utils/auth";

const API_URL = "http://localhost:8081/auth";

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al iniciar sesión");
  }

  const data = await res.json();

  // 🔥 guardás el token
  setToken(data.token);

  return data;
};

export const logout = () => {
  removeToken();
};