import { useEffect, useState } from "react";
import { getProductosAdmin, activarProducto } from "../../services/RopaService";
import ProductCard from "../../components/ProductCard";

function RopaOculta({ token }) {
  const [productosOcultos, setProductosOcultos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleActivar = async (id) => {
    if (!token) {
      setError('Falta token de admin. Ingresalo en el panel o iniciá sesión');
      return;
    }
    try {
      await activarProducto(id);
      setProductosOcultos(productosOcultos.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || "Error al reactivar producto");
    }
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosAdmin();

        const ocultos = data.filter(
          (p) => p.activo === false
        );

        setProductosOcultos(ocultos);
      } catch (err) {
        setError(err.message || "No se pudo cargar productos ocultos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <p>Cargando productos ocultos...</p>;

  return (
    <div className="ropa-oculta">
      <h2>Ropa Oculta</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="productos-grid">
        {productosOcultos.length > 0 ? (
          productosOcultos.map((p) => (
            <div key={p.id} className="producto-oculto-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' }}>
              <ProductCard {...p} />
              <button 
                onClick={() => handleActivar(p.id)}
                style={{ backgroundColor: 'green', color: 'white', border: '2px solid black', padding: '10px', fontSize: '16px', cursor: 'pointer', width: '100%', borderRadius: '5px' }}
              >
                🟢 Reactivar Producto
              </button>
            </div>
          ))
        ) : (
          <p>No hay productos ocultos.</p>
        )}
      </div>
    </div>
  );
}

export default RopaOculta;