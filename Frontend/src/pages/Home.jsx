import Header from "../components/Header";
import Hero from "../components/Main/Hero";
import ProductSection from "../components/Main/ProductSection";
import CarruselInfo from "../components/Main/carrusel-info";
import Footer from "../components/footer";

function Home() {
  return (
    <>
      <Header/>
      <Hero />
      <CarruselInfo/>


      <main>
        <ProductSection title="Remeras" />


      </main>
      <Footer/>
    </>
  );
}

export default Home;