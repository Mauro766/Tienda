import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Search,
  Edit3,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import { getProductosAdmin, getProductoById, actualizarProducto } from "../../services/RopaService";
import { getCategorias, crearCategoria } from "../../services/CategoriaService";
import { formatImageUrl } from "../../config";

function EditarProducto() {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    talles: "",
    color: "",
    descripcion: "",
  });
  const [images, setImages] = useState([]);
  const [imageMode, setImageMode] = useState("add");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  // Categorias
  const [categorias, setCategorias] = useState([]);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    if (location.state?.productoId && !selectedProducto) {
      handleSelectProducto(location.state.productoId);
    }
  }, [location.state, selectedProducto]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosAdmin();
        const productosData = Array.isArray(data) ? data : data?.content || [];
        setProductos(productosData);
      } catch (err) {
        setError(err.message || "No se pudo cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data || []);
      } catch (err) {
        console.error("Error cargando categorias", err);
      }
    };
    fetchCats();
  }, []);

  const handleSelectProducto = async (id) => {
    try {
      setLoading(true);
      const producto = await getProductoById(id);
      setSelectedProducto(producto);
      const tallasStr = Array.isArray(producto.tallas) ? producto.tallas.join(", ") : "";
      setFormData({
        nombre: producto.nombre || "",
        precio: producto.precio || "",
        stock: producto.stock || "",
        categoria: producto.categoria || "",
        talles: tallasStr,
        color: producto.color || "",
        descripcion: producto.descripcion || "",
      });
      setImages([]);
      setImageMode("add");
      setSuccess(null);
      setError(null);
    } catch (_err) {
      setError("Error al cargar detalles del producto");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (imageMode === "replace") {
      setImages(files);
    } else {
      setImages((prev) => [...prev, ...files]);
    }

    e.target.value = "";
  };

  const handleCategoriaKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = (formData.categoria || "").trim();
      if (!val) return;

      const existe = categorias.find((c) => c.nombre.toLowerCase() === val.toLowerCase());
      if (!existe) {
        setCreatingCat(true);
        try {
          const nueva = await crearCategoria(val);
          setCategorias((prev) => [...prev, nueva]);
          setFormData((prev) => ({ ...prev, categoria: nueva.nombre }));
          setSuccess(`Categoria "${nueva.nombre}" guardada en la base de datos.`);
        } catch (err) {
          setError("No se pudo guardar la categoria en la base de datos.");
        } finally {
          setCreatingCat(false);
        }
      }
      setShowCatDropdown(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const catVal = (formData.categoria || "").trim();
      if (catVal) {
        const existe = categorias.find((c) => c.nombre.toLowerCase() === catVal.toLowerCase());
        if (!existe) {
          try {
            const nueva = await crearCategoria(catVal);
            setCategorias((prev) => [...prev, nueva]);
          } catch (errCat) {
            console.error("No se pudo autoguardar la categoria", errCat);
          }
        }
      }

      const tallasArray = formData.talles
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const dto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        stock: formData.stock,
        categoria: formData.categoria,
        marca: selectedProducto.marca ?? "",
        tallas: tallasArray,
        color: formData.color,
        activo: true,
      };

      await actualizarProducto(
        selectedProducto.id,
        dto,
        images,
        imageMode === "add" ? "agregar" : "reemplazar"
      );
      
      setSuccess("Producto actualizado con exito.");

      const data = await getProductosAdmin();
      const productosData = Array.isArray(data) ? data : data?.content || [];
      setProductos(productosData);
    } catch (err) {
      setError(err.message || "Error al actualizar");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProductos = productos.filter((p) => {
    const nombre = p.nombre?.toLowerCase() || "";
    const categoria = p.categoria?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return nombre.includes(term) || categoria.includes(term);
  });

  if (loading && !selectedProducto) {
    return (
      <div className="admin-view">
        <div className="admin-empty">
          <Loader2 className="spin-icon" size={28} />
          <p>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="admin-view admin-edit-view">
      <header className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Editar catalogo</h2>
          <p className="admin-view-desc">Selecciona un producto para modificar su informacion.</p>
        </div>

        {selectedProducto && (
          <button onClick={() => setSelectedProducto(null)} className="admin-btn admin-btn-neutral">
            <ArrowLeft size={16} /> Volver a la lista
          </button>
        )}
      </header>

      {!selectedProducto ? (
        <div>
          <div className="admin-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o categoria"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredProductos.length === 0 ? (
            <div className="admin-empty">
              <Package size={40} />
              <p>No se encontraron productos.</p>
            </div>
          ) : (
            <div className="admin-list">
              {filteredProductos.map((p) => (
                <article key={p.id} className="admin-list-item">
                  <div className="admin-list-left">
                    <img
                      className="admin-list-thumb"
                      src={formatImageUrl(p.imagenesUrl?.[0], "/Campera.jpg")}
                      alt={p.nombre}
                    />
                    <div>
                      <h3 className="admin-list-title">{p.nombre}</h3>
                      <p className="admin-list-meta">
                        {p.categoria} | ${p.precio}
                      </p>
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button onClick={() => handleSelectProducto(p.id)} className="admin-btn admin-btn-primary" title="Editar">
                      <Edit3 size={16} /> Editar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form
          key="form"
          onSubmit={handleSubmit}
          className="admin-form"
        >
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            </div>

            <div className="admin-field">
              <label htmlFor="precio">Precio</label>
              <input id="precio" type="number" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} />
            </div>

            <div className="admin-field">
              <label htmlFor="stock">Stock</label>
              <input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </div>

            {/* Selector y creador dinamico de categorias */}
            <div className="admin-field">
              <label htmlFor="categoria">Categoria</label>
              <div className="admin-cat-container">
                <input
                  id="categoria"
                  type="text"
                  placeholder="Remeras, Camperas (Enter para nueva)"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  onFocus={() => setShowCatDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCatDropdown(false), 180)}
                  onKeyDown={handleCategoriaKeyDown}
                  required
                  disabled={creatingCat}
                />
                {showCatDropdown && (
                  <ul className="admin-cat-dropdown">
                    {categorias
                      .filter((c) => c.nombre.toLowerCase().includes((formData.categoria || "").toLowerCase()))
                      .map((c) => (
                        <li
                          key={c.id}
                          className={`admin-cat-item ${formData.categoria.toLowerCase() === c.nombre.toLowerCase() ? "selected" : ""}`}
                          onMouseDown={() => {
                            setFormData((prev) => ({ ...prev, categoria: c.nombre }));
                            setShowCatDropdown(false);
                          }}
                        >
                          <span>{c.nombre}</span>
                        </li>
                      ))}
                    {formData.categoria && !categorias.some((c) => c.nombre.toLowerCase() === formData.categoria.trim().toLowerCase()) && (
                      <li
                        className="admin-cat-item admin-cat-item-new"
                        onMouseDown={async () => {
                          const val = formData.categoria.trim();
                          if (!val) return;
                          setCreatingCat(true);
                          try {
                            const nueva = await crearCategoria(val);
                            setCategorias((prev) => [...prev, nueva]);
                            setFormData((prev) => ({ ...prev, categoria: nueva.nombre }));
                            setSuccess(`Categoria "${nueva.nombre}" guardada en la base de datos.`);
                          } catch (err) {
                            setError("No se pudo guardar la categoria en la base de datos.");
                          } finally {
                            setCreatingCat(false);
                          }
                        }}
                      >
                        <span>+ Crear y elegir "{formData.categoria}"</span>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="talles">Tallas</label>
              <input id="talles" type="text" value={formData.talles} onChange={(e) => setFormData({ ...formData, talles: e.target.value })} placeholder="S, M, L" />
            </div>

            <div className="admin-field">
              <label htmlFor="color">Color</label>
              <input id="color" type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
            </div>


            <div className="admin-field admin-field-full">
              <label>Imágenes del producto</label>

              <div className="admin-field">
                <label>¿Qué querés hacer?</label>

                <div className="admin-actions">
                  <button
                    type="button"
                    className={`admin-btn ${imageMode === "add"
                      ? "admin-btn-primary"
                      : "admin-btn-neutral"
                      }`}
                    onClick={() => {
                      setImageMode("add");
                      setImages([]);
                    }}
                  >
                    Agregar imágenes
                  </button>

                  <button
                    type="button"
                    className={`admin-btn ${imageMode === "replace"
                      ? "admin-btn-primary"
                      : "admin-btn-neutral"
                      }`}
                    onClick={() => {
                      setImageMode("replace");
                      setImages([]);
                    }}
                  >
                    Reemplazar todas
                  </button>
                </div>

                <p className="admin-list-meta">
                  {imageMode === "add"
                    ? "Las imágenes nuevas se sumarán a las actuales."
                    : "Las imágenes actuales serán reemplazadas por las nuevas."}
                </p>
              </div>

              <div className="admin-actions">
                <label
                  className="admin-btn admin-btn-neutral"
                  htmlFor="imagenes"
                >
                  <ImageIcon size={16} />
                  Seleccionar imágenes
                </label>

                <input
                  id="imagenes"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="admin-list" style={{ marginTop: 16 }}>
                {imageMode === "add" &&
                  (selectedProducto.imagenesUrl || []).map((url, index) => (
                    <article key={`actual-${index}`} className="admin-list-item">
                      <div className="admin-list-left">
                        <img
                          className="admin-list-thumb"
                          src={formatImageUrl(url, "/Campera.jpg")}
                          alt={`Imagen actual ${index + 1}`}
                        />
                        <p className="admin-list-meta">Imagen actual</p>
                      </div>
                    </article>
                  ))}

                {images.map((file, index) => (
                  <article
                    key={`${file.name}-${index}`}
                    className="admin-list-item"
                  >
                    <div className="admin-list-left">
                      <img
                        className="admin-list-thumb"
                        src={URL.createObjectURL(file)}
                        alt={`Imagen nueva ${index + 1}`}
                      />
                      <div>
                        <p className="admin-list-title">{file.name}</p>
                        <p className="admin-list-meta">
                          {imageMode === "add" ? "Se agregará" : "Reemplazará las actuales"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="admin-btn admin-btn-neutral"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      Quitar
                    </button>
                  </article>
                ))}
              </div>
            </div>

          </div>


          <>
            {success && (
              <div className="admin-alert admin-alert-success">
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="admin-alert admin-alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </>

          <button type="submit" disabled={submitting} className="admin-submit">
            {submitting ? <Loader2 className="spin-icon" size={18} /> : <Save size={18} />}
            {submitting ? "Actualizando..." : "Guardar cambios"}
          </button>
        </form>
      )}
    </section>
  );
}

export default EditarProducto;
