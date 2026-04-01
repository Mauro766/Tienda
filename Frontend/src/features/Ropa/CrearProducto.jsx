import { useState } from "react";
import { crearProducto } from "../../services/RopaService";

const INITIAL_FORM = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria: "",
  marca: "",
  color: "",
};

function CrearProducto() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imagenes, setImagenes] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [tallaInput, setTallaInput] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTalla = () => {
    const val = tallaInput.trim().toUpperCase();
    if (val && !tallas.includes(val)) {
      setTallas((prev) => [...prev, val]);
    }
    setTallaInput("");
  };

  const handleTallaKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTalla();
    }
  };

  const handleRemoveTalla = (t) => {
    setTallas((prev) => prev.filter((x) => x !== t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (!token.trim()) {
      setError("Falta token JWT de admin.");
      return;
    }

    if (!imagenes || imagenes.length === 0) {
      setError("Tenés que seleccionar al menos una imagen.");
      return;
    }

    if (tallas.length === 0) {
      setError("Tenés que agregar al menos una talla.");
      return;
    }

    const payload = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      tallas,
    };

    setLoading(true);
    try {
      const creado = await crearProducto(payload, imagenes);
      setOk(`Producto creado: ${creado?.nombre ?? "OK"}`);
      setForm(INITIAL_FORM);
      setImagenes([]);
      setTallas([]);
      e.target.reset();
    } catch (err) {
      setError(err.message || "No se pudo crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="crear-producto">
      <h2>Panel Admin: Crear producto</h2>

      <form onSubmit={handleSubmit} className="crear-producto-form">

        {/* 🔐 TOKEN TEMPORAL */}
        <input
          type="text"
          placeholder="Token JWT de admin"
          value={token}
          onChange={(e) => {
            const value = e.target.value;
            setToken(value);
            localStorage.setItem("token", value);
          }}
          required
        />

        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={onFieldChange} required />
        <input name="descripcion" placeholder="Descripcion" value={form.descripcion} onChange={onFieldChange} required />

        <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={onFieldChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={onFieldChange} required />

        <input name="categoria" placeholder="Categoria" value={form.categoria} onChange={onFieldChange} required />
        <input name="marca" placeholder="Marca" value={form.marca} onChange={onFieldChange} required />

        <input name="color" placeholder="Color" value={form.color} onChange={onFieldChange} required />

        {/* 🏷️ SELECTOR DE TALLAS MÚLTIPLES */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Agregar talla (ej: S, M, L, XL) y presioná Enter"
              value={tallaInput}
              onChange={(e) => setTallaInput(e.target.value)}
              onKeyDown={handleTallaKeyDown}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={handleAddTalla} style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', background: '#111', color: '#fff', border: 'none' }}>
              +
            </button>
          </div>
          {tallas.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {tallas.map((t) => (
                <span key={t} style={{
                  background: '#f0f1f4',
                  border: '1px solid #ccc',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTalla(t)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#888', padding: 0, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <input type="file" accept="image/*" multiple onChange={(e) => setImagenes(Array.from(e.target.files))} required />
        {imagenes.length > 0 && (
          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px', marginTop: '5px'}}>
            {imagenes.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`preview ${idx}`}
                style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ccc'}}
              />
            ))}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear producto"}
        </button>
      </form>

      {error && <p>{error}</p>}
      {ok && <p>{ok}</p>}
    </section>
  );
}

export default CrearProducto;