import { getToken } from "../utils/auth";
import { getAuthHeadersOnly } from "../utils/api";

const API_URL = "http://localhost:8081/ropa";

export const crearProducto = async (ropa, imagenes) => {
  const formData = new FormData();

  formData.append(
    "ropa",
    new Blob([JSON.stringify(ropa)], { type: "application/json" })
  );

  if (imagenes && imagenes.length > 0) {
    imagenes.forEach(img => {
      formData.append("imagenes", img);
    });
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeadersOnly(), // 🔥 automático
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error creando producto");
  }

  return res.json();
};

export const getProductos = async (publico = true) => {
  const headers = publico ? {} : getAuthHeadersOnly();

  const res = await fetch(API_URL, {
    headers,
  });

  if (!res.ok) {
    throw new Error("Error obteniendo productos");
  }

  return res.json();
};

export const getProductoById = async (id) => {
  const res = await fetch(`${API_URL}/id/${id}`, {
    headers: getAuthHeadersOnly(),
  });

  if (!res.ok) {
    throw new Error("Error obteniendo producto");
  }

  return res.json();
};

export const actualizarProducto = async (id, producto, imagen) => {
  const formData = new FormData();
  formData.append("ropa", new Blob([JSON.stringify(producto)], { type: "application/json" }));
  if (imagen) formData.append("imagen", imagen);

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeadersOnly(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error actualizando producto");
  }

  return res.json();
};

export const desactivarProducto = async (id) => {
  const res = await fetch(`${API_URL}/desactivar/${id}`, {
    method: "PUT",
    headers: getAuthHeadersOnly(),
  });

  if (!res.ok) {
    throw new Error("Error desactivando producto");
  }

  return res;
};

export const getProductosAdmin = async () => {
  const res = await fetch(`${API_URL}/admin`, {
    headers: getAuthHeadersOnly(),
  });

  if (!res.ok) {
    throw new Error("Error obteniendo productos admin");
  }

  return res.json();
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeadersOnly(),
  });

  if (!res.ok) {
    throw new Error("Error eliminando producto");
  }

  return res;
};

export const activarProducto = async (id) => {
  const res = await fetch(`${API_URL}/reactivar/${id}`, {
    method: "PUT",
    headers: getAuthHeadersOnly(),
  });

  if (!res.ok) {
    throw new Error("Error activando producto");
  }

  return res;
};