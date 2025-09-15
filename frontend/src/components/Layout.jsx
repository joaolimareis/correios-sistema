import { Link, useNavigate, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";

import "../assets/layout.css";



function Layout({ children }) {

  const navigate = useNavigate();

  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);



  // pega usuário salvo no localStorage

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const groups = user.groups || [];



  const isAdmin = user.is_superuser || groups.includes("ADMINISTRADOR");

  const isSecretaria = groups.includes("SECRETARIA");

  const isFuncionario = groups.includes("FUNCIONARIO");



  // função para exibir role

  const getUserRole = () => {

    if (user.is_superuser) return "Administrador";

    if (groups.includes("ADMINISTRADOR")) return "Administrador";

    if (groups.includes("SECRETARIA")) return "Secretaria";

    if (groups.includes("FUNCIONARIO")) return "Funcionário";

    return "Usuário";

  };



  useEffect(() => {

    if (!localStorage.getItem("access")) {

      navigate("/login");

    }

  }, [navigate]);



  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");

  };



  // não renderiza layout na tela de login

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

          {/* Início → todos os logados */}

          <li>

            <Link to="/" className="nav-link">

              <i className="bx bx-home"></i> Início

            </Link>

          </li>



          {/* Pessoas → somente Admin */}

          {isAdmin && (

            <li>

              <Link to="/pessoas" className="nav-link">

                <i className="bx bx-user"></i> Pessoas

              </Link>

            </li>

          )}



          {/* Encomendas → Admin, Secretaria e Funcionário */}

          {(isAdmin || isSecretaria || isFuncionario) && (

            <li>

              <Link to="/encomendas" className="nav-link">

                <i className="bx bx-package"></i> Encomendas

              </Link>

            </li>

          )}

        </ul>



        {/* Botão de logout fixado embaixo */}

        <div className="logout-section">

          <button onClick={handleLogout} className="btn btn-link nav-link">

            <i className="bx bx-log-out"></i> Sair

          </button>

        </div>

      </div>



      {/* Conteúdo principal */}

      <div className="main-content flex-grow-1 d-flex flex-column">

        <nav className="navbar navbar-light bg-light shadow-sm px-3 d-flex align-items-center justify-content-between">

          <button

            className="btn btn-outline-primary"

            onClick={() => setSidebarOpen(!sidebarOpen)}

          >

            ☰

          </button>



          <span className="navbar-brand mb-0 h1 fs-2">Correios FAAMA</span>





          {/* Usuário logado */}

          <div className="d-flex align-items-center">

            <i className="bx bx-user-circle fs-3 me-2"></i>

            <div className="text-end">

              <div className="fw-bold">{user.username || "Usuário"}</div>

              <small className="text-muted">{getUserRole()}</small>

            </div>

          </div>

        </nav>



        {/* Conteúdo das páginas */}

        <div className="p-4 flex-grow-1">{children}</div>



        {/* Rodapé */}

        <footer className="footer-custom">

          <small>© {new Date().getFullYear()} Núcleo De Processo Faama</small>

        </footer>

      </div>

    </div>

  );

}



export default Layout;