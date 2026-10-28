import { useEffect, useState } from "react";
import "../../styles/RopaInfo.css";
import { agregarAlCarrito } from "../../services/CarritoService";
import { formatImageUrl } from "../../config";

function RopaInfo({ id, nombre, precio, descripcion, imagenesUrl, tallas, color, categoria }) {
    const rawImages = Array.isArray(imagenesUrl) && imagenesUrl.length > 0 ? imagenesUrl : ["/Campera.jpg"];
    const validImages = rawImages.map((img) => formatImageUrl(img, "/Campera.jpg"));
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageExpanded, setImageExpanded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [selectedSize, setSelectedSize] = useState(tallas && tallas.length > 0 ? tallas[0] : "Único");

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (!imageExpanded) return undefined;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") setImageExpanded(false);
            if (event.key === "ArrowLeft" && validImages.length > 1) handlePrev();
            if (event.key === "ArrowRight" && validImages.length > 1) handleNext();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [imageExpanded, validImages.length]);

    const handleAddToCart = async () => {
        try {
            setAdding(true);
            const producto = { id, nombre, total: parseFloat(precio.replace("$", "").replace(".", "").replace(",", ".")), imagenesUrl };
            await agregarAlCarrito(producto, quantity);
            
            // Abrir el carrito automáticamente para feedback
            window.dispatchEvent(new CustomEvent("abrirCarrito"));
        } catch (err) {
            alert(err.message || "No se pudo agregar el producto.");
        } finally {
            setAdding(false);
        }
    };

    return (
        <main className="ropa-info-modern">
            <nav className="product-breadcrumb" aria-label="Migas de pan">
                <span>Categoria</span>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{categoria || "Producto"}</span>
            </nav>
            <div className="info-layout">
                <div className={`info-media ${validImages.length > 1 ? "info-media--gallery" : "info-media--single"}`}>
                    <div className="image-showcase">
                        <button
                            type="button"
                            className="main-product-image-button"
                            onClick={() => setImageExpanded(true)}
                            aria-label="Ampliar imagen del producto"
                        >
                            <img
                                src={validImages[currentIndex]}
                                alt={nombre}
                                className="main-product-img"
                            />
                        </button>
                        
                        {validImages.length > 1 && (
                            <div className="desktop-arrows desktop-show">
                                <button type="button" className="arrow-btn mr-auto" onClick={handlePrev} aria-label="Ver imagen anterior">
                                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                                </button>
                                <button type="button" className="arrow-btn ml-auto" onClick={handleNext} aria-label="Ver imagen siguiente">
                                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                                </button>
                            </div>
                        )}

                        {validImages.length > 1 && (
                            <div className="mobile-pagination mobile-show">
                                {validImages.map((_, i) => (
                                    <button
                                        type="button"
                                        key={i}
                                        className={`dot ${i === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(i)}
                                        aria-label={`Ver imagen ${i + 1}`}
                                        aria-current={i === currentIndex ? "true" : undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {validImages.length > 1 && (
                        <div className="thumbnail-list desktop-show">
                            {validImages.map((img, i) => (
                                <button
                                    type="button"
                                    key={i} 
                                    className={`thumb-btn ${i === currentIndex ? 'active' : ''}`} 
                                    onClick={() => setCurrentIndex(i)}
                                    aria-label={`Ver imagen ${i + 1}`}
                                    aria-current={i === currentIndex ? "true" : undefined}
                                >
                                    <img src={img} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="info-details">
                    <div className="details-header">
                        <span className="categoria-label">{categoria || "Novedad"}</span>
                        <h1 className="product-title">{nombre}</h1>
                        <div className="price-container">
                            <span className="current-price">{precio}</span>
                        </div>
                    </div>

                    <div className="product-description">
                        <p>{descripcion || "Explora un estilo minimalista con este producto diseñado para brindar la máxima comodidad y elegancia en tu día a día."}</p>
                    </div>

                    <div className="options-section">
                        <div className="option-group">
                            <div className="option-header">
                                <span className="option-title">Talle</span>
                                <span className="size-guide">Guía de talles</span>
                            </div>
                            <div className="size-selector">
                                {tallas && tallas.length > 0 ? (
                                    tallas.map(t => (
                                        <button 
                                            key={t} 
                                            className={`size-btn ${selectedSize === t ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(t)}
                                        >
                                            {t}
                                        </button>
                                    ))
                                ) : (
                                    <button className="size-btn active">Único</button>
                                )}
                            </div>
                        </div>

                        {color && (
                            <div className="option-group color-group">
                                <span className="option-title">Color</span>
                                <span className="product-color">{color}</span>
                            </div>
                        )}

                        <div className="option-group quantity-group desktop-show-block">
                            <span className="option-title option-title--quantity">Cantidad</span>
                            <div className="qty-selector">
                                <button type="button" className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Disminuir cantidad">−</button>
                                <span className="qty-val">{quantity}</span>
                                <button type="button" className="qty-btn" onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar cantidad">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="action-section">
                        <button type="button" className="add-to-cart-btn" onClick={handleAddToCart} disabled={adding}>
                            <span>{adding ? "Agregando..." : "Agregar al carrito"}</span>
                            <span className="mobile-show inline-price">{precio}</span>
                        </button>
                        <p className="shipping-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
                            Envíos y devoluciones gratuitas a todo el país
                        </p>
                    </div>
                </div>
            </div>
            {imageExpanded && (
                <div
                    className="product-image-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Imagen ampliada: ${nombre}`}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setImageExpanded(false);
                        }
                    }}
                >
                    <button
                        type="button"
                        className="product-image-lightbox__close"
                        onClick={() => setImageExpanded(false)}
                        aria-label="Cerrar imagen ampliada"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m6 6 12 12M18 6 6 18" />
                        </svg>
                    </button>
                    {validImages.length > 1 && (
                        <button
                            type="button"
                            className="product-image-lightbox__arrow product-image-lightbox__arrow--previous"
                            onClick={handlePrev}
                            aria-label="Ver imagen anterior"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                    )}
                    <img
                        className="product-image-lightbox__image"
                        src={validImages[currentIndex]}
                        alt={nombre}
                    />
                    {validImages.length > 1 && (
                        <button
                            type="button"
                            className="product-image-lightbox__arrow product-image-lightbox__arrow--next"
                            onClick={handleNext}
                            aria-label="Ver imagen siguiente"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    )}
                    {validImages.length > 1 && (
                        <span className="product-image-lightbox__counter">
                            {currentIndex + 1} / {validImages.length}
                        </span>
                    )}
                </div>
            )}
        </main>
    );
}

export default RopaInfo;
