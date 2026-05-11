import { useState } from "react";
import { checkout } from "../../services/PedidoService";
import "../../styles/Pedido/userPedido.css";

const INITIAL_FORM = {
    direccion: "",
    ciudad: "",
    telefono: "",
};

function UserPedido() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");

    const onFieldChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setOk("");

        if (!form.direccion|| !form.ciudad || !form.telefono) {
            setError("Completa todos los campos");
            return;
        }

        setLoading(true);
        try {
            await checkout(form);
            setOk("Pedido realizado correctamente");
            setForm(INITIAL_FORM);
        } catch (err) {
            setError(err.message || "Error al realizar el pedido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="checkout-page">
            <div className="checkout-shell">
                <header className="checkout-head">
                    <p className="checkout-kicker">Checkout</p>
                    <h2>Finalizar compra</h2>
                    <p className="checkout-subtitle">
                        Completa tus datos de entrega para confirmar el pedido.
                    </p>
                </header>

                <div className="checkout-grid">
                    <aside className="checkout-summary" aria-label="Resumen de compra">
                        <h3>Resumen</h3>
                        <ul>
                            <li>Verifica direccion y telefono.</li>
                            <li>Confirma el pedido desde este formulario.</li>
                            <li>El carrito se vacia al completar la compra.</li>
                        </ul>
                    </aside>

                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="checkout-field">
                            <label htmlFor="direccion">Direccion (calle y altura)</label>
                            <input
                                id="direccion"
                                name="direccion"
                                type="text"
                                placeholder="Ej: Av. Siempre Viva 742, depto 2B"
                                value={form.direccion}
                                onChange={onFieldChange}
                                autoComplete="street-address"
                                required
                            />
                            <label htmlFor="ciudad">Ciudad</label>
                            <input
                                id="ciudad"
                                name="ciudad"
                                type="text"
                                placeholder="Ej: Buenos Aires"
                                value={form.ciudad}
                                onChange={onFieldChange}
                                autoComplete="street-address"
                                required
                            />
                        </div>


                        <div className="checkout-field">
                            <label htmlFor="telefono">Telefono de contacto</label>
                            <input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                placeholder="Ej: 11 1234 5678"
                                value={form.telefono}
                                onChange={onFieldChange}
                                autoComplete="tel"
                                required
                            />
                        </div>

                        <button className="checkout-submit" type="submit" disabled={loading}>
                            {loading ? "Procesando..." : "Confirmar compra"}
                        </button>

                        {error && <p className="checkout-feedback error">{error}</p>}
                        {ok && <p className="checkout-feedback ok">{ok}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
}

export default UserPedido;
