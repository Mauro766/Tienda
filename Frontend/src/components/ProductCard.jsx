function ProductCard({ nombre, precio, img }) {
   const productos = [
    { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
    { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
    { nombre: "Remera", precio: 50000, img: "/Campera.jpg" },
  ];
  return (
    <div className="card">
      <div className="card-img">
        <img src={img} alt={nombre} />
      </div>

      <h3 className="card-nombre">{nombre}</h3>
      <h3 className="card-precio">${precio}</h3>

    </div>
  );
}

export default ProductCard;