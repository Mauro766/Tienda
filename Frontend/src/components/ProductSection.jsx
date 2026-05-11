import ProductCard from "./ProductCard";
import "../styles/cards.css";
import { isAdmin, getUserFromToken } from "../utils/auth";

function ProductSection({ title, subtitle, productos = [] }) {
  const user = getUserFromToken();
  return (
    <section className="product-section">
      <div className="content-head">
        <h2 className="content-title">{title}</h2>
        {subtitle && <p className="content-subtitle">{subtitle}</p>}
      </div>

      <div className="card-all product-grid">
        {productos.map((producto) => (
          <ProductCard key={producto.id} {...producto} admin={isAdmin(user)} />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
