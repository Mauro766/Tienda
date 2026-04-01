import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "../styles/busqueda.css";

const PRODUCTOS = [
  { id: 1, nombre: "Remera Essential", categoria: "Remeras", precio: 25990, talles: ["S", "M", "L"], color: "Negro", img: "/Campera.jpg" },
  { id: 2, nombre: "Jean Relax Fit", categoria: "Pantalones", precio: 48990, talles: ["M", "L", "XL"], color: "Azul", img: "/Campera.jpg" },
  { id: 3, nombre: "Zapatilla Urban Move", categoria: "Calzado", precio: 73990, talles: ["40", "41", "42"], color: "Blanco", img: "/Campera.jpg" },
  { id: 4, nombre: "Buzo Soft Club", categoria: "Buzos", precio: 56990, talles: ["S", "M", "L"], color: "Gris", img: "/Campera.jpg" },
  { id: 5, nombre: "Campera North Wind", categoria: "Camperas", precio: 89990, talles: ["M", "L", "XL"], color: "Verde", img: "/Campera.jpg" },
  { id: 6, nombre: "Remera Logo Front", categoria: "Remeras", precio: 29990, talles: ["S", "M", "L", "XL"], color: "Blanco", img: "/Campera.jpg" },
  { id: 7, nombre: "Pantalon Cargo Street", categoria: "Pantalones", precio: 62990, talles: ["M", "L", "XL"], color: "Negro", img: "/Campera.jpg" },
  { id: 8, nombre: "Bota Trail Pro", categoria: "Calzado", precio: 82990, talles: ["41", "42", "43"], color: "Marron", img: "/Campera.jpg" }
];

const CATEGORIAS = ["Remeras", "Pantalones", "Calzado", "Buzos", "Camperas"];
const TALLES = ["S", "M", "L", "XL", "40", "41", "42", "43"];
const COLORES = ["Negro", "Blanco", "Azul", "Verde", "Gris", "Marron"];
const PRECIO_RANGOS = [
  { id: "0-35000", label: "Hasta $35.000", min: 0, max: 35000 },
  { id: "35001-65000", label: "$35.001 - $65.000", min: 35001, max: 65000 },
  { id: "65001-999999", label: "Mas de $65.000", min: 65001, max: Number.POSITIVE_INFINITY }
];

const COLOR_HEX = {
  Negro: "#1a1a1a",
  Blanco: "#f5f5f5",
  Azul: "#3d62d3",
  Verde: "#2b8a5d",
  Gris: "#8d99ae",
  Marron: "#9c6644"
};

function toggleValue(value, values, setter) {
  const exists = values.includes(value);
  if (exists) {
    setter(values.filter((current) => current !== value));
    return;
  }
  setter([...values, value]);
}

function Busqueda() {
  const [query, setQuery] = useState("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [precioSeleccionado, setPrecioSeleccionado] = useState("");
  const [tallesSeleccionados, setTallesSeleccionados] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(timer);
  }, [query, categoriasSeleccionadas, precioSeleccionado, tallesSeleccionados, coloresSeleccionados]);

  const productosFiltrados = useMemo(() => {
    const texto = query.trim().toLowerCase();
    const precioActivo = PRECIO_RANGOS.find((rango) => rango.id === precioSeleccionado);

    return PRODUCTOS.filter((producto) => {
      const coincideTexto =
        !texto ||
        producto.nombre.toLowerCase().includes(texto) ||
        producto.categoria.toLowerCase().includes(texto);

      const coincideCategoria =
        categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.categoria);

      const coincideTalle =
        tallesSeleccionados.length === 0 ||
        tallesSeleccionados.some((talle) => producto.talles.includes(talle));

      const coincideColor =
        coloresSeleccionados.length === 0 || coloresSeleccionados.includes(producto.color);

      const coincidePrecio =
        !precioActivo ||
        (producto.precio >= precioActivo.min && producto.precio <= precioActivo.max);

      return coincideTexto && coincideCategoria && coincideTalle && coincideColor && coincidePrecio;
    });
  }, [query, categoriasSeleccionadas, precioSeleccionado, tallesSeleccionados, coloresSeleccionados]);

  const limpiarFiltros = () => {
    setQuery("");
    setCategoriasSeleccionadas([]);
    setPrecioSeleccionado("");
    setTallesSeleccionados([]);
    setColoresSeleccionados([]);
  };

  return (
    <>
      <Header />
      <main className="search-page">
        <div className="search-topbar">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar productos..."
            className="search-input"
            aria-label="Buscar productos"
          />
        </div>

        <div className="search-layout">
          <aside className="search-sidebar">
            <div className="filter-group">
              <h3>Categorias</h3>
              <div className="chip-group">
                {CATEGORIAS.map((categoria) => (
                  <button
                    type="button"
                    key={categoria}
                    className={`chip-button ${categoriasSeleccionadas.includes(categoria) ? "active" : ""}`}
                    onClick={() =>
                      toggleValue(categoria, categoriasSeleccionadas, setCategoriasSeleccionadas)
                    }
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Precio</h3>
              <div className="chip-group">
                {PRECIO_RANGOS.map((rango) => (
                  <button
                    type="button"
                    key={rango.id}
                    className={`chip-button ${precioSeleccionado === rango.id ? "active" : ""}`}
                    onClick={() =>
                      setPrecioSeleccionado((actual) => (actual === rango.id ? "" : rango.id))
                    }
                  >
                    {rango.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Talle</h3>
              <div className="chip-group">
                {TALLES.map((talle) => (
                  <button
                    type="button"
                    key={talle}
                    className={`chip-button ${tallesSeleccionados.includes(talle) ? "active" : ""}`}
                    onClick={() => toggleValue(talle, tallesSeleccionados, setTallesSeleccionados)}
                  >
                    {talle}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Color</h3>
              <div className="chip-group">
                {COLORES.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={`chip-button color-chip ${coloresSeleccionados.includes(color) ? "active" : ""}`}
                    onClick={() => toggleValue(color, coloresSeleccionados, setColoresSeleccionados)}
                  >
                    <span className="color-dot" style={{ backgroundColor: COLOR_HEX[color] }} />
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="search-content">
            <div className="search-content-header">
              <p>{productosFiltrados.length} productos encontrados</p>
              <button type="button" onClick={limpiarFiltros} className="clear-filters">
                Limpiar filtros
              </button>
            </div>

            <div className="product-grid">
              {loading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="product-card skeleton" />
                ))}

              {!loading &&
                productosFiltrados.map((producto) => (
                  <ProductCard key={producto.id} {...producto} />
                ))}
            </div>

            {!loading && productosFiltrados.length === 0 && (
              <div className="empty-state">
                <h3>Sin resultados</h3>
                <p>Proba con otro termino o quitando algunos filtros.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Busqueda;
