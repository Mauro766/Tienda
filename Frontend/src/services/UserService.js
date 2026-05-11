//User
const API_URL = "http://localhost:8081/api/usuarios";

// AUTH
const AUTH_URL = "http://localhost:8081/auth";

export const registrarUsuario = async (usuario) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
    });

    if (!res.ok) {
        throw new Error("Error al registrar el usuario");
    }

    return res.json();
}

export const loginUsuario = async (usuario) => {
    const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(usuario),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al iniciar sesion");
    }

    return res.json();
}

export const getUsuarioActual = async () => {
    const res = await fetch(`${AUTH_URL}/me`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Error al obtener el usuario actual");
    }

    return res.json();
}
