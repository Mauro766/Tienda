
import { useEffect, useRef, useState } from "react";
import {
  getPacksAdmin,
  crearPack,
  actualizarPack,
  desactivarPack,
} from "../../services/packService";
import { getProductosAdmin } from "../../services/RopaService";
import "../../styles/Admin/packsAdmin.css";
import "../../styles/Admin/adminPanel.css";

const initialForm = {
  nombre: "",
  descripcion: "",
  ropaSuperiorId: "",
  ropaInferiorId: "",
  precioPack: "",
};

function PacksAdmin() {
  const [packs, setPacks] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [editingPack, setEditingPack] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");

    try {
      const [packsData, productosData] = await Promise.all([
        getPacksAdmin(),
        getProductosAdmin(),
      ]);

      setPacks(Array.isArray(packsData) ? packsData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cambiarCampo = (e) => {
    const { name, value } = e.target;
    setForm((actual) => ({ ...actual, [name]: value }));
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];

    setImagen(archivo || null);
    setPreview((actual) => {
      if (actual.startsWith("blob:")) URL.revokeObjectURL(actual);
      return archivo ? URL.createObjectURL(archivo) : "";
    });
  };

  const limpiarFormulario = () => {
    setForm(initialForm);
    setImagen(null);
    setPreview("");
    setEditingPack(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const iniciarEdicion = (pack) => {
    if (editingPack?.id === pack.id) return;

    if (
      editingPack &&
      editingPack.id !== pack.id &&
      !window.confirm("¿Descartar los cambios sin guardar y editar otro pack?")
    ) {
      return;
    }

    setError("");
    setMensaje("");
    setEditingPack(pack);
    setForm({
      nombre: pack.nombre || "",
      descripcion: pack.descripcion || "",
      ropaSuperiorId: String(pack.ropaSuperiorId ?? ""),
      ropaInferiorId: String(pack.ropaInferiorId ?? ""),
      precioPack: pack.precioPack == null ? "" : String(pack.precioPack),
    });
    setImagen(null);
    setPreview(pack.imagenUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const superiores = productos.filter(
    (p) =>
      p.activo !== false ||
      String(p.id) === String(form.ropaSuperiorId)
  );
  const inferiores = productos.filter(
    (p) =>
      (p.activo !== false ||
        String(p.id) === String(form.ropaInferiorId)) &&
      String(p.id) !== String(form.ropaSuperiorId)
  );

  const productoSuperior = productos.find(
    (p) => String(p.id) === String(form.ropaSuperiorId)
  );

  const productoInferior = productos.find(
    (p) => String(p.id) === String(form.ropaInferiorId)
  );

  const precioTotal =
    Number(productoSuperior?.precio || 0) +
    Number(productoInferior?.precio || 0);

  const precioPromocional =
    form.precioPack.trim() === "" ? null : Number(form.precioPack);

  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (guardando || loading) return;
    setError("");
    setMensaje("");

    if (!editingPack && !imagen) {
      setError("Seleccioná una imagen del outfit.");
      return;
    }

    if (
      !form.ropaSuperiorId ||
      !form.ropaInferiorId ||
      form.ropaSuperiorId === form.ropaInferiorId
    ) {
      setError("Seleccioná dos prendas diferentes.");
      return;
    }

    if (
      precioPromocional !== null &&
      (!Number.isFinite(precioPromocional) || precioPromocional <= 0)
    ) {
      setError("El precio promocional debe ser mayor que cero.");
      return;
    }

    setGuardando(true);

    try {
      const nuevoPack = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        ropaSuperiorId: Number(form.ropaSuperiorId),
        ropaInferiorId: Number(form.ropaInferiorId),
        precioPack: precioPromocional,
      };

      if (editingPack) {
        await actualizarPack(
          editingPack.id,
          {
            ...nuevoPack,
            activo: editingPack.activo,
          },
          imagen
        );
        limpiarFormulario();
        setMensaje("Pack actualizado correctamente.");
      } else {
        await crearPack(nuevoPack, imagen);
        limpiarFormulario();
        setMensaje("¡Pack creado correctamente!");
      }
      await cargarDatos();
    } catch (err) {
      setError(
        err.message ||
          (editingPack
            ? "No se pudo actualizar el pack."
            : "No se pudo crear el pack.")
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarDesactivacion = async (id) => {
    if (guardando || loading) return;
    const confirmar = window.confirm(
      "¿Querés desactivar este pack? Las prendas originales no se modificarán."
    );

    if (!confirmar) return;

    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      await desactivarPack(id);
      setMensaje("Pack desactivado correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo desactivar el pack.");
    } finally {
      setGuardando(false);
    }
  };

  const manejarReactivacion = async (pack) => {
    if (guardando || loading) return;

    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      await actualizarPack(pack.id, {
        nombre: pack.nombre,
        descripcion: pack.descripcion || "",
        ropaSuperiorId: pack.ropaSuperiorId,
        ropaInferiorId: pack.ropaInferiorId,
        precioPack: pack.precioPack ?? null,
        activo: true,
      });
      setMensaje("Pack reactivado correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo reactivar el pack.");
    } finally {
      setGuardando(false);
    }
  };

  const precio = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(Number(valor || 0));

  if (loading) {
    return <p>Cargando packs y productos...</p>;
  }

  return (
    <section className="packs-admin">
      <header className="packs-admin__heading">
        <div>
          <span className="packs-admin__eyebrow">Catálogo · Colecciones</span>
          <h2 className="packs-admin__title">Packs y outfits</h2>
          <p className="packs-admin__subtitle">
            Creá conjuntos listos para vestir combinando prendas de tu catálogo.
          </p>
        </div>
      </header>

      {error && (
        <div className="packs-admin__message packs-admin__message--error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="packs-admin__message packs-admin__message--success">
          {mensaje}
        </div>
      )}

      <form
        className="packs-admin__form"
        onSubmit={enviarFormulario}
        ref={formRef}
      >
        <div className="packs-admin__form-heading">
          <div>
            <span className="packs-admin__eyebrow">
              {editingPack ? "Editar conjunto" : "Nuevo conjunto"}
            </span>
            <h3 className="packs-admin__section-title">
              {editingPack ? "Actualizar pack" : "Crear un pack"}
            </h3>
          </div>
          <p>
            {editingPack
              ? "Modificá los datos del conjunto. La imagen es opcional si querés conservar la actual."
              : "Completá los detalles, elegí las prendas y definí el precio."}
          </p>
        </div>

        <div className="packs-admin__form-main">
          <div className="packs-admin__details">
            <label className="packs-admin__label">
              Nombre del outfit
              <input
                className="packs-admin__input"
                name="nombre"
                value={form.nombre}
                onChange={cambiarCampo}
                maxLength={120}
                placeholder="Ej. Outfit Boca Streetwear"
                required
              />
            </label>

            <label className="packs-admin__label">
              Descripción
              <textarea
                className="packs-admin__input packs-admin__textarea"
                name="descripcion"
                value={form.descripcion}
                onChange={cambiarCampo}
                maxLength={500}
                rows={3}
                placeholder="Contá qué incluye este conjunto..."
              />
            </label>
          </div>

          <div className="packs-admin__image-field">
            <label className="packs-admin__label">
              Foto del outfit completo
              <input
                className="packs-admin__input packs-admin__file"
                type="file"
                accept="image/*"
                onChange={seleccionarImagen}
                required={!editingPack}
                ref={fileInputRef}
              />
            </label>

            <div className="packs-admin__preview-wrap" aria-live="polite">
              {preview ? (
                <img
                  className="packs-admin__preview"
                  src={preview}
                  alt="Vista previa del outfit"
                />
              ) : (
                <div className="packs-admin__preview-empty">
                  <strong>Vista previa</strong>
                  <span>
                    {editingPack
                      ? "Se conservará la imagen actual si no seleccionás otra."
                      : "La imagen seleccionada aparecerá en este espacio."}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="packs-admin__field-group">
          <div className="packs-admin__group-heading">
            <h4>Prendas incluidas</h4>
            <p>Elegí una prenda superior y otra inferior.</p>
          </div>

          <div className="packs-admin__product-grid">
            <label className="packs-admin__label">
              Prenda superior
              <select
                className="packs-admin__input"
                name="ropaSuperiorId"
                value={form.ropaSuperiorId}
                onChange={(e) => {
                  cambiarCampo(e);

                  if (String(form.ropaInferiorId) === e.target.value) {
                    setForm((actual) => ({
                      ...actual,
                      ropaSuperiorId: e.target.value,
                      ropaInferiorId: "",
                    }));
                  }
                }}
                required
              >
                <option value="">Elegí una prenda</option>

                {superiores.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} · {p.nombre}
                    {p.activo === false ? " (inactiva - seleccioná otra)" : ""}
                    {" — "}{precio(p.precio)}
                  </option>
                ))}
              </select>
            </label>

            <label className="packs-admin__label">
              Prenda inferior
              <select
                className="packs-admin__input"
                name="ropaInferiorId"
                value={form.ropaInferiorId}
                onChange={cambiarCampo}
                required
              >
                <option value="">Elegí una prenda</option>

                {inferiores.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} · {p.nombre}
                    {p.activo === false ? " (inactiva - seleccioná otra)" : ""}
                    {" — "}{precio(p.precio)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="packs-admin__pricing">
          <div className="packs-admin__price-box">
            <span>Precio total de las prendas</span>
            <strong>{precio(precioTotal)}</strong>
          </div>

          <label className="packs-admin__label packs-admin__promo-field">
            Precio promocional <span>(opcional)</span>
            <input
              className="packs-admin__input"
              type="number"
              name="precioPack"
              value={form.precioPack}
              onChange={cambiarCampo}
              min="0.01"
              step="0.01"
              placeholder="Vacío = usar el total de las prendas"
            />
          </label>

          {precioPromocional !== null &&
            Number.isFinite(precioPromocional) &&
            precioPromocional > 0 && (
              <div className="packs-admin__price-box packs-admin__price-box--promo">
                <span>Precio final del pack</span>
                <strong>{precio(precioPromocional)}</strong>
              </div>
            )}
        </div>

        <div className="packs-admin__form-actions">
          {editingPack && (
            <button
              className="packs-admin__button packs-admin__button--secondary"
              type="button"
              onClick={limpiarFormulario}
              disabled={guardando}
            >
              Cancelar edición
            </button>
          )}
          <button
            className="packs-admin__button packs-admin__button--primary"
            type="submit"
            disabled={guardando || loading}
          >
            {guardando
              ? "Guardando..."
              : editingPack
                ? "Guardar cambios"
                : "Crear pack"}
          </button>
        </div>
      </form>

      <section className="packs-admin__list-section">
        <div className="packs-admin__list-header">
          <div>
            <span className="packs-admin__eyebrow">Tu catálogo</span>
            <h3 className="packs-admin__section-title">Packs existentes</h3>
            <p className="packs-admin__list-description">
              Consultá y administrá los conjuntos publicados.
            </p>
          </div>

          <button
            className="packs-admin__button packs-admin__button--secondary"
            type="button"
            onClick={cargarDatos}
            disabled={loading || guardando}
          >
            Actualizar lista
          </button>
        </div>

        {packs.length === 0 ? (
          <p className="packs-admin__empty">
            Todavía no hay packs creados.
          </p>
        ) : (
          <div className="packs-admin__grid">
            {packs.map((pack) => {
              const precioFinal =
                pack.precioPack ?? pack.precioTotalPrendas;

              return (
                <article className="packs-admin__card" key={pack.id}>
                  <img
                    className="packs-admin__card-image"
                    src={pack.imagenUrl}
                    alt={pack.nombre}
                  />

                  <div className="packs-admin__card-body">
                    <span
                      className={`packs-admin__badge ${
                        pack.activo
                          ? "packs-admin__badge--active"
                          : "packs-admin__badge--inactive"
                      }`}
                    >
                      {pack.activo ? "Activo" : "Inactivo"}
                    </span>

                    <div className="packs-admin__card-copy">
                      <h4 className="packs-admin__card-title">
                        {pack.nombre}
                      </h4>
                      <p className="packs-admin__card-description">
                        {pack.descripcion || "Sin descripción"}
                      </p>
                    </div>

                    <div className="packs-admin__product-list">
                      <p className="packs-admin__product-line">
                        <strong>Superior</strong>
                        <span>{pack.ropaSuperiorNombre}</span>
                      </p>
                      <p className="packs-admin__product-line">
                        <strong>Inferior</strong>
                        <span>{pack.ropaInferiorNombre}</span>
                      </p>
                    </div>

                    <div className="packs-admin__card-pricing">
                      <strong className="packs-admin__card-price">
                        {precio(precioFinal)}
                      </strong>

                      {pack.precioPack != null && (
                        <small className="packs-admin__old-price">
                          Prendas por separado:{" "}
                          {precio(pack.precioTotalPrendas)}
                        </small>
                      )}
                    </div>

                    <div className="packs-admin__card-actions">
                      <button
                        className="packs-admin__button packs-admin__button--secondary packs-admin__button--compact"
                        type="button"
                        onClick={() => iniciarEdicion(pack)}
                        disabled={guardando || loading}
                      >
                        Editar
                      </button>
                      {pack.activo ? (
                        <button
                          className="packs-admin__button packs-admin__button--danger packs-admin__button--compact"
                          type="button"
                          onClick={() => manejarDesactivacion(pack.id)}
                          disabled={guardando || loading || editingPack?.id === pack.id}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="packs-admin__button packs-admin__button--primary packs-admin__button--compact"
                          type="button"
                          onClick={() => manejarReactivacion(pack)}
                          disabled={guardando || loading || editingPack?.id === pack.id}
                        >
                          Reactivar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default PacksAdmin;
