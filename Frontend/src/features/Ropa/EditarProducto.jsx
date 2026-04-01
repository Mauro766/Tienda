import { useEffect, useState } from "react";
import { getProductosAdmin, getProductoById, actualizarProducto } from "../../services/RopaService";

function EditarProducto({ token }) {
    const [productos, setProductos] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        categoria: '',
        talles: '',
        color: '',
        descripcion: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductosAdmin();
                setProductos(data);
            } catch (err) {
                setError(err.message || "No se pudo cargar productos");
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const handleSelectProducto = async (id) => {
        try {
            const producto = await getProductoById(id);
            setSelectedProducto(producto);
            setFormData({
                nombre: producto.nombre || '',
                precio: producto.precio || '',
                categoria: producto.categoria || '',
                talles: producto.talla || '',
                color: producto.color || '',
                descripcion: producto.descripcion || ''
            });
            setError(null);
            setSuccess(null);
        } catch (err) {
            setError(err.message || "No se pudo obtener el producto");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProducto) {
            setError("Seleccioná un producto primero");
            return;
        }

        if (!token) {
            setError("Falta token de admin. Ingresalo en el panel o iniciá sesión");
            setSuccess(null);
            return;
        }

        try {
            await actualizarProducto(selectedProducto.id, {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: Number(formData.precio),
                stock: selectedProducto.stock ?? 0,
                categoria: formData.categoria,
                marca: selectedProducto.marca ?? "",
                talla: formData.talles,
                color: formData.color,
                imagenesUrl: selectedProducto.imagenesUrl ?? [],
                activo: selectedProducto.activo !== undefined ? selectedProducto.activo : true
            });

            setSuccess("Producto actualizado correctamente.");
            setError(null);

            // Refrescar la lista
            const data = await getProductosAdmin();
            setProductos(data);
        } catch (err) {
            setError(err.message || "Error actualizando producto");
            setSuccess(null);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="editar-producto">
            <h2>Editar Producto</h2>
            {!selectedProducto ? (
                <div>
                    <h3>Seleccionar Producto</h3>
                    <ul>
                        {productos.map((p) => (
                            <li key={p.id}>
                                {p.nombre} - <button onClick={() => handleSelectProducto(p.id)}>Editar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>Nombre: <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} /></label>
                    <label>Precio: <input type="number" name="precio" value={formData.precio} onChange={handleChange} /></label>
                    <label>Categoria: <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} /></label>
                    <label>Talla: <input type="text" name="talles" value={formData.talles} onChange={handleChange} /></label>
                    <label>Color: <input type="text" name="color" value={formData.color} onChange={handleChange} /></label>
                    <label>Descripción: <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}></textarea></label>
                    <button type="submit">Actualizar Producto</button>
                    <button type="button" onClick={() => setSelectedProducto(null)}>Volver a la lista</button>
                    {success && <p style={{color: '#28a745'}}>{success}</p>}
                    {error && <p style={{color: '#dc3545'}}>{error}</p>}
                </form>
            )}
        </div>
    );
}

export default EditarProducto;