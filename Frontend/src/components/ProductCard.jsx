import "../styles/cards.css";

function formatPrice(precio) {
  return new Intl.NumberFormat("es-AR").format(precio);
}

function ProductCard({
  id,
  nombre,
  precio,
  imagenesUrl,
  categoria = "Destacado",
  detailHref,
  activo = true,
}) {
  const finalHref = detailHref ? detailHref : id ? `/RopaInfo/${id}` : "/RopaInfo";
  
  const coverImage = Array.isArray(imagenesUrl) && imagenesUrl.length > 0 ? imagenesUrl[0] : null;

  const imageSrc = coverImage
    ? coverImage.startsWith("/uploads/")
      ? `http://localhost:8081${coverImage}`
      : coverImage
    : "/Campera.jpg";

  return (
    <article className="product-card" style={{ position: 'relative' }}>
      {activo === false && (
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          Oculto
        </span>
      )}
      <div className="product-image">
        <img src={imageSrc} alt={nombre} style={{ opacity: activo === false ? 0.6 : 1 }} />
      </div>
      <div className="product-info">
        <p className="product-category">{categoria}</p>
        <h4>{nombre}</h4>
        <p className="product-price">${formatPrice(precio)}</p>
      </div>
      <a href={finalHref} className="product-detail">
        Ver detalle
      </a>
    </article>
  );
}

export default ProductCard;