import { useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout, getUserFromToken, isAdmin, refreshAuthUser } from "../utils/auth";
import { obtenerCarrito } from "../services/CarritoService";
import PanelCarrito from "./panel-carrito";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.toLowerCase();
  const forceVisibleHeader = pathname !== "/";
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let active = true;

    const cachedUser = getUserFromToken();
    if (cachedUser) {
      setUser(cachedUser);
    }

    refreshAuthUser().then((currentUser) => {
      if (active) {
        setUser(currentUser);
      }
    });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

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
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("abrirCarrito", handleOpenCart);
    return () => window.removeEventListener("abrirCarrito", handleOpenCart);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const data = await obtenerCarrito();
        const count = data?.items?.reduce((acc, item) => acc + item.cantidad, 0) || 0;
        setCartCount(count);
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchCartCount();

    window.addEventListener("abrirCarrito", fetchCartCount);
    window.addEventListener("carritoModificado", fetchCartCount);
    return () => {
      window.removeEventListener("abrirCarrito", fetchCartCount);
      window.removeEventListener("carritoModificado", fetchCartCount);
    };
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <PanelCarrito isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="mobile-top-bar">
        <Link viewTransition to="/" className="mtb-logo-link">
          <img className="mobile-top-logo" src="/logo.png" alt="Logo" />
        </Link>

        <div className="mobile-top-actions">
          <button className="mtb-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button className="mtb-icon-btn cart-icon-container" onClick={toggleCart} aria-label="Carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="mobile-search-overlay">
          <form className="mobile-search-inner" onSubmit={handleSearchSubmit}>
            <button type="button" className="mob-search-back" onClick={() => { setSearchOpen(false); setSearchTerm(""); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="mob-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button type="submit" className="mob-search-submit" aria-label="Buscar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </form>
        </div>
      )}

      {/* ===== DESKTOP HEADER ===== */}
      <header className={`header ${scrolled || shopHover || searchOpen || forceVisibleHeader ? "scrolled" : ""}`}>
        <div className="principal">
          <div className="header-left">
            <Link viewTransition to="/"><img className="header-right-logo" src="/logo.png" alt="Logo" /></Link>
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
            {/* Search Icon Toggle */}
            <button className="hdr-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Buscar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>

            {/* Cart Icon */}
            <button className="hdr-icon-btn cart-icon-container" onClick={toggleCart} aria-label="Carrito">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {user && isAdmin(user) && (
              <Link viewTransition to="/admin" className="header-admin-link">Admin</Link>
            )}

            {user ? (
              <button className="hdr-user-pill" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>{user.username}</span>
              </button>
            ) : (
              <Link viewTransition to="/login" className="hdr-icon-btn" aria-label="Ingresar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            )}
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="search-expand">
            <form className="search-expand-form" onSubmit={handleSearchSubmit}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                className="search-expand-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button type="button" className="search-close-btn" onClick={() => { setSearchOpen(false); setSearchTerm(""); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </form>
          </div>
        )}

        {/* Mobile Bottom Nav */}
        <nav className="mobile-nav" aria-label="Navegacion principal movil">
          <Link viewTransition to="/" className={`mobile-nav-item ${isPathActive("/") ? "active" : ""}`}>
            <span className="mobile-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 10.8 12 3l9 7.8V20a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1v-9.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Inicio</span>
          </Link>
          <Link viewTransition to="/busqueda" className={`mobile-nav-item ${isPathActive("/busqueda") ? "active" : ""}`}>
            <span className="mobile-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span>Buscar</span>
          </Link>
          <Link viewTransition to="/RopaInfo" className={`mobile-nav-item ${isPathActive("/ropainfo") ? "active" : ""}`}>
            <span className="mobile-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M8.5 7.5 12 5l3.5 2.5h3l1.2 3.9L18.8 13V20H5.2v-7L4.3 11.4 5.5 7.5h3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Tienda</span>
          </Link>
        </nav>

        {shopHover && (
          <div className="sale" onMouseEnter={openSale} onMouseLeave={closeSaleNow}>
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
