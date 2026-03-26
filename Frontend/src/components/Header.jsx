import { useEffect, useRef, useState } from "react";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const closeTimeoutRef = useRef(null);

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
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="principal">
        <div className="header-left">
          <img className="header-right-logo" src="/logo.png" />
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
          <img className="header-right-img" src="/search.png" />
          <img className="header-right-img" src="/shopping-cart.png" />
          <img className="header-right-img" src="/user.png" />
        </div>
      </div>

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
  );
}

export default Header;
