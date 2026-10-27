function Hero() {
  return (
    <section className="hero">
      {/*<img className="hero-img" src="/banner.png" alt="Coleccion principal de temporada" />*/}
      <div className="hero-img"></div>

      <div className="hero-overlay" />
      <div className="hero-vignette" />

      <div className="home-bann">
        <img src="/Campera/c1.png" alt="" />
        <img src="/Campera/c2.png" alt="" />
        <img src="/Campera/c3.png" alt="" />

      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Nueva temporada 2026</p>
        <h1 className="hero-title">Sentirse comodo <br /> y bien</h1>
        {/*<p className="hero-text">
          Prendas comodas, cortes modernos y detalles pensados para usar todos los dias.
        </p> */}

        <div className="hero-actions">
          <a className="hero-btn hero-btn-primary" href="/busqueda">
            Explorar catalogo
          </a>
          <a className="hero-btn hero-btn-ghost" href="/RopaInfo">
            Ver destacados
          </a>
        </div>

      </div>

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

      <div className="what">
        <img className="whatsapp" src="/Whatsapp.png" alt="WhatsApp" />
      </div>
    </section>

  );
}

export default Hero;
