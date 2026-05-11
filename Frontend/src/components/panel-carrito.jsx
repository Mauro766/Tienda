import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerCarrito, eliminarDelCarrito } from "../services/CarritoService";
import "../styles/panelCarrito.css";
import { getUserFromToken, refreshAuthUser } from "../utils/auth";

function PanelCarrito({ isOpen, onClose }) {
    const [carrito, setCarrito] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleCheckout = async () => {
        const cachedUser = getUserFromToken();
        const user = await refreshAuthUser() || cachedUser;

        if (!user) {
            navigate("/login", {
                state: {
                    redirectTo: "/checkout",
                    redirectState: { allowCheckoutEntry: true },
                },
            });
            onClose();
            return;
        }

        navigate("/checkout", { state: { allowCheckoutEntry: true } });
        onClose();
    };

    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(price || 0);
    };

    // Cargar datos del carrito cuando el panel se abre
    const fetchCarrito = async () => {
        try {
            setLoading(true);
            const data = await obtenerCarrito();
            setCarrito(data);
            setError(null);
        } catch (err) {
            console.error("Error cargando carrito:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleOpen = () => {
            fetchCarrito();
        };
        window.addEventListener("abrirCarrito", handleOpen);
        if (isOpen) fetchCarrito();
        return () => window.removeEventListener("abrirCarrito", handleOpen);
    }, [isOpen]);

    const handleEliminarItem = async (item) => {
        try {
            const isLocal = item.isLocal || false;
            await eliminarDelCarrito(item.id, isLocal, isLocal ? item.producto.ropaId : null);
            await fetchCarrito(); // Refrescar
            window.dispatchEvent(new CustomEvent("carritoModificado"));
        } catch (err) {
            alert("No se pudo eliminar el producto.");
        }
    };

    // Imagen formateada
    const formatImgUrl = (imagenes) => {
        if (!imagenes) return "/Campera.jpg";
        let url = Array.isArray(imagenes) && imagenes.length > 0 ? imagenes[0] : imagenes;
        if (typeof url !== "string") return "/Campera.jpg";
        return url.startsWith("http") ? url : `http://localhost:8081${url}`;
    };

    return (
        <div className={`cart-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
            <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Tu Carrito</h2>
                    <button className="cart-close" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items">
                    {loading && <p className="cart-status">Actualizando...</p>}

                    {error && (
                        <div className="cart-empty">
                            <span className="cart-empty-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && (!carrito || !carrito.items || carrito.items.length === 0) ? (
                        <div className="cart-empty">
                            <span className="cart-empty-icon">🛒</span>
                            <p>Tu carrito está vacío.</p>
                            <Link
                                to="/busqueda"
                                className="cart-checkout-btn"
                                onClick={onClose}
                                style={{ marginTop: "1rem", display: "block", textAlign: "center", textDecoration: "none" }}
                            >
                                Ir a la tienda
                            </Link>
                        </div>
                    ) : (
                        carrito?.items?.map((item) => {
                            const prod = item.producto || item.ropa;
                            return (
                            <div key={item.id} className="cart-item">
                                <img src={formatImgUrl(prod?.imagenesUrl)} alt={prod?.nombre} />
                                <div className="cart-item-details">
                                    <div className="cart-item-info">
                                        <h3>{prod?.nombre}</h3>
                                        <p>Cantidad: {item.cantidad}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <p className="cart-item-price">{formatPrice(item.precio * item.cantidad)}</p>
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => handleEliminarItem(item)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )})
                    )}
                </div>

                {carrito && carrito.items?.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>TOTAL:</span>
                            <span>{formatPrice(carrito.total)}</span>
                        </div>
                        <button className="cart-checkout-btn" onClick={handleCheckout}>
                            Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PanelCarrito;


