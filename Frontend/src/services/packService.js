
import { getAuthHeadersOnly } from "../utils/api";
import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/packs`;

const getErrorMessage = async (res, fallbackMessage) => {
  try {
    const data = await res.json();
    return data?.message || data?.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

// Obtener packs activos para el catálogo público
export const getPacks = async () => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res, "Error obteniendo packs")
    );
  }

  return res.json();
};

// Obtener todos los packs desde el panel de administración
export const getPacksAdmin = async () => {
  const res = await fetch(`${API_URL}/admin`, {
    headers: getAuthHeadersOnly(),
  });

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res, "Error obteniendo packs del administrador")
    );
  }

  return res.json();
};

// Crear un pack con una imagen y dos prendas existentes
export const crearPack = async (pack, imagen) => {
  const formData = new FormData();

  formData.append(
    "pack",
    new Blob([JSON.stringify(pack)], {
      type: "application/json",
    })
  );

  if (imagen instanceof File || imagen instanceof Blob) {
    formData.append("imagen", imagen);
  } else {
    throw new Error("Debés seleccionar una imagen para el pack");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeadersOnly(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res, "Error creando el pack")
    );
  }

  return res.json();
};

// Actualizar un pack existente; la imagen es opcional
export const actualizarPack = async (id, pack, imagen = null) => {
  const formData = new FormData();

  formData.append(
    "pack",
    new Blob([JSON.stringify(pack)], {
      type: "application/json",
    })
  );

  if (imagen instanceof File || imagen instanceof Blob) {
    formData.append("imagen", imagen);
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeadersOnly(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res, "Error actualizando el pack")
    );
  }

  return res.json();
};

// Desactivar un pack sin eliminar su registro
export const desactivarPack = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeadersOnly(),
  });

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res, "Error desactivando el pack")
    );
  }

  return res;
};
