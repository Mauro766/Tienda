import ProductCard from "./ProductCard";
import "../styles/RopaInfo.css";

function Destacados() {
    const productos = [
        { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
        { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
        { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
    ];

    return (
        <section className="card-section">
            <h2>Destacados</h2>
            <div className="card-section-destacados">
                {productos.map((p, i) => (
                    <ProductCard key={i} {...p} />
                ))}
            </div>
        </section>
    );

}

export default Destacados;