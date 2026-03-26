import ProductCard from "../ProductCard";
import "../../styles/cards.css";

function ProductSection({ title }) {
  const productos = [
    { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
    { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
    { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
  ];

  return (
    <section className="content">
      <h2 className="content-title">{title}</h2>

      <div className="card-all">
        {productos.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
