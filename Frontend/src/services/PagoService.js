import { getAuthHeadersOnly } from "../utils/api";
import { API_URL as BASE_URL } from "../config";

const API = `${BASE_URL}/pagos`;

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
