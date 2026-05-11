import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserFromToken, isAdmin, refreshAuthUser } from "../utils/auth";

const ProtectedRoute = ({ children, requiredRole = "", requireCheckoutEntry = false }) => {
  const location = useLocation();
  const [user, setUser] = useState(() => getUserFromToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    refreshAuthUser().then((currentUser) => {
      if (!active) return;
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "ROLE_ADMIN" && !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  if (requireCheckoutEntry && location.state?.allowCheckoutEntry !== true) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
