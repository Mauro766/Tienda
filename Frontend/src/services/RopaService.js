import { getAuthHeadersOnly } from "../utils/api";

const API_URL = "http://localhost:8081/ropa";
const PEDIDO_API_URL = "http://localhost:8081/pedido";

export const crearProducto = async (ropa, imagenes) => {
  const formData = new FormData();

  formData.append(
    "ropa",
    new Blob([JSON.stringify(ropa)], { type: "application/json" })
  );

  if (imagenes && imagenes.length > 0) {
  imagenes.forEach(img => {
    // Solo append si es un archivo (File o Blob)
    if (img instanceof File || img instanceof Blob) {
      formData.append("imagenes", img);
    }
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

export const actualizarProducto = async (id, producto, imagenes) => {
  const formData = new FormData();
  formData.append("ropa", new Blob([JSON.stringify(producto)], { type: "application/json" }));
  
  if (imagenes && imagenes.length > 0) {
    imagenes.forEach(img => {
      formData.append("imagenes", img);
    });
  }

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

// 🔍 BUSQUEDA POR NOMBRE (Solo activos)
export const buscarProductos = async (nombre) => {
  const res = await fetch(`${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`);
  if (!res.ok) throw new Error("Error en la búsqueda");
  const data = await res.json();
  return data.content || data; // Manejar respuesta de Pageable
};

// 🎭 FILTRADO AVANZADO (Solo activos)
export const filtrarProductos = async (params) => {
  const queryParams = new URLSearchParams();
  if (params.nombre) queryParams.append("nombre", params.nombre);
  if (params.categoria) queryParams.append("categoria", params.categoria);
  if (params.precioMin) queryParams.append("precioMin", params.precioMin);
  if (params.precioMax) queryParams.append("precioMax", params.precioMax);
  if (params.color) queryParams.append("color", params.color);
  if (params.talla) queryParams.append("talla", params.talla);

  const res = await fetch(`${API_URL}/filtrar?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Error en el filtrado");
  const data = await res.json();
  return data.content || data;
};

export const getProductosMasVendidos = async (limite = 3) => {
  const res = await fetch(`${PEDIDO_API_URL}/mas-vendidos?limite=${limite}`);
  if (!res.ok) {
    throw new Error("Error obteniendo productos mas vendidos");
  }
  return res.json();
};
