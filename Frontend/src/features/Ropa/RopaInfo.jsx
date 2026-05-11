import { useState } from "react";
import "../../styles/RopaInfo.css";
import { agregarAlCarrito } from "../../services/CarritoService";

function RopaInfo({ id, nombre, precio, descripcion, imagenesUrl, tallas, color, categoria }) {
    const formatUrl = (url) => url?.startsWith("/uploads/") ? `http://localhost:8081${url}` : url;
    const rawImages = Array.isArray(imagenesUrl) && imagenesUrl.length > 0 ? imagenesUrl : ["/Campera.jpg"];
    const validImages = rawImages.map(formatUrl);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [selectedSize, setSelectedSize] = useState(tallas && tallas.length > 0 ? tallas[0] : "Único");

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

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
        <div className="ropa-info-modern">
            <div className="info-layout">
                {/* LADO IZQUIERDO: MEDIOS */}
                <div className="info-media">
                    <div className="image-showcase">
                        <img 
                            key={currentIndex} 
                            src={validImages[currentIndex]} 
                            alt={nombre} 
                            className="main-product-img" 
                        />
                        
                        {validImages.length > 1 && (
                            <div className="desktop-arrows desktop-show">
                                <button className="arrow-btn mr-auto" onClick={handlePrev}>
                                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                                </button>
                                <button className="arrow-btn ml-auto" onClick={handleNext}>
                                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                                </button>
                            </div>
                        )}

                        {validImages.length > 1 && (
                            <div className="mobile-pagination mobile-show">
                                {validImages.map((_, i) => (
                                    <span key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)} />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {validImages.length > 1 && (
                        <div className="thumbnail-list desktop-show">
                            {validImages.map((img, i) => (
                                <button 
                                    key={i} 
                                    className={`thumb-btn ${i === currentIndex ? 'active' : ''}`} 
                                    onClick={() => setCurrentIndex(i)}
                                >
                                    <img src={img} alt={`${nombre} view ${i+1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* LADO DERECHO: DETALLES */}
                <div className="info-details">
                    <div className="details-header">
                        <span className="categoria-label">{categoria || "Novedad"}</span>
                        <h1 className="product-title">{nombre}</h1>
                        <div className="price-container">
                            <span className="current-price">{precio}</span>
                            <span className="original-price">${(parseFloat(precio.replace("$", "").replace(".", "").replace(",", ".")) * 1.3).toLocaleString("es-AR")}</span>
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

                        <div className="option-group quantity-group desktop-show-block">
                            <span className="option-title" style={{marginBottom: "12px", display: "block"}}>Cantidad</span>
                            <div className="qty-selector">
                                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span className="qty-val">{quantity}</span>
                                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="action-section">
                        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={adding}>
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
        </div>
    );
}

export default RopaInfo;