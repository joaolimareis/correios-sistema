import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../assets/layout.css"; // vamos criar esse CSS

function Layout({ children }) {
  const navigate = useNavigate();

  // 🚨 Se não tiver token, redireciona para login
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
    }
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white">
        <div className="logo-details">
          <span className="logo_name">Correios FAAMA</span>
        </div>
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link text-white">
              <i className="bx bx-home"></i> Início
            </Link>
          </li>
          <li>
            <Link to="/pessoas" className="nav-link text-white">
              <i className="bx bx-user"></i> Pessoas
            </Link>
          </li>
          <li>
            <Link to="/encomendas" className="nav-link text-white">
              <i className="bx bx-package"></i> Encomendas
            </Link>
          </li>
          <li>
            <Link to="/buscar" className="nav-link text-white">
                <i className="bx bx-search"></i> Buscar/Entregar
            </Link>
            </li>

          <li>
            <button onClick={handleLogout} className="btn btn-link nav-link text-white">
              <i className="bx bx-log-out"></i> Sair
            </button>
          </li>
        </ul>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content flex-grow-1">
        {/* Header fixo */}
        <nav className="navbar navbar-light bg-light shadow-sm px-3">
          <span className="navbar-brand">Painel</span>
        </nav>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
