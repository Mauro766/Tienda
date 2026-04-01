import "../../styles/carruselInfo.css";

function CarruselInfo() {
    return(
        <section className="carrusel">
            <div className="carrusel-div">
                <img className="carrusel-div-img" src="/credit-card.png" />
                <h2 className="carrusel-div-t">3 y 6 cuotas sin interés</h2>
                <h3 className="carrusel-div-t">6 cuotas sin interés compra minima $150.000</h3>
            </div>
            <div className="carrusel-div">
                <img className="carrusel-div-img" src="/marker.png" />
                <h2 className="carrusel-div-t">Envíos gratis</h2>
                <h3 className="carrusel-div-t"></h3>
            </div>
            <div className="carrusel-div">
                <img className="carrusel-div-img" src="/credit-card.png" />
                <h2 className="carrusel-div-t">3 y 6 cuotas sin interés</h2>
                <h3 className="carrusel-div-t">6 cuotas sin interés compra minima $150.000</h3>
            </div>
        </section>
    );
}

export default CarruselInfo;
