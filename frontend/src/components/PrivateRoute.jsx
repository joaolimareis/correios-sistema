import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
  const access = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Se não estiver logado, manda para login
  if (!access) {
    return <Navigate to="/login" />;
  }

  // Se não foi passada restrição de roles → qualquer logado entra
  if (!roles) {
    return children;
  }

  // Pega os grupos do usuário
  const userRoles = user.groups || [];
  const isSuper = user.is_superuser;

  // Se for superuser, entra em qualquer lugar
  if (isSuper) {
    return children;
  }

  // Verifica se pelo menos uma das roles exigidas está nos grupos do usuário
  const permitido = roles.some((r) => userRoles.includes(r));

  if (permitido) {
    return children;
  }

  // 🚫 Se não tiver permissão → mostra tela de acesso negado
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>🚫 Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="btn btn-primary mt-3"
      >
        Voltar para Início
      </button>
    </div>
  );
}

export default PrivateRoute;
