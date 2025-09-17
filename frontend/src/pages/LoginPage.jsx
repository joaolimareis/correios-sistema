import { useState } from "react";
import api from "../api/axios";
import "../assets/LoginPage.css"; // importa o css

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // limpa erro anterior

    try {
      // 1. Autenticar e pegar tokens em /api/token/
      const res = await api.post("/token/", { username, password });
      const access = res.data.access;
      const refresh = res.data.refresh;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // 2. Buscar informações do usuário logado em /api/encomendas/me/
      const userRes = await api.get("/encomendas/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(userRes.data));

      // 3. Redirecionar para home
      window.location.href = "/";
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("❌ Usuário ou senha inválidos.");
        setTimeout(() => setError(""), 4000); // some após 4 segundos
      } else {
        setError("⚠️ Erro no servidor. Tente novamente mais tarde.");
        setTimeout(() => setError(""), 4000);
      }

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

          {/* Mostra erro */}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label>Usuário</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite seu usuário"
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
