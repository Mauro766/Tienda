import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  Edit3,
  Trash2,
  EyeOff,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Send,
} from "lucide-react";
import { cn } from "../../utils/cn";
import CrearProducto from "../Ropa/CrearProducto";
import VerProductos from "../Ropa/VerProductos";
import EditarProducto from "../Ropa/EditarProducto";
import EliminarProducto from "../Ropa/EliminarProducto";
import RopaOculta from "../Ropa/RopaOculta";
import { getUserFromToken, logout, refreshAuthUser } from "../../utils/auth";
import "../../styles/Admin/adminPanel.css";
import AdminPedidos from "../Pedidos/AdminPedidos";

function Panel() {
  const [activeView, setActiveView] = useState("ver");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isPedidosView = activeView === "pedidos";

  useEffect(() => {
    let active = true;
    const currentUser = getUserFromToken();
    setUser(currentUser);

    refreshAuthUser().then((freshUser) => {
      if (active) {
        setUser(freshUser);
      }
    });

    return () => {
      active = false;
    };
  }, [location]);

  useEffect(() => {
    if (isPedidosView) {
      setSidebarOpen(false);
    }
  }, [isPedidosView]);

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  const menuItems = [
    {
    key: "pedidos",
    label: "Pedidos",
    subtitle: "Mostrar productos para enviar",
    icon: Send,
  },
  {
    key: "ver",
    label: "Ver productos",
    subtitle: "Inventario y estado general",
    icon: LayoutDashboard,
  },
  {
    key: "crear",
    label: "Crear producto",
    subtitle: "Alta de nuevos articulos",
    icon: PlusCircle,
  },
  {
    key: "editar",
    label: "Editar producto",
    subtitle: "Actualizar datos y precios",
    icon: Edit3,
  },
  {
    key: "eliminar",
    label: "Eliminar producto",
    subtitle: "Ocultar o borrar del catalogo",
    icon: Trash2,
  },
  {
    key: "oculta",
    label: "Productos ocultos",
    subtitle: "Reactivar articulos inactivos",
    icon: EyeOff,
  },

  ];

  const activeItem = menuItems.find((item) => item.key === activeView) || menuItems[0];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderContent = () => {
    const components = {
      ver: <VerProductos />,
      crear: <CrearProducto />,
      editar: <EditarProducto />,
      eliminar: <EliminarProducto />,
      oculta: <RopaOculta />,
      pedidos: <AdminPedidos />,
    };

    return components[activeView] || <VerProductos />;
  };

  return (
    <div className="admin-panel-container">
      <div className="bg-decorations">
        <div className="decoration-1" />
        <div className="decoration-2" />
        <div className="decoration-grid" />
      </div>

      {!isPedidosView && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mobile-toggle"
          aria-label={sidebarOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <div className={cn("admin-layout", isPedidosView && "admin-layout-full")}>
        <AnimatePresence>
          {!isPedidosView && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="sidebar-overlay"
            />
          )}
        </AnimatePresence>

        {!isPedidosView && (
          <aside className={cn("sidebar", sidebarOpen && "open")}>
            <div className="sidebar-content">
              <div className="profile-section">
                <div className="profile-info">
                  <div className="profile-avatar">
                    <UserIcon size={24} />
                  </div>
                  <div className="profile-details">
                    <h3 className="profile-name">{user?.username || "Administrador"}</h3>
                    <span className="profile-badge">Administracion</span>
                  </div>
                </div>
              </div>

              <nav className="sidebar-nav">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveView(item.key);
                        setSidebarOpen(false);
                      }}
                      className={cn("nav-item", isActive && "active")}
                    >
                      <div className="nav-item-content">
                        <Icon size={18} className="nav-icon" />
                        <div className="nav-text-group">
                          <span className="nav-label">{item.label}</span>
                          <small className="nav-subtitle">{item.subtitle}</small>
                        </div>
                      </div>
                      {isActive && <motion.div layoutId="activeDot" className="active-dot" />}
                    </button>
                  );
                })}
              </nav>

              <div className="logout-section">
                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Cerrar sesion</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        <main className={cn("main-content", isPedidosView && "pedidos-mode")}>
          {!isPedidosView && (
            <header className="content-header">
              <div>
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="breadcrumb"
                >

                </motion.div>
                <h1 className="page-title">{activeItem.label}</h1>

              </div>
            </header>
          )}

          {isPedidosView && (
            <div className="pedidos-mode-toolbar">
              <button
                type="button"
                className="admin-btn admin-btn-neutral"
                onClick={() => setActiveView("ver")}
              >
                Volver al panel
              </button>
            </div>
          )}

          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="content-wrapper"
          >
            <div className="glass-container">{renderContent()}</div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Panel;
