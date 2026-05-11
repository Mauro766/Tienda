import { useState } from "react";
import "../styles/Login/IniciarSesion.css";
import { registrarUsuario, loginUsuario } from "../services/UserService";
import { setAuthUser, isAdmin } from "../utils/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { sincronizarCarrito } from "../services/CarritoService";

function LoginDrawer() {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo;
  const redirectState = location.state?.redirectState;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignIn) {
        const loginData = {
          username: formData.username,
          password: formData.password,
        };

        const user = await loginUsuario(loginData);
        const authUser = setAuthUser(user);

        await sincronizarCarrito();
        alert("Sesion iniciada con exito");

        if (authUser && isAdmin(authUser)) {
          navigate("/admin");
          return;
        }

        if (redirectTo) {
          navigate(redirectTo, { state: redirectState });
          return;
        }

        navigate("/");
        return;
      }

      await registrarUsuario(formData);
      alert("Usuario registrado con exito. Ahora puedes iniciar sesion.");
      setIsSignIn(true);
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="login-card">
      <div className="login-tabs">
        <button
          className={`tab-btn ${!isSignIn ? "active" : ""}`}
          onClick={() => setIsSignIn(false)}
        >
          Sign Up
        </button>

        <button
          className={`tab-btn ${isSignIn ? "active" : ""}`}
          onClick={() => setIsSignIn(true)}
        >
          Sign In
        </button>
      </div>

      <div className="login-content">
        <form
          key={isSignIn ? "signin" : "signup"}
          className="login-form login-form-animate"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Introduce tu usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {!isSignIn && (
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>

          <p className="toggle-text">
            {isSignIn ? (
              <>
                Don&apos;t have an account? <span onClick={() => setIsSignIn(false)}>Sign Up</span>
              </>
            ) : (
              <>
                Already have an account? <span onClick={() => setIsSignIn(true)}>Sign In</span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginDrawer;
