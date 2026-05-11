import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductoById } from "../services/RopaService";
import Header from "../components/Header";
import RopaInfoDetail from "../features/Ropa/RopaInfo.jsx";
import Footer from "../components/Footer";
import Destacados from "../features/Ropa/Destacados.jsx";

function RopaInfoPage() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await getProductoById(id);
                setProducto(data);
            } catch (err) {
                setError("No se pudo cargar la información del producto.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p style={{textAlign: "center", marginTop: "50px"}}>Cargando detalle del producto...</p>;
    if (error) return <p style={{textAlign: "center", marginTop: "50px", color: "red"}}>{error}</p>;
    if (!producto) return <p style={{textAlign: "center", marginTop: "50px"}}>Producto no encontrado.</p>;

    return (
        <div className="ropa-info-page-wrapper">
            <div className="desktop-only">
                <Header/>
            </div>
            <RopaInfoDetail 
                id={id}
                nombre={producto.nombre} 
                precio={`$${new Intl.NumberFormat("es-AR").format(producto.precio)}`} 
                descripcion={producto.descripcion || "Sin descripción adicional."}
                imagenesUrl={producto.imagenesUrl}
                tallas={producto.tallas || []}
                color={producto.color}
                categoria={producto.categoria}
            />
            <Destacados/>
            <div className="desktop-only">
                
                <Footer/>
            </div>
        </div>
    );
}

export default RopaInfoPage;
