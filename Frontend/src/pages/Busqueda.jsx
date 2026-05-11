import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { filtrarProductos } from "../services/RopaService";
import "../styles/busqueda.css";

const CATEGORIAS = ["REMERAS", "PANTALONES", "CALZADO", "BUZOS", "CAMPERAS"];
const TALLES = ["S", "M", "L", "XL", "40", "41", "42", "43"];
const COLORES = ["Negro", "Blanco", "Azul", "Verde", "Gris", "Marron"];
const PRECIO_RANGOS = [
  { id: "0-35000", label: "Hasta $35.000", min: 0, max: 35000 },
  { id: "35001-65000", label: "$35.001 - $65.000", min: 35001, max: 65000 },
  { id: "65001-999999", label: "Mas de $65.000", min: 65001, max: 1000000 }
];

const COLOR_HEX = {
  Negro: "#1a1a1a",
  Blanco: "#f5f5f5",
  Azul: "#3d62d3",
  Verde: "#2b8a5d",
  Gris: "#8d99ae",
  Marron: "#9c6644"
};

function Busqueda() {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precioId, setPrecioId] = useState("");
  const [talle, setTalle] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Obtener query inicial desde la URL (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, [location.search]);

  const fetchFiltered = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rango = PRECIO_RANGOS.find(r => r.id === precioId);
      const params = {
        nombre: query,
        categoria: categoria || null,
        precioMin: rango ? rango.min : null,
        precioMax: rango ? rango.max : null,
        color: color || null,
        talla: talle || null
      };
      
      const data = await filtrarProductos(params);
      setProductos(data);
    } catch (err) {
      setError("Error al cargar productos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, categoria, precioId, talle, color]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFiltered();
    }, 300); // Debounce para no saturar al escribir
    return () => clearTimeout(timer);
  }, [fetchFiltered]);

  const limpiarFiltros = () => {
    setQuery("");
    setCategoria("");
    setPrecioId("");
    setTalle("");
    setColor("");
  };

  return (
    <>
      <Header />
      <main className="search-page">
        <div className="search-topbar">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="search-input"
            aria-label="Buscar productos"
          />
        </div>

        <div className="search-layout">
          <aside className="search-sidebar">
            <div className="filter-group">
              <h3>Categorías</h3>
              <div className="chip-group">
                {CATEGORIAS.map((cat) => (
                  <button
                    key={cat}
                    className={`chip-button ${categoria === cat ? "active" : ""}`}
                    onClick={() => setCategoria(cat === categoria ? "" : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Precio</h3>
              <div className="chip-group">
                {PRECIO_RANGOS.map((rango) => (
                  <button
                    key={rango.id}
                    className={`chip-button ${precioId === rango.id ? "active" : ""}`}
                    onClick={() => setPrecioId(rango.id === precioId ? "" : rango.id)}
                  >
                    {rango.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Talle</h3>
              <div className="chip-group">
                {TALLES.map((t) => (
                  <button
                    key={t}
                    className={`chip-button ${talle === t ? "active" : ""}`}
                    onClick={() => setTalle(t === talle ? "" : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Color</h3>
              <div className="chip-group">
                {COLORES.map((c) => (
                  <button
                    key={c}
                    className={`chip-button color-chip ${color === c ? "active" : ""}`}
                    onClick={() => setColor(c === color ? "" : c)}
                  >
                    <span className="color-dot" style={{ backgroundColor: COLOR_HEX[c] }} />
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="search-content">
            <div className="search-content-header">
              <p>{productos.length} productos encontrados</p>
              <button type="button" onClick={limpiarFiltros} className="clear-filters">
                Limpiar filtros
              </button>
            </div>

            <div className="product-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="product-card skeleton" />
                ))
              ) : (
                productos.map((producto) => (
                  <ProductCard key={producto.id} {...producto} />
                ))
              )}
            </div>

            {!loading && productos.length === 0 && (
              <div className="empty-state">
                <h3>Sin resultados</h3>
                <p>Probá con otro término o quitando algunos filtros.</p>
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Busqueda;
