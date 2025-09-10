import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BuscarEncomenda from "./pages/BuscarEncomenda.jsx";
import HomePage from "./pages/HomePage.jsx";
import PessoasPage from "./pages/PessoasPage.jsx";
import EncomendasPage from "./pages/EncomendasPage.jsx";


function App() {
  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {isAuthenticated ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/pessoas" element={<PessoasPage />} />
            <Route path="/encomendas" element={<EncomendasPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/buscar" element={<BuscarEncomenda />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
