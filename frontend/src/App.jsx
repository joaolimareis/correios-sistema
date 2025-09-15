import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import PessoasPage from "./pages/PessoasPage.jsx";
import EncomendasPage from "./pages/EncomendasPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Home → qualquer logado */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Pessoas → somente Admin */}
        <Route
          path="/pessoas"
          element={
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <PessoasPage />
            </PrivateRoute>
          }
        />

                {/* Encomendas → Admin, Secretaria e Funcionário */}
        <Route
          path="/encomendas"
          element={
            <PrivateRoute roles={["ADMINISTRADOR", "SECRETARIA", "FUNCIONARIO"]}>
              <EncomendasPage />
            </PrivateRoute>
          }
        />
        {/* Rota inválida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
