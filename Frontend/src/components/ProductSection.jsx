import ProductCard from "./ProductCard";
import "../styles/cards.css";
import { isAdmin, getUserFromToken } from "../utils/auth";

function ProductSection({ title, subtitle, productos = [] }) {
  const user = getUserFromToken();
  const admin = isAdmin(user);

  return (
    <section className="product-section">
      <div className="content-head">
        <h2 className="content-title">{title}</h2>
        {subtitle && <p className="content-subtitle">{subtitle}</p>}
      </div>
      <div className="card-all product-grid">
        {productos.length === 0 ? (
          <h2 className="h2-nohay">
            No hay productos
          </h2>
        ) : (
          productos.map((producto) => (
            <ProductCard key={producto.id} {...producto} admin={admin} />
          ))
        )}
      </div>
    </section>
  );
}

export default ProductSection;
