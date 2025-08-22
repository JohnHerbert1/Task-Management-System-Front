// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

function decodePayload(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const PrivateRoute = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return <Navigate to="/" replace />;

  const payload = decodePayload(token);
  if (!payload) {
    localStorage.removeItem("authToken");
    return <Navigate to="/" replace />;
  }

  // Checa exp (segundos -> ms)
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    localStorage.removeItem("authToken");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
