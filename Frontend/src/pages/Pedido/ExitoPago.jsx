import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/Pedido/exitoPago.css";

function ExitoPago() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const status = params.get("status");

  const isApproved = status === "approved";
  const isPending = status === "pending";

  return (
    <>
      <Header />
      <div className="exito-pago-container">
        <div className="exito-pago-card">
          {isApproved && (
            <>
              <div className="exito-icon success">✓</div>
              <h1>¡Pago aprobado!</h1>
              <p>Tu pedido fue recibido y ya está siendo procesado.</p>
            </>
          )}
          {isPending && (
            <>
              <div className="exito-icon pending">⏳</div>
              <h1>Pago pendiente</h1>
              <p>Tu pago está siendo procesado. Te avisaremos cuando se confirme.</p>
            </>
          )}
          {!isApproved && !isPending && (
            <>
              <div className="exito-icon failure">✕</div>
              <h1>Pago no completado</h1>
              <p>No pudimos procesar tu pago. Podés intentarlo de nuevo.</p>
            </>
          )}

          <div className="exito-pago-actions">
            <button onClick={() => navigate("/")}>Volver al inicio</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ExitoPago;
