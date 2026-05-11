import { useEffect, useMemo, useState } from "react";
import { getPedidos, cambiarDeEstado } from "../../services/PedidoService";
import "../../styles/Pedido/adminPedidos.css";

const estados = ["PENDIENTE", "ARCHIVADO", "ENVIADO", "CANCELADO"];

const estadoClassMap = {
  PENDIENTE: "estado-pendiente",
  ARCHIVADO: "estado-archivado",
  ENVIADO: "estado-enviado",
  CANCELADO: "estado-cancelado",
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatCurrency = (value) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return `$${value ?? 0}`;
  return currencyFormatter.format(numberValue);
};

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return dateFormatter.format(date);
};

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [activeTab, setActiveTab] = useState("todos");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPedidos = async () => {
    try {
      const data = await getPedidos();
      const pedidosOrdenados = [...data].sort((a, b) => {
        const fechaA = a?.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b?.fecha ? new Date(b.fecha).getTime() : 0;
        return fechaB - fechaA;
      });

      setPedidos(pedidosOrdenados);
      if (pedidosOrdenados.length > 0) {
        setSelectedPedidoId((prev) => prev ?? pedidosOrdenados[0].id);
      }
    } catch (err) {
      setError(err.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const enviadosCount = useMemo(
    () => pedidos.filter((pedido) => pedido.estado === "ENVIADO").length,
    [pedidos]
  );

  const pendientesCount = useMemo(
    () => pedidos.filter((pedido) => pedido.estado === "PENDIENTE").length,
    [pedidos]
  );

  const canceladosCount = useMemo(
    () => pedidos.filter((pedido) => pedido.estado === "CANCELADO").length,
    [pedidos]
  );

  const pedidosPorTab = useMemo(() => {
    if (activeTab === "enviados") {
      return pedidos.filter((pedido) => pedido.estado === "ENVIADO");
    }else if(activeTab === "pendientes"){
       return pedidos.filter((pedido) => pedido.estado === "PENDIENTE");
    }else if(activeTab === "cancelados"){
      return pedidos.filter((pedido) => pedido.estado === "CANCELADO");
    }
    return pedidos;
  }, [pedidos, activeTab]);

  const filteredPedidos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pedidosPorTab;

    return pedidosPorTab.filter((pedido) => {
      const username = pedido.usuario?.username?.toLowerCase() || "";
      const correo = pedido.usuario?.correoElectronico?.toLowerCase() || "";
      const ciudad = pedido.ciudad?.toLowerCase() || "";
      const direccion = pedido.direccion?.toLowerCase() || "";
      const numero = String(pedido.id || "");
      return (
        username.includes(term) ||
        correo.includes(term) ||
        ciudad.includes(term) ||
        direccion.includes(term) ||
        numero.includes(term)
      );
    });
  }, [pedidosPorTab, search]);

  useEffect(() => {
    if (filteredPedidos.length === 0) {
      setSelectedPedidoId(null);
      return;
    }

    setSelectedPedidoId((prev) => {
      if (prev && filteredPedidos.some((pedido) => pedido.id === prev)) return prev;
      return filteredPedidos[0].id;
    });
  }, [filteredPedidos]);

  const pedidoSeleccionado = useMemo(() => {
    if (filteredPedidos.length === 0) return null;
    return filteredPedidos.find((pedido) => pedido.id === selectedPedidoId) || filteredPedidos[0];
  }, [filteredPedidos, selectedPedidoId]);

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      setUpdatingId(id);
      await cambiarDeEstado(id, nuevoEstado);

      setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
    } catch (err) {
      alert("Error al cambiar estado");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-view admin-pedidos-view">
      <header className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Gestion de pedidos</h2>
          <p className="admin-view-desc">
            Selecciona una persona para ver el detalle completo de su pedido.
          </p>
        </div>
        <span className="admin-chip">{pendientesCount} pedidos</span>
      </header>

      {error && <div className="admin-alert admin-alert-error pedidos-alert">{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="admin-empty">No hay pedidos todavia.</div>
      ) : (
        <div className="pedidos-layout">
          <aside className="admin-card pedidos-list-panel">
            <div className="pedidos-list-header">
              <h3>Personas que pidieron</h3>
              <p>{filteredPedidos.length} resultados</p>
            </div>

            <div className="pedidos-tabs" role="tablist" aria-label="Filtros de estado">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "todos"}
                className={`pedidos-tab-btn ${activeTab === "todos" ? "active" : ""}`}
                onClick={() => setActiveTab("todos")}
              >
                Todos ({pedidos.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "enviados"}
                className={`pedidos-tab-btn ${activeTab === "enviados" ? "active" : ""}`}
                onClick={() => setActiveTab("enviados")}
              >
                Enviados ({enviadosCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "pendientes"}
                className={`pedidos-tab-btn ${activeTab === "pendientes" ? "active" : ""}`}
                onClick={() => setActiveTab("pendientes")}
              >
                Pendientes ({pendientesCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "cancelados"}
                className={`pedidos-tab-btn ${activeTab === "cancelados" ? "active" : ""}`}
                onClick={() => setActiveTab("cancelados")}
              >
                Cancelados ({canceladosCount})
              </button>
            </div>

            <div className="pedidos-search-wrap">
              <input
                type="text"
                placeholder="Buscar por nombre, correo, ciudad, direccion o #pedido"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="pedidos-list">
              {filteredPedidos.length === 0 ? (
                <div className="admin-empty pedidos-empty-search">No se encontraron pedidos con ese filtro.</div>
              ) : (
                filteredPedidos.map((pedido) => {
                  const isSelected = pedido.id === pedidoSeleccionado?.id;
                  const estadoClass = estadoClassMap[pedido.estado] || "estado-default";

                  return (
                    <button
                      type="button"
                      key={pedido.id}
                      className={`pedido-list-item ${isSelected ? "active" : ""}`}
                      onClick={() => setSelectedPedidoId(pedido.id)}
                    >
                      <div className="pedido-list-top">
                        <strong>{pedido.usuario?.username || "Usuario sin nombre"}</strong>
                        <span className={`pedido-estado-chip ${estadoClass}`}>{pedido.estado}</span>
                      </div>
                      <p className="pedido-list-email">
                        {pedido.usuario?.correoElectronico || "Correo no disponible"}
                      </p>
                      <div className="pedido-list-meta">
                        <span>#{pedido.id}</span>
                        <span>{formatDate(pedido.fecha)}</span>
                        <strong>{formatCurrency(pedido.total)}</strong>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="admin-card pedido-detail-panel">
            {!pedidoSeleccionado ? (
              <div className="admin-empty">Selecciona un pedido para ver el detalle.</div>
            ) : (
              <>
                <header className="pedido-detail-head">
                  <div>
                    <h3>Pedido #{pedidoSeleccionado.id}</h3>
                    <p>{formatDate(pedidoSeleccionado.fecha)}</p>
                  </div>
                  <span
                    className={`pedido-estado-chip ${
                      estadoClassMap[pedidoSeleccionado.estado] || "estado-default"
                    }`}
                  >
                    {pedidoSeleccionado.estado}
                  </span>
                </header>

                <div className="pedido-detail-grid">
                  <div>
                    <span>Persona</span>
                    <strong>{pedidoSeleccionado.usuario?.username || "No disponible"}</strong>
                  </div>
                  <div>
                    <span>Correo</span>
                    <strong>{pedidoSeleccionado.usuario?.correoElectronico || "No disponible"}</strong>
                  </div>
                  <div>
                    <span>Telefono</span>
                    <strong>{pedidoSeleccionado.telefono || "No disponible"}</strong>
                  </div>
                  <div>
                    <span>Ciudad</span>
                    <strong>{pedidoSeleccionado.ciudad || "No disponible"}</strong>
                  </div>
                  <div>
                    <span>Direccion</span>
                    <strong>{pedidoSeleccionado.direccion || "No disponible"}</strong>
                  </div>
                </div>

                <div className="pedido-detail-status-row">
                  <label htmlFor="estadoPedidoSelect">Actualizar estado</label>
                  <select
                    id="estadoPedidoSelect"
                    value={pedidoSeleccionado.estado}
                    disabled={updatingId === pedidoSeleccionado.id}
                    onChange={(e) => handleChangeEstado(pedidoSeleccionado.id, e.target.value)}
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pedido-products">
                  <h4>Productos del pedido</h4>
                  {!pedidoSeleccionado.items?.length ? (
                    <div className="admin-empty">Este pedido no tiene items cargados.</div>
                  ) : (
                    <ul>
                      {pedidoSeleccionado.items.map((item) => {
                        const precio = Number(item.precio || 0);
                        const cantidad = Number(item.cantidad || 0);
                        const subtotal = precio * cantidad;

                        return (
                          <li key={item.id} className="pedido-product-item">
                            <div>
                              <strong>{item.producto?.nombre || "Producto"}</strong>
                              <p>Cantidad: {item.cantidad}</p>
                            </div>
                            <div className="pedido-product-prices">
                              <span>{formatCurrency(item.precio)}</span>
                              <strong>{formatCurrency(subtotal)}</strong>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <footer className="pedido-total-row">
                  <span>Total del pedido</span>
                  <strong>{formatCurrency(pedidoSeleccionado.total)}</strong>
                </footer>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminPedidos;
