import { useState, useEffect } from "react";
import api from "../api/axios";

function FiltroEncomenda({ onResultados }) {

  const hoje = new Date().toISOString().split("T")[0];

  const [status, setStatus] = useState("");
  const [dataInicial, setDataInicial] = useState(hoje);
  const [dataFinal, setDataFinal] = useState(hoje);

  const handleFiltrar = async (e) => {
    if (e) e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (dataInicial) params.append("data_inicial", dataInicial);
      if (dataFinal) params.append("data_final", dataFinal);

      const res = await api.get(`/encomendas/filtrar/?${params.toString()}`);
      onResultados(res.data);
    } catch (err) {
      console.error("Erro ao filtrar encomendas:", err.response?.data);
      onResultados([]);
    }
  };

 
  useEffect(() => {
    handleFiltrar();
  }, []);

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <form onSubmit={handleFiltrar}>
          <div className="row g-2 align-items-end">
            {/* Status */}
            <div className="col-md-3">
              <label className="form-label fw-bold">Status</label>
              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="RECEBIDO">Recebido</option>
                <option value="ENTREGUE">Entregue</option>
              </select>
            </div>

            {/* Data inicial */}
            <div className="col-md-3">
              <label className="form-label fw-bold">Data Inicial</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>

            {/* Data final */}
            <div className="col-md-3">
              <label className="form-label fw-bold">Data Final</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>

            {/* Botão */}
            <div className="col-md-3 d-grid">
              <button type="submit" className="btn btn-primary btn-sm">
                🔍 Filtrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FiltroEncomenda;
