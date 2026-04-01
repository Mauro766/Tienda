import { useEffect, useState } from "react";
import { getProductosAdmin, desactivarProducto, eliminarProducto } from "../../services/RopaService";

function EliminarProducto({ token }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductosAdmin();
                setProductos(data.filter(p => p.activo !== false));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const handleDesactivar = async (id) => {
        if (!token) {
            setError('Falta token de admin. Ingresalo en el panel o iniciá sesión');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres ocultar este producto? Se podrá reactivar después.')) {
            try {
                await desactivarProducto(id);
                setProductos(productos.filter((p) => p.id !== id));
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al ocultar producto');
            }
        }
    };

    const handleEliminar = async (id) => {
        if (!token) {
            setError('Falta token de admin. Ingresalo en el panel o iniciá sesión');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar definitivamente este producto? Esta acción no se puede deshacer.')) {
            try {
                await eliminarProducto(id);
                setProductos(productos.filter((p) => p.id !== id));
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al eliminar producto');
            }
        }
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="eliminar-producto">
            <h2>Eliminar Producto</h2>
            {productos.length === 0 ? (
                <p>No hay productos para mostrar</p>
            ) : (
                <div className="productos-lista">
                    {productos.map((p) => (
                        <div key={p.id} className="producto-item">
                            <span>{p.nombre} - {p.descripcion}</span>
                            <div className="botones-accion">
                                <button
                                    onClick={() => handleDesactivar(p.id)}
                                    className="btn-ocultar"
                                    style={{ backgroundColor: 'yellow', color: 'black', border: '2px solid black', padding: '10px', fontSize: '16px' }}
                                >
                                    🟡 Ocultar
                                </button>
                                <button
                                    onClick={() => handleEliminar(p.id)}
                                    className="btn-eliminar"
                                    style={{ backgroundColor: 'red', color: 'white', border: '2px solid black', padding: '10px', fontSize: '16px' }}
                                >
                                    🔴 Eliminar Definitivamente
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EliminarProducto;