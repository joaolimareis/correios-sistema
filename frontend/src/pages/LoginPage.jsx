import { useState } from "react";
import api from "../api/axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      window.location.href = "/";
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Correios FAAMA</h3>

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

            <div className="form-group mb-3">
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

            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
