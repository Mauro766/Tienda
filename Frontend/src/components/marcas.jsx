import "../styles/marcas.css"

const logos = [
    { src: "/Marcas/1.png", style: {} },
    { src: "/Marcas/2.png", style: {} },
    { src: "/Marcas/3.png", style: {} },
    { src: "/Marcas/4.png", style: { filter: "invert(0)", width: "180px", height: "60px" } },
];

export default function Marcas() {
    return (
        <div className="carrusel">
            {/* Fade izquierda */}
            <div className="carrusel-fade carrusel-fade-left" />

            <div className="carrusel-track">
                {/* 4 copias para que siempre haya logos visibles */}
                {[...Array(4)].map((_, copy) =>
                    logos.map((logo, i) => (
                        <img key={`${copy}-${i}`} src={logo.src} alt="" style={logo.style} />
                    ))
                )}
            </div>

            {/* Fade derecha */}
            <div className="carrusel-fade carrusel-fade-right" />
        </div>
    );
}