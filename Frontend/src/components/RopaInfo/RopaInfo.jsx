import "../../styles/RopaInfo.css";

function RopaInfo({ nombre, precio, informacion }) {
    return (
        <div className="producto-container">
            
            {/* CONTENIDO PRINCIPAL: DOS COLUMNAS */}
            <div className="producto-layout">
                
                {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES */}
                <div className="ropa-media">
                    <div className="ropa-media__principal">
                        <img src="/Campera.jpg" alt={nombre} />
                    </div>
                    {/* Miniaturas de la galería */}
                    <div className="ropa-media__thumbnails">
                        <img src="/thumb1.jpg" alt="vista 1" />
                        <img src="/thumb2.jpg" alt="vista 2" />
                        <img src="/thumb3.jpg" alt="vista 3" />
                        <img src="/thumb4.jpg" alt="vista 4" className="active" />
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
                            <p>🧍🏼 ALTURA MODELO: 1.80</p>
                            <p>📏 TALLE: 32</p>
                            <p>🚩 FIT: Balloon</p>
                        </div>

                        {/* TALLES CON ESTILO DE BOTONES CIRCULARES */}
                        <div className="ropa-info__sizes">
                            <p>Size: <strong>28</strong></p>
                            <div className="ropa-info__sizes-list">
                                <button className="size-btn active">28</button>
                                <button className="size-btn">30</button>
                                <button className="size-btn">32</button>
                                <button className="size-btn">34</button>
                                <button className="size-btn">36</button>
                                <button className="size-btn">38</button>
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
                            <button className="btn-secondary">COMPRAR AHORA</button>
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
                <p>{informacion}</p>
            </div>

        </div>
    );
}

export default RopaInfo;