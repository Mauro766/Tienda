import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, EyeOff, Loader2, AlertCircle, Package, Search, AlertTriangle } from "lucide-react";
import { getProductosAdmin, desactivarProducto, eliminarProducto } from "../../services/RopaService";

function EliminarProducto() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirming, setConfirming] = useState({ id: null, type: null });

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosAdmin();
        const productosData = Array.isArray(data) ? data : data?.content || [];
        setProductos(productosData.filter((p) => p.activo !== false));
      } catch (err) {
        setError(err.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleDesactivar = async (id) => {
    try {
      await desactivarProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setConfirming({ id: null, type: null });
    } catch (err) {
      setError(err.message || "Error al ocultar producto");
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setConfirming({ id: null, type: null });
    } catch (err) {
      setError(err.message || "Error al eliminar producto");
    }
  };

  const filtered = productos.filter((p) => (p.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="admin-view">
        <div className="admin-empty">
          <Loader2 className="spin-icon" size={28} />
          <p>Analizando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="admin-view admin-delete-view">
      <header className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Zona de bajas</h2>
          <p className="admin-view-desc">Oculta o elimina definitivamente productos del sistema.</p>
        </div>
      </header>

      <div className="admin-alert" style={{ background: "#fffbeb", borderColor: "#fcd34d", color: "#92400e", marginBottom: "14px" }}>
        <AlertTriangle size={18} />
        <span>La eliminacion definitiva no se puede deshacer.</span>
      </div>

      <div className="admin-search">
        <Search size={18} />
        <input type="text" placeholder="Filtrar por nombre" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: "14px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <Package size={38} />
          <p>No hay productos disponibles para dar de baja.</p>
        </div>
      ) : (
        <div className="admin-list">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.article key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="admin-list-item">
                <div className="admin-list-left">
                  <img
                    className="admin-list-thumb"
                    src={
                      p.imagenesUrl?.[0]
                        ? p.imagenesUrl[0].startsWith("http")
                          ? p.imagenesUrl[0]
                          : `http://localhost:8081${p.imagenesUrl[0]}`
                        : "/Campera.jpg"
                    }
                    alt={p.nombre}
                  />
                  <div>
                    <h3 className="admin-list-title">{p.nombre}</h3>
                    <p className="admin-list-meta">{p.descripcion || "Sin descripcion"}</p>
                  </div>
                </div>

                <div className="admin-actions">
                  {confirming.id === p.id ? (
                    <>
                      <button
                        onClick={() => (confirming.type === "hide" ? handleDesactivar(p.id) : handleEliminar(p.id))}
                        className={`admin-btn ${confirming.type === "hide" ? "admin-btn-primary" : "admin-btn-danger"}`}
                      >
                        Si, confirmar
                      </button>
                      <button onClick={() => setConfirming({ id: null, type: null })} className="admin-btn admin-btn-neutral">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setConfirming({ id: p.id, type: "hide" })} className="admin-btn admin-btn-primary">
                        <EyeOff size={16} /> Ocultar
                      </button>
                      <button onClick={() => setConfirming({ id: p.id, type: "delete" })} className="admin-btn admin-btn-danger">
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

export default EliminarProducto;
