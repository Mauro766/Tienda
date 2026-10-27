import { getAuthHeadersOnly } from "../utils/api";


const API = "http://localhost:8081/pagos";

export const crearPago = async (ropaId) => {

    const res = await fetch(`${API}/crear`, {
        method: "POST",
        credentials: "include",
        headers: {
            ...getAuthHeadersOnly(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ropaId
        })
    });

    if (!res.ok) {
        throw new Error("Error al crear el pago");
    }

    return res.text();
};
