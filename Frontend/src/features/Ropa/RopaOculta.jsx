import { useEffect, useState } from "react";
import { AlertCircle, Eye } from "lucide-react";
import { getProductosAdmin, activarProducto } from "../../services/RopaService";
import ProductCard from "../../components/ProductCard";

function RopaOculta() {
  const [productosOcultos, setProductosOcultos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleActivar = async (id) => {
    try {
      await activarProducto(id);
      setProductosOcultos((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || "Error al reactivar producto");
    }
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosAdmin();
        const productosData = Array.isArray(data) ? data : data?.content || [];
        const ocultos = productosData.filter((p) => p.activo === false);
        setProductosOcultos(ocultos);
      } catch (err) {
        setError(err.message || "No se pudo cargar productos ocultos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="admin-view">
        <div className="admin-empty">
          <p>Cargando productos ocultos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="admin-view ropa-oculta">
      <header className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Productos ocultos</h2>
          <p className="admin-view-desc">Aqui puedes reactivar productos deshabilitados.</p>
        </div>
        <span className="admin-chip">{productosOcultos.length} ocultos</span>
      </header>

      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: "12px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="productos-grid">
        {productosOcultos.length > 0 ? (
          productosOcultos.map((p) => (
            <div key={p.id} className="producto-oculto-wrapper">
              <ProductCard {...p} />
              <button className="producto-oculto-reactivar" onClick={() => handleActivar(p.id)}>
                <Eye size={16} /> Reactivar producto
              </button>
            </div>
          ))
        ) : (
          <div className="admin-empty">
            <p>No hay productos ocultos.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default RopaOculta;
