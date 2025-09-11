import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/layout.css"; 

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="logo-details">
          <img src="/Group.png" alt="Logo Correios" className="logo-img" />
        </div>

        <ul className="nav-list flex-grow-1">
          <li>
            <Link to="/" className="nav-link">
              <i className="bx bx-home"></i> Início
            </Link>
          </li>
          <li>
            <Link to="/pessoas" className="nav-link">
              <i className="bx bx-user"></i> Pessoas
            </Link>
          </li>
          <li>
            <Link to="/encomendas" className="nav-link">
              <i className="bx bx-package"></i> Encomendas
            </Link>
          </li>
        </ul>

        {/* Botão de logout fixado embaixo */}
        <div className="logout-section">
          <button onClick={handleLogout} className="btn btn-link nav-link">
            <i className="bx bx-log-out"></i> Sair
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content flex-grow-1">
        <nav className="navbar navbar-light bg-light shadow-sm px-3 d-flex align-items-center justify-content-between">
          <button
            className="btn btn-outline-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <span className="navbar-brand mb-0 h1">Correios FAAMA</span>
        </nav>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
