import ProductCard from "./ProductCard";
import "../styles/cards.css";

function ProductSection({ title, subtitle, productos = [] }) {

  return (
    <section className="content">
      <div className="content-head">
        <h2 className="content-title">{title}</h2>
        {subtitle && <p className="content-subtitle">{subtitle}</p>}
      </div>

      <div className="card-all product-grid">
        {productos.map((producto) => (
          <ProductCard key={producto.id} {...producto} />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
