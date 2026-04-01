import { useState } from "react";
import "../../styles/RopaInfo.css";

function RopaInfo({ nombre, precio, descripcion, imagenesUrl, tallas, color, categoria }) {
    const formatUrl = (url) => url?.startsWith("/uploads/") ? `http://localhost:8081${url}` : url;
    const rawImages = Array.isArray(imagenesUrl) && imagenesUrl.length > 0 ? imagenesUrl : ["/Campera.jpg"];
    const validImages = rawImages.map(formatUrl);
    
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };
    return (
        <div className="producto-container">
            
            {/* CONTENIDO PRINCIPAL: DOS COLUMNAS */}
            <div className="producto-layout">
                
                {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES */}
                <div className="ropa-media">
                    <div className="ropa-media__principal">
                        <img key={currentIndex} src={validImages[currentIndex]} alt={nombre} className="fade-in-image" />
                        {validImages.length > 1 && (
                            <>
                                <button className="carousel-btn carousel-btn--prev" onClick={handlePrev}>
                                    &#10094;
                                </button>
                                <button className="carousel-btn carousel-btn--next" onClick={handleNext}>
                                    &#10095;
                                </button>
                            </>
                        )}
                    </div>
                    {/* Miniaturas de la galería */}
                    <div className="ropa-media__thumbnails">
                        {validImages.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt={`${nombre} vista ${index + 1}`} 
                                className={currentIndex === index ? "active" : ""}
                                onClick={() => setCurrentIndex(index)}
                                style={{ cursor: "pointer" }}
                            />
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: INFORMACIÓN Y ACCIONES */}
                <div className="ropa-info">
                    
                    {/* HEADER INFO */}
                    <div className="ropa-info__header">
                        <h1 className="ropa-info__title">{nombre}</h1>
                        <h2 className="ropa-info__price">{precio}</h2>
                        <p className="ropa-info__installments">3 CUOTAS SIN INTERÉS</p>
                        <p className="ropa-info__shipping">Envío calculado en la compra</p>
                    </div>

                    <hr className="ropa-info__divider" />

                    {/* DETALLES Y ADVERTENCIAS */}
                    <div className="ropa-info__details">
                        <p className="ropa-info__warning">
                            <strong>ATENCIÓN:</strong> Chequear la tabla de talle porque las medidas pueden variar inclusive en un mismo producto.
                        </p>

                        <div className="ropa-info__model">
                            <p>🏷 CATEGORÍA: {categoria || "General"}</p>
                            <p>🎨 COLOR: {color || "Variado"}</p>
                            <p>📏 TALLES: {Array.isArray(tallas) && tallas.length > 0 ? tallas.join(", ") : "Único"}</p>
                        </div>

                        {/* TALLES CON ESTILO DE BOTONES CIRCULARES */}
                        <div className="ropa-info__sizes">
                            <p>Talles disponibles:</p>
                            <div className="ropa-info__sizes-list">
                                {Array.isArray(tallas) && tallas.length > 0
                                    ? tallas.map(t => <button key={t} className="size-btn">{t}</button>)
                                    : <button className="size-btn active">Único</button>
                                }
                            </div>
                        </div>

                        {/* SELECTOR DE CANTIDAD */}
                        <div className="ropa-info__quantity">
                            <p>Cantidad:</p>
                            <div className="quantity-controls">
                                <button className="quantity-btn">-</button>
                                <span className="quantity-number">1</span>
                                <button className="quantity-btn">+</button>
                            </div>
                        </div>

                        {/* BOTONES DE COMPRA */}
                        <div className="ropa-info__actions">
                            <button className="btn-primary">AGREGAR AL CARRITO</button>
                            {/* TODO: Integración con Mercado Pago */}
                            <button className="btn-secondary" id="mercado-pago-btn">COMPRAR AHORA (MercadoPago)</button>
                        </div>

                        {/* NOTA EXTRA */}
                        <p className="ropa-info__note">
                            Las medidas de la tabla NO son la medida exacta de cada prenda, es para que cada uno según su propia medida o prenda elija el talle que acuerde.
                        </p>

                        {/* REDES SOCIALES */}
                        <div className="ropa-info__share">
                            <span>Compartir</span>
                            <div className="share-icons">
                                {/* Puedes cambiar estas letras por etiquetas <img> o íconos SVG reales */}
                                <span>f</span> 
                                <span>p</span> 
                                <span>t</span> 
                                <span>✉</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DESCRIPCIÓN FINAL ABAJO DE TODO */}
            <div className="ropa-description-footer">
                <p>{descripcion}</p>
            </div>

        </div>
    );
}

export default RopaInfo;