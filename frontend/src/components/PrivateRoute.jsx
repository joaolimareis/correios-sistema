import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const groups = user.groups || [];
  const isAdmin = user.is_superuser || groups.includes("ADMINISTRADOR");

  // Se não tem login
  if (!localStorage.getItem("access")) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige papéis específicos
  if (roles && !roles.some(r => groups.includes(r) || (r === "ADMINISTRADOR" && isAdmin))) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
