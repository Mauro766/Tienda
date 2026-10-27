import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/auth`;

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || "Error al iniciar sesion");
    error.code = errorData.code || `HTTP_${res.status}`;
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const logout = async () => {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
};
