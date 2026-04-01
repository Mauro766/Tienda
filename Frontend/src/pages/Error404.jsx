import "../styles/error.css";

function Error() {
    return (
        <>
            <div className="error404">
                <div className="error404-div1">
                    <img src="./cross-circle.png" alt="" />
                    <h1>Error 404</h1>
                    <h2>Página no encontrada</h2>
                    <p>Lo que buscás no existe o fue movido.</p>
                </div>
                <div className="error404-div2">
                    <a className="a" href="/">Ir al inicio</a>
                    <a className="a" href="/RopaInfo">Ir a la tienda</a>
                </div>

            </div>
        </>
    );

}

export default Error;