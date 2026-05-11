import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProductosAdmin } from "../../services/RopaService";
import ProductCard from "../../components/ProductCard";
import { Loader2, AlertCircle, Package } from "lucide-react";

function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosAdmin();
        const productosData = Array.isArray(data) ? data : data?.content || [];
        setProductos(productosData);
      } catch (err) {
        setError(err.message || "No se pudo cargar productos");
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
          <Loader2 size={28} className="spin-icon" />
          <p>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-view admin-view-products">
      <header className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Inventario total</h2>
          <p className="admin-view-desc">Gestiona todos los productos de tu tienda</p>
        </div>
        <span className="admin-chip">{productos.length} productos</span>
      </header>

      {error ? (
        <div className="admin-alert admin-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : productos.length === 0 ? (
        <div className="admin-empty">
          <Package size={40} />
          <p>No hay productos registrados.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="admin-grid-products">
          {productos.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <ProductCard
                id={p.id}
                nombre={p.nombre}
                precio={p.precio}
                imagenesUrl={p.imagenesUrl}
                categoria={p.categoria}
                stock={p.stock}
                activo={p.activo}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default VerProductos;
