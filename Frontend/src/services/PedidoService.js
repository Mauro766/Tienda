import { getAuthHeadersOnly } from "../utils/api";

const API_URL = "http://localhost:8081/pedido";

export const cambiarDeEstado = async (id, estado) => {
    const res = await fetch(`${API_URL}/${id}/estado`, {
        method: "PUT",
        headers: {
            ...getAuthHeadersOnly(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado })
    });

    if (!res.ok) {
        throw new Error("Error al cambiar estado del pedido");
    }

    return res.json();
};

export const misPedidos = async () => {
    const res = await fetch(`${API_URL}/mis-pedidos`, {
        headers: getAuthHeadersOnly(),
    });

    if(!res.ok){
        throw new Error("Error al obtener pedidos");
    }

    return res.json();
};

export const checkout = async (datos) => {
    const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
            ...getAuthHeadersOnly(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });

    if (!res.ok) {
        throw new Error("Error al realizar la compra");
    }

    return res.json();
};

export const getPedidos = async ({ ciudad, direccion } = {}) =>{
    const params = new URLSearchParams();

    if (ciudad?.trim()) {
        params.set("ciudad", ciudad.trim());
    }

    if (direccion?.trim()) {
        params.set("direccion", direccion.trim());
    }

    const query = params.toString();
    const url = query ? `${API_URL}/admin?${query}` : `${API_URL}/admin`;

    const res = await fetch(url,{
        headers:getAuthHeadersOnly(),
    });

    if(!res.ok){
        throw new Error("Error al obtener los pedidos")
    }

    return res.json();

}
