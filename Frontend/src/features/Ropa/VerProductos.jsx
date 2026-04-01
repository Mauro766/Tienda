import { useEffect, useState } from "react";
import { getProductosAdmin } from "../../services/RopaService";
import ProductCard from "../../components/ProductCard";

function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosAdmin();

        console.log("DATA:", data);

        // 👇 Si usamos getProductosAdmin, retorna el Array directamente
        const productosData = Array.isArray(data) ? data : (data?.content || []);

        setProductos(productosData);
      } catch (err) {
        setError(err.message || "No se pudo cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="ver-productos">
      <h2>Ver Todos los Productos</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {productos.length === 0 && <p>No hay productos</p>}

      <div className="productos-grid">
        {productos.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            nombre={p.nombre}
            precio={p.precio}
            imagenesUrl={p.imagenesUrl} // 👈 importante
            categoria={p.categoria}
            activo={p.activo}
          />
        ))}
      </div>
    </div>
  );
}

export default VerProductos;