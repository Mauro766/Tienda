const API_URL = "http://localhost:8081/auth";

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
    throw new Error(errorData.message || "Error al iniciar sesion");
  }

  return res.json();
};

export const logout = async () => {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
};
