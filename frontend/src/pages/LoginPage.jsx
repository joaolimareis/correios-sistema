import { useState } from "react";
import api from "../api/axios";
import "../assets/LoginPage.css"; 

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // autenticação → tokens
      const res = await api.post("/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // busca perfil do usuário logado
      const me = await api.get("/encomendas/me/");
      localStorage.setItem("user", JSON.stringify(me.data));

      window.location.href = "/";
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="card-body p-4">
          <div className="login-header">
            <img
              src="https://cdn-icons-png.flaticon.com/512/726/726623.png"
              alt="Logo"
            />
            <h3>Correios FAAMA</h3>
            <p>Acesse sua conta</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite seu email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label>Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 login-btn">
              Entrar
            </button>
          </form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} Correios FAAMA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
