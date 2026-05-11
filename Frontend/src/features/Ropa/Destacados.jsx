import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import "../../styles/RopaInfo.css";
import { getProductos, getProductosMasVendidos } from "../../services/RopaService";

function Destacados() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchDestacados = async () => {
            try {
                const data = await getProductosMasVendidos(3);
                setProductos(data.length > 3 ? data.slice(0, 3) : data);
            } catch (err) {
                console.error(err);
                try {
                    const res = await getProductos();
                    const data = Array.isArray(res) ? res : (res?.content || []);
                    setProductos(data.length > 3 ? data.slice(0, 3) : data);
                } catch (fallbackErr) {
                    console.error(fallbackErr);
                }
            }
        };
        fetchDestacados();
    }, []);

    return (
        <section className="card-section">
            <h2>Mas vendidos</h2>
            <div className="card-section-destacados">
                {productos.map((p, i) => (
                    <ProductCard key={i} {...p} />
                ))}
            </div>
        </section>
    );

}

export default Destacados;
