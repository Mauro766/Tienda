import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getPacks } from "../services/packService";
import { getProductoById } from "../services/RopaService";
import { formatImageUrl } from "../config";
import "../styles/Packs/pack-carrusel.css";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function PackCarrusel() {
  const [packs, setPacks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [productDetails, setProductDetails] = useState({ packKey: null, items: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPacks()
      .then((data) => {
        if (active) {
          setPacks(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (active) {
          setError("No pudimos cargar los packs en este momento.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const pack = packs[activeIndex];

  useEffect(() => {
    if (!pack) return undefined;

    let active = true;
    const packKey = pack.id ?? activeIndex;
    const products = [
      { key: "superior", id: pack.ropaSuperiorId },
      { key: "inferior", id: pack.ropaInferiorId },
    ].filter((product) => product.id != null);

    Promise.all(
      products.map(async ({ key, id }) => {
        try {
          return [key, await getProductoById(id)];
        } catch {
          return [key, null];
        }
      }),
    ).then((details) => {
      if (active) {
        setProductDetails({ packKey, items: Object.fromEntries(details) });
      }
    });

    return () => {
      active = false;
    };
  }, [pack, activeIndex]);

  const packItems = useMemo(() => {
    if (!pack) return [];
    const details =
      productDetails.packKey === (pack.id ?? activeIndex)
        ? productDetails.items
        : {};

    return [
      {
        key: "superior",
        id: pack.ropaSuperiorId,
        name: pack.ropaSuperiorNombre,
        price: pack.ropaSuperiorPrecio,
        image: pack.ropaSuperiorImagen,
        detail: details.superior,
      },
      {
        key: "inferior",
        id: pack.ropaInferiorId,
        name: pack.ropaInferiorNombre,
        price: pack.ropaInferiorPrecio,
        image: pack.ropaInferiorImagen,
        detail: details.inferior,
      },
    ];
  }, [pack, productDetails, activeIndex]);

  const previousPack = () => {
    setActiveIndex((index) => (index === 0 ? packs.length - 1 : index - 1));
  };

  const nextPack = () => {
    setActiveIndex((index) => (index === packs.length - 1 ? 0 : index + 1));
  };

  if (loading) {
    return (
      <section className="pack-showcase pack-showcase--loading" aria-busy="true">
        <div className="pack-showcase__loading-mark" />
        <p>Cargando conjuntos destacados...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pack-showcase pack-showcase--notice" role="status">
        <p>{error}</p>
      </section>
    );
  }

  if (packs.length === 0) return null;

  const currentPrice = pack.precioPack ?? pack.precioTotalPrendas;
  const hasDiscount =
    pack.precioPack != null &&
    Number(pack.precioPack) < Number(pack.precioTotalPrendas);
  const position = String(activeIndex + 1).padStart(2, "0");
  const total = String(packs.length).padStart(2, "0");

  return (
    <section className="pack-showcase" aria-label="Packs y outfits destacados">
      <div className="pack-showcase__heading">
        <div>
          <span className="pack-showcase__eyebrow">Looks para llevar</span>
          <h2 className="pack-showcase__title">El outfit, resuelto.</h2>
        </div>
        <p className="pack-showcase__intro">
          Combinaciones seleccionadas para que encuentres tu próximo look en un solo lugar.
        </p>
      </div>

      <div
        className="pack-showcase__frame"
        aria-live="polite"
        aria-atomic="true"
      >
        {packs.length > 1 && (
          <button
            className="pack-showcase__arrow pack-showcase__arrow--previous"
            type="button"
            onClick={previousPack}
            aria-label="Ver pack anterior"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}

        <article className="pack-showcase__slide" key={pack.id ?? activeIndex}>
          <div className="pack-showcase__hero">
            {pack.imagenUrl ? (
              <img
                className="pack-showcase__hero-image"
                src={formatImageUrl(pack.imagenUrl)}
                alt={pack.nombre || "Outfit"}
              />
            ) : (
              <div className="pack-showcase__hero-fallback">
                <span>Look seleccionado</span>
              </div>
            )}
            <span className="pack-showcase__hero-label">
              Selección de la casa
            </span>
          </div>

          <div className="pack-showcase__details">
            <div className="pack-showcase__pack-copy">
              <span className="pack-showcase__eyebrow">El conjunto</span>
              <h3 className="pack-showcase__pack-title">
                {pack.nombre || "Pack destacado"}
              </h3>
              {pack.descripcion && (
                <p className="pack-showcase__description">{pack.descripcion}</p>
              )}
            </div>

            <div className="pack-showcase__items" aria-label="Prendas incluidas">
              {packItems.map((item) => {
                const itemName =
                  item.detail?.nombre || item.name || "Prenda del conjunto";
                const image =
                  item.detail?.imagenesUrl?.[0] || item.image;
                const sizes = Array.isArray(item.detail?.tallas)
                  ? item.detail.tallas.filter(Boolean)
                  : [];

                return (
                  <article className="pack-showcase__item" key={item.key}>
                    <div className="pack-showcase__item-image-wrap">
                      {image ? (
                        <img
                          className="pack-showcase__item-image"
                          src={formatImageUrl(image)}
                          alt={itemName}
                          loading="lazy"
                        />
                      ) : (
                        <div className="pack-showcase__item-image-fallback">
                          Imagen no disponible
                        </div>
                      )}
                    </div>

                    <div className="pack-showcase__item-info">
                      <span className="pack-showcase__item-type">
                        {item.key === "superior" ? "Prenda superior" : "Prenda inferior"}
                      </span>
                      <h4 className="pack-showcase__item-name">{itemName}</h4>
                      {item.detail?.color && (
                        <p className="pack-showcase__item-meta">
                          Color <span>{item.detail.color}</span>
                        </p>
                      )}
                      {sizes.length > 0 && (
                        <p className="pack-showcase__item-meta">
                          Talles <span>{sizes.join(" · ")}</span>
                        </p>
                      )}
                      {item.price != null && (
                        <strong className="pack-showcase__item-price">
                          {formatPrice(item.price)}
                        </strong>
                      )}
                      {item.id != null && (
                        <Link
                          className="pack-showcase__item-link"
                          to={`/RopaInfo/${item.id}`}
                        >
                          Ver prenda <ArrowUpRight aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="pack-showcase__price-row">
              <div>
                <span className="pack-showcase__price-caption">
                  {hasDiscount ? "Precio del pack" : "Total del conjunto"}
                </span>
                <strong className="pack-showcase__price">
                  {formatPrice(currentPrice)}
                </strong>
              </div>
              {hasDiscount && (
                <div className="pack-showcase__saving">
                  <span>Por separado</span>
                  <s>{formatPrice(pack.precioTotalPrendas)}</s>
                </div>
              )}
            </div>
          </div>
        </article>

        {packs.length > 1 && (
          <button
            className="pack-showcase__arrow pack-showcase__arrow--next"
            type="button"
            onClick={nextPack}
            aria-label="Ver siguiente pack"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>

      {packs.length > 1 && (
        <div className="pack-showcase__controls">
          <span className="pack-showcase__counter" aria-label={`Pack ${position} de ${total}`}>
            <strong>{position}</strong>
            <span aria-hidden="true">/</span>
            {total}
          </span>
          <div className="pack-showcase__progress" aria-hidden="true">
            {packs.map((item, index) => (
              <span
                className={index <= activeIndex ? "is-active" : ""}
                key={item.id ?? index}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PackCarrusel;