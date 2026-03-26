import "../styles/footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-div">
                <h2 className="footer-div-h2">Info & ayuda</h2>
                <a className="footer-div-a" href="">Como Comprar</a>
                <a className="footer-div-a" href="">Medios de pagos</a>
                <a className="footer-div-a" href="">Envios</a>
                <a className="footer-div-a" href="">Politicas de cambio</a>
            </div>
            <div className="footer-div">
                <h2 className="footer-div-h2">Info & ayuda</h2>
                <a className="footer-div-a" href="">Como Comprar</a>
                <a className="footer-div-a" href="">Medios de pagos</a>
                <a className="footer-div-a" href="">Envios</a>
                <a className="footer-div-a" href="">Politicas de cambio</a>
            </div>
            <div className="footer-button">
                <a className="footer-button-a" href=""><img  src="/instagram.png" alt="" /></a>
                <a className="footer-button-a" href=""><img  src="/youtube.png" alt="" /></a>
                <a className="footer-button-a" href=""><img  src="/tik-tok.png" alt="" /></a>
            </div>
        </footer> 
    );
}

export default Footer;
