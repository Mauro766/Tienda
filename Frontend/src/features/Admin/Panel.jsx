import { useState } from "react";
import "../../styles/Admin/adminPanel.css";
import CrearProducto from "../Ropa/CrearProducto";
import VerProductos from "../Ropa/VerProductos";
import EditarProducto from "../Ropa/EditarProducto";
import EliminarProducto from "../Ropa/EliminarProducto";
import RopaOculta from "../Ropa/RopaOculta";

function Panel() {
    const [activeView, setActiveView] = useState('crear'); // Default to crear
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleTokenSave = () => {
        localStorage.setItem('token', token);
        setToken(token);
        alert('Token guardado correctamente');
    };

    const renderContent = () => {
        switch (activeView) {
            case 'ver':
                return <VerProductos token={token} />;
            case 'crear':
                return <CrearProducto token={token} setToken={setToken} />;
            case 'editar':
                return <EditarProducto token={token} />;
            case 'eliminar':
                return <EliminarProducto token={token} />;
            case 'oculta':
                return <RopaOculta token={token} />;
            default:
                return <CrearProducto token={token} setToken={setToken} />;
        }
    };

    const menuItems = [
        { key: 'ver', label: 'Ver Productos', icon: '👁️' },
        { key: 'crear', label: 'Crear Producto', icon: '➕' },
        { key: 'editar', label: 'Editar Producto', icon: '✏️' },
        { key: 'eliminar', label: 'Eliminar Producto', icon: '🗑️' },
        { key: 'oculta', label: 'Productos Ocultos', icon: '🙈' },
    ];

    return (
        <div className="admin-panel">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="user-info">
                        <img src="/user.png" alt="Admin" className="user-avatar" />
                        <h3>Administrador</h3>
                        <p>Panel de Control</p>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.key}
                            className={`nav-item ${activeView === item.key ? 'active' : ''}`}
                            onClick={() => {
                                setActiveView(item.key);
                                setSidebarOpen(false); // Close sidebar on mobile after selection
                            }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="token-section">
                        <label htmlFor="admin-token">Token de Autenticación</label>
                        <input
                            id="admin-token"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Ingrese token..."
                        />
                        <button className="save-token-btn" onClick={handleTokenSave}>
                            Guardar Token
                        </button>
                        <div className={`token-status ${token ? 'valid' : 'invalid'}`}>
                            {token ? '✅ Token válido' : '❌ Token requerido'}
                        </div>
                    </div>
                </div>
            </aside>
            <main className="main-content">
                <header className="content-header">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        ☰
                    </button>
                    <h1>{menuItems.find(item => item.key === activeView)?.label}</h1>
                </header>
                <div className="content-body">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default Panel;