import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const closeTimeoutRef = useRef(null);
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const forceVisibleHeader = pathname !== "/";
  const isPathActive = (target) =>
    target === "/" ? pathname === "/" : pathname.startsWith(target);

  const openSale = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShopHover(true);
  };

  const closeSaleWithDelay = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setShopHover(false);
      closeTimeoutRef.current = null;
    }, 180);
  };

  const closeSaleNow = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShopHover(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Barra superior solo en mobile - FUERA del header para evitar problemas con transform */}
      <div className="mobile-top-bar">
        <a href="/"><img className="mobile-top-logo" src="/logo.png" alt="Logo" /></a>
        <div className="mobile-top-icons">
          <a href="/busqueda" aria-label="Buscar">
            <img className="mobile-top-icon" src="/search.png" alt="Buscar" />
          </a>
          <img className="mobile-top-icon" src="/shopping-cart.png" alt="Carrito" />
        </div>
      </div>

      <header className={`header ${scrolled || shopHover || forceVisibleHeader ? "scrolled" : ""}`}>
      <div className="principal">
        <div className="header-left">
          <a href="/"><img className="header-right-logo" src="/logo.png" /></a>
        </div>

        <nav className="header-center">
          <a href="#">Sale</a>

          <div
            className="shop-wrapper"
            onMouseEnter={openSale}
            onMouseLeave={closeSaleWithDelay}
          >
            <a className="shop" href="#">Shop</a>
          </div>

          <a href="#">Locales</a>
        </nav>

        <div className="header-right">
          <a href="/busqueda" aria-label="Ir a busqueda">
            <img className="header-right-img" src="/search.png" />
          </a>
          <img className="header-right-img" src="/shopping-cart.png" />
          <img className="header-right-img" src="/user.png" />
        </div>
      </div>


      <nav className="mobile-nav" aria-label="Navegacion principal movil">
        <a href="/" className={`mobile-nav-item ${isPathActive("/") ? "active" : ""}`}>
          <span className="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 10.8 12 3l9 7.8V20a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1v-9.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Inicio</span>
        </a>

        <a href="/busqueda" className={`mobile-nav-item ${isPathActive("/busqueda") ? "active" : ""}`}>
          <span className="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span>Buscar</span>
        </a>

        <a href="/RopaInfo" className={`mobile-nav-item ${isPathActive("/ropainfo") ? "active" : ""}`}>
          <span className="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8.5 7.5 12 5l3.5 2.5h3l1.2 3.9L18.8 13V20H5.2v-7L4.3 11.4 5.5 7.5h3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Tienda</span>
        </a>
      </nav>

      {shopHover && (
        <div
          className="sale"
          onMouseEnter={openSale}
          onMouseLeave={closeSaleNow}
        >
          <div className="categoria">
            <h2 className="categoria-h2">Pantalones</h2>
            <a className="categoria-a" href="#">Jeans</a>
            <a className="categoria-a" href="#">Chinos</a>
            <a className="categoria-a" href="#">Joggers</a>
          </div>

          <div className="categoria">
            <h2 className="categoria-h2">Calzado</h2>
            <a className="categoria-a" href="#">Zapatillas</a>
            <a className="categoria-a" href="#">Botas</a>
            <a className="categoria-a" href="#">Sandalias</a>
          </div>

          <div className="categoria">
            <h2 className="categoria-h2">Accesorios</h2>
            <a className="categoria-a" href="#">Gorras</a>
            <a className="categoria-a" href="#">Mochilas</a>
            <a className="categoria-a" href="#">Cinturones</a>
          </div>

          <div className="categoria">
            <h2 className="categoria-h2">Ropa Deportiva</h2>
            <a className="categoria-a" href="#">Shorts</a>
            <a className="categoria-a" href="#">Camisetas</a>
            <a className="categoria-a" href="#">Sudaderas</a>
          </div>
        </div>
      )}
    </header>
    </>
  );
}

export default Header;
