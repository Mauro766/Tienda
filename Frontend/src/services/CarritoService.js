import { getUserFromToken, refreshAuthUser } from "../utils/auth";

const API_URL = "http://localhost:8081/carrito";
const LOCAL_STORAGE_KEY = "carrito_invitado";

const getLoggedUser = async () => {
    const cachedUser = getUserFromToken();
    if (cachedUser) return cachedUser;
    return refreshAuthUser();
};

/**
 * GESTION LOCAL (GUEST)
 */
export const getLocalCart = () => {
    const cart = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
};

export const saveLocalCart = (cart) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
};

export const addToLocalCart = (producto, cantidad) => {
    let cart = getLocalCart();
    const existingIndex = cart.findIndex(item => item.ropaId === producto.id);

    if (existingIndex !== -1) {
        cart[existingIndex].cantidad += cantidad;
    } else {
        cart.push({
            ropaId: producto.id,
            cantidad: cantidad,
            nombre: producto.nombre,
            precio: producto.precio,
            imagenesUrl: producto.imagenesUrl
        });
    }
    saveLocalCart(cart);
};

export const removeFromLocalCart = (ropaId) => {
    let cart = getLocalCart();
    cart = cart.filter(item => item.ropaId !== ropaId);
    saveLocalCart(cart);
};

export const clearLocalCart = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

/**
 * SINCRONIZACION
 */
export const sincronizarCarrito = async () => {
    const user = await getLoggedUser();
    const localItems = getLocalCart();

    if (!user || localItems.length === 0) return;

    try {
        const res = await fetch(`${API_URL}/sincronizar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: localItems.map(item => ({
                    ropaId: item.ropaId,
                    cantidad: item.cantidad
                }))
            })
        });

        if (res.ok) {
            clearLocalCart();
            return await res.json();
        }
    } catch (err) {
        console.error("Error al sincronizar carrito:", err);
    }
};

/**
 * GESTION BACKEND (LOGGED IN)
 */
export const obtenerCarrito = async () => {
    const user = await getLoggedUser();
    if (!user) {
        const localItems = getLocalCart();
        return {
            items: localItems.map(li => ({
                id: `local-${li.ropaId}`,
                producto: li,
                cantidad: li.cantidad,
                precio: li.precio,
                isLocal: true
            })),
            total: calcularTotalLocal()
        };
    }

    const res = await fetch(`${API_URL}/mio`);

    if (!res.ok) throw new Error("No se pudo obtener el carrito.");
    return res.json();
};

const calcularTotalLocal = () => {
    const items = getLocalCart();
    return items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
};

export const agregarAlCarrito = async (producto, cantidad) => {
    const user = await getLoggedUser();

    if (!user) {
        addToLocalCart(producto, cantidad);
        return;
    }

    const res = await fetch(`${API_URL}/agregar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ropaId: producto.id,
            cantidad
        })
    });

    if (!res.ok) throw new Error("No se pudo agregar al carrito.");
    return res.json();
};

export const eliminarDelCarrito = async (itemId, isLocal = false, ropaId = null) => {
    if (isLocal) {
        removeFromLocalCart(ropaId);
        return;
    }

    const user = await getLoggedUser();
    if (!user) {
        throw new Error("No hay sesion activa");
    }

    const res = await fetch(`${API_URL}/eliminar/${itemId}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("No se pudo eliminar el item.");
    return res.json();
};
