function Hero() {
  return (
    <section className="hero">
      <img className="hero-img" src="/banner.png" alt="Coleccion principal de temporada" />

      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-eyebrow">Nueva temporada 2026</p>
        <h1 className="hero-title">Streetwear minimal con actitud urbana.</h1>
        <p className="hero-text">
          Prendas comodas, cortes modernos y detalles pensados para usar todos los dias.
        </p>

        <div className="hero-actions">
          <a className="hero-btn hero-btn-primary" href="/busqueda">
            Explorar catalogo
          </a>
          <a className="hero-btn hero-btn-ghost" href="/RopaInfo">
            Ver destacados
          </a>
        </div>

      </div>

      <div className="what">
        <img className="whatsapp" src="/Whatsapp.png" alt="WhatsApp" />
      </div>
    </section>
    
  );
}

export default Hero;
