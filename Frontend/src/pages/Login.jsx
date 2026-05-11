import LoginDrawer from "../components/LoginDrawer";
import "../styles/Login/IniciarSesion.css";
import Header from "../components/Header";
import Footer from "../components/Footer";


function Login() {
  return (
    <>
    <Header />
    <div className="login-page">
      <section className="login-side-form">
        <LoginDrawer />
      </section>
    </div>
    <Footer />
    </>
  );
}

export default Login;