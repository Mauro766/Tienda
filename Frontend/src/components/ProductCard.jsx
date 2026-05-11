import "../styles/cards.css";
import { Link } from "react-router-dom";


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
  stock,
  activo = true,
  admin
}) {
  const finalHref = detailHref ? detailHref : id ? `/RopaInfo/${id}` : "/RopaInfo";
  const finalAddHref = `/admin`;

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
      {stock === 0 && (
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          Sin stock
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
      <div className="product-actions">
        <Link viewTransition to={finalHref} className="product-detail">
        Ver detalle
      </Link>
    
      {admin && stock === 0 && (
        <Link viewTransition to="/admin" state={{ activeView: "editar", productoId: id }} className="product-detail">
          <img width="20" height="20" src="editar.svg" alt="editar" />
        </Link>
      )}
      </div>
    </article>
  );
}

export default ProductCard;