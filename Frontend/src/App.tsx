import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import Home from "./pages/Home";
import RopaInfo from "./pages/RopaInfo";
import Busqueda from "./pages/Busqueda";
import Error from "./pages/Error404";
import Admin from "./pages/Admin/AdminPanel";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DatosPedidos from "./pages/Pedido/Datos";
import ExitoPago from "./pages/Pedido/ExitoPago";
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    void error;
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal. Revisa la consola para más detalles.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    let rafId: number

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time)
      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (

    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RopaInfo/:id" element={<RopaInfo />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/error" element={<Error />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute requireCheckoutEntry>
                <DatosPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/pedido/exito" element={<ExitoPago />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
