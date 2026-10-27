import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/categoria`;

export const getCategorias = async () => {
  const res = await fetch(API_URL, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error obteniendo categorias");
  }
  return res.json();
};

export const crearCategoria = async (nombre) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ nombre }),
  });
  if (!res.ok) {
    throw new Error("Error creando categoria");
  }
  return res.json();
};
