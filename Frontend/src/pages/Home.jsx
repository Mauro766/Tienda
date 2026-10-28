import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Marcas from "../components/marcas"
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import { getProductos, getProductosMasVendidos } from "../services/RopaService";
import Historia from "../components/historia";
import PackCarrusel from "../components/pack-carrusel";
import "../styles/home.css";

function Home() {
  const [productos, setProductos] = useState([]);
  const [masVendidos, setMasVendidos] = useState([]);

  useEffect(() => {
    const fetchAllProductos = async () => {
      try {
        const [dataProductos, dataMasVendidos] = await Promise.all([
          getProductos(),
          getProductosMasVendidos(4)
        ]);
        const productosData = Array.isArray(dataProductos) ? dataProductos : (dataProductos?.content || []);
        setProductos(productosData);
        setMasVendidos(Array.isArray(dataMasVendidos) ? dataMasVendidos : []);
      } catch (err) {
        console.error("No se pudo cargar los productos:", err);
      }
    };
    fetchAllProductos();
  }, []);

  const nuevosIngresos = productos.slice(0, 4);

  return (
    <>
      <Header />
      <Hero />
      <Marcas/>

      <main className="home-main">
        <section className="home-categories" aria-label="Categorias destacadas">
          <Link viewTransition to="/busqueda?cat=Remeras" className="category-pill">Remeras</Link>
          <Link viewTransition to="/busqueda?cat=Pantalones" className="category-pill">Pantalones</Link>
          <Link viewTransition to="/busqueda?cat=Calzado" className="category-pill">Calzado</Link>
          <Link viewTransition to="/busqueda?cat=Buzos" className="category-pill">Buzos</Link>
          <Link viewTransition to="/busqueda?cat=Camperas" className="category-pill">Camperas</Link>
        </section>

        <PackCarrusel />

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
      <Historia/>
      <Footer />
    </>
  );
}

export default Home;
