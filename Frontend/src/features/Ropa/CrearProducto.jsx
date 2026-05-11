import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Upload, Save, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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

    if (!imagenes || imagenes.length === 0) {
      setError("Debes seleccionar al menos una imagen.");
      return;
    }

    if (tallas.length === 0) {
      setError("Debes agregar al menos una talla.");
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
      setOk(`Producto "${creado?.nombre}" creado con exito.`);
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

  const InputField = ({ label, name, type = "text", full = false, ...props }) => (
    <div className={`admin-field ${full ? "admin-field-full" : ""}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} {...props} />
    </div>
  );

  return (
    <section className="admin-view admin-create-view">
      <header className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Nuevo producto</h2>
          <p className="admin-view-desc">Completa los detalles para agregar un nuevo articulo al catalogo.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">
          <InputField label="Nombre" name="nombre" placeholder="Ej: Campera Bomber Navy" value={form.nombre} onChange={onFieldChange} required />
          <InputField label="Marca" name="marca" placeholder="Ej: Nike" value={form.marca} onChange={onFieldChange} required />
          <InputField label="Descripcion" name="descripcion" full placeholder="Detalles de la prenda" value={form.descripcion} onChange={onFieldChange} required />
          <InputField label="Precio" name="precio" type="number" placeholder="0" value={form.precio} onChange={onFieldChange} required />
          <InputField label="Stock inicial" name="stock" type="number" placeholder="10" value={form.stock} onChange={onFieldChange} required />
          <InputField label="Categoria" name="categoria" placeholder="Remeras, Camperas" value={form.categoria} onChange={onFieldChange} required />
          <InputField label="Color" name="color" placeholder="Negro, Azul" value={form.color} onChange={onFieldChange} required />
        </div>

        <div className="admin-field">
          <label htmlFor="talla-input">Tallas disponibles</label>
          <div className="admin-size-row">
            <input
              id="talla-input"
              type="text"
              placeholder="Escribe talle (S, M, L) y Enter"
              value={tallaInput}
              onChange={(e) => setTallaInput(e.target.value)}
              onKeyDown={handleTallaKeyDown}
            />
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleAddTalla}>
              <Plus size={16} />
            </button>
          </div>

          <div className="admin-size-tags">
            <AnimatePresence>
              {tallas.map((t) => (
                <motion.span key={t} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="admin-size-tag">
                  {t}
                  <button type="button" onClick={() => handleRemoveTalla(t)} aria-label={`Quitar talla ${t}`}>
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="admin-field">
          <label>Imagenes del producto</label>
          <div className="admin-file-drop">
            <input type="file" accept="image/*" multiple onChange={(e) => setImagenes(Array.from(e.target.files || []))} required />
            <Upload size={26} />
            <p>Haz clic aqui para subir imagenes (JPG, PNG, WEBP)</p>
          </div>

          {imagenes.length > 0 && (
            <div className="admin-preview-grid">
              {imagenes.map((file, idx) => (
                <motion.img key={`${file.name}-${idx}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} src={URL.createObjectURL(file)} alt={`preview-${idx}`} />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="admin-alert admin-alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
          {ok && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="admin-alert admin-alert-success">
              <CheckCircle2 size={18} />
              <span>{ok}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading} className="admin-submit">
          {loading ? <Loader2 size={18} className="spin-icon" /> : <Save size={18} />}
          {loading ? "Procesando..." : "Guardar producto"}
        </button>
      </form>
    </section>
  );
}

export default CrearProducto;
