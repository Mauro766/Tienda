const AUTH_URL = "http://localhost:8081/auth";
const USER_STORAGE_KEY = "auth_user_profile";

let cachedUser = null;

const normalizarUsuario = (user) => {
  if (!user || typeof user !== "object") return null;

  const rol = user.rol || user.role || "ROLE_USER";
  const id = user.id != null ? Number(user.id) : null;

  return {
    ...user,
    id,
    rol,
    role: rol,
    username: user.username || user.usuario || "Usuario",
  };
};

export const setAuthUser = (user) => {
  const normalizado = normalizarUsuario(user);
  cachedUser = normalizado;

  if (!normalizado) {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }

  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizado));
  return normalizado;
};

export const clearAuthUser = () => {
  cachedUser = null;
  sessionStorage.removeItem(USER_STORAGE_KEY);
};

export const getUserFromToken = () => {
  if (cachedUser) return cachedUser;

  const raw = sessionStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    cachedUser = normalizarUsuario(parsed);
    return cachedUser;
  } catch (error) {
    console.error("Error al leer la sesion de usuario:", error);
    clearAuthUser();
    return null;
  }
};

export const refreshAuthUser = async () => {
  try {
    const res = await fetch(`${AUTH_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      clearAuthUser();
      return null;
    }

    const data = await res.json();
    return setAuthUser(data);
  } catch (error) {
    clearAuthUser();
    return null;
  }
};

export const logout = async () => {
  try {
    await fetch(`${AUTH_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("No se pudo cerrar sesion en backend:", error);
  } finally {
    clearAuthUser();
  }
};

export const isAuthenticated = () => !!getUserFromToken();

export const isAdmin = (user) => {
  const rol = user?.rol || user?.role;
  return rol === "ROLE_ADMIN";
};

export const isUser = (user) => {
  const rol = user?.rol || user?.role;
  return rol === "ROLE_USER";
};

// Compatibilidad temporal para codigo legado basado en token.
export const getToken = () => null;
export const setToken = () => {};
export const removeToken = () => logout();
