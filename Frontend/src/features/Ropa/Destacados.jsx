import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import "../../styles/RopaInfo.css";
import { getProductos } from "../../services/RopaService";

function Destacados() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchDestacados = async () => {
            try {
                const res = await getProductos();
                const data = Array.isArray(res) ? res : (res?.content || []);
                setProductos(data.length > 3 ? data.slice(0, 3) : data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDestacados();
    }, []);

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