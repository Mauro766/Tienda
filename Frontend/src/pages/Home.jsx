import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import { getProductos } from "../services/RopaService";
import "../styles/home.css";

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        const productosData = Array.isArray(data) ? data : (data?.content || []);
        setProductos(productosData);
      } catch (err) {
        console.error("No se pudo cargar los productos:", err);
      }
    };
    fetchProductos();
  }, []);

  const nuevosIngresos = productos.slice(0, 4);
  const masVendidos = productos.length > 4 ? productos.slice(4, 8) : [];
  
  return (
    <>
      <Header/>
      <Hero />

      <main className="home-main">
        <section className="home-benefits" aria-label="Beneficios de la tienda">
          <article className="benefit-card">
            <img src="/marker.png" alt="" aria-hidden="true" />
            <div>
              <h3>Envios a todo el pais</h3>
              <p>Despacho rapido y seguimiento de tu pedido.</p>
            </div>
          </article>

          <article className="benefit-card">
            <img src="/credit-card.png" alt="" aria-hidden="true" />
            <div>
              <h3>Pagos seguros</h3>
              <p>Tarjeta, transferencia y cuotas sin interes.</p>
            </div>
          </article>

          <article className="benefit-card">
            <img src="/shopping-cart.png" alt="" aria-hidden="true" />
            <div>
              <h3>Cambios simples</h3>
              <p>Gestiona cambios de talle sin vueltas.</p>
            </div>
          </article>
        </section>

        <section className="home-categories" aria-label="Categorias destacadas">
          <Link viewTransition to="/busqueda" className="category-pill">Remeras</Link>
          <Link viewTransition to="/busqueda" className="category-pill">Pantalones</Link>
          <Link viewTransition to="/busqueda" className="category-pill">Calzado</Link>
          <Link viewTransition to="/busqueda" className="category-pill">Buzos</Link>
          <Link viewTransition to="/busqueda" className="category-pill">Camperas</Link>
        </section>

        <ProductSection
          title="Nuevos Ingresos"
          subtitle="Lo ultimo que entro esta semana."
          productos={nuevosIngresos}
        />

        {masVendidos.length > 0 && (
          <ProductSection
            title="Mas Vendidos"
            subtitle="Los favoritos de la comunidad Street."
            productos={masVendidos}
          />
        )}
      </main>
      <Footer/>
    </>
  );
}

export default Home;
