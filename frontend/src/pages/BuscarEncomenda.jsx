import { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function BuscarEncomenda() {
  const [nome, setNome] = useState("");
  const [resultados, setResultados] = useState([]);
  const [fotoEntrega, setFotoEntrega] = useState({});
  const [loading, setLoading] = useState(false);

  // Buscar encomendas pelo nome
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/encomendas/buscar/?nome=${nome}`);
      setResultados(res.data);
    } catch (err) {
      alert("Erro ao buscar encomendas!");
    } finally {
      setLoading(false);
    }
  };

  // Marcar como entregue
  const handleEntregar = async (id) => {
    if (!fotoEntrega[id]) {
      alert("Por favor, selecione uma foto da encomenda entregue!");
      return;
    }

    const formData = new FormData();
    formData.append("foto_encomenda_entregue", fotoEntrega[id]);

    try {
      await api.put(`/encomendas/entregar/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Encomenda marcada como entregue!");
      setResultados(resultados.filter((e) => e.id !== id)); // remove da lista
    } catch (err) {
      alert("Erro ao registrar entrega!");
    }
  };

  return (
    <Layout>
      <h2 className="mb-4">Buscar e Entregar Encomenda</h2>

      {/* Form de busca */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Digite o nome completo do destinatário"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </form>

      {/* Resultados */}
      {resultados.length === 0 && !loading && (
        <p>Nenhuma encomenda encontrada.</p>
      )}

      {resultados.map((e) => (
        <div key={e.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{e.nome_destinatario}</h5>
            <p className="card-text">
              <strong>Código:</strong> {e.codigo} <br />
              <strong>Status:</strong> {e.status}
            </p>
            {e.foto_encomenda_recebida && (
              <img
                src={`http://localhost:8000${e.foto_encomenda_recebida}`}
                alt="Recebida"
                className="img-thumbnail mb-2"
                width="150"
              />
            )}

            <div className="mt-2">
              <label>Foto da entrega:</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={(event) =>
                  setFotoEntrega({ ...fotoEntrega, [e.id]: event.target.files[0] })
                }
              />
              <button
                className="btn btn-success"
                onClick={() => handleEntregar(e.id)}
              >
                Marcar como Entregue
              </button>
            </div>
          </div>
        </div>
      ))}
    </Layout>
  );
}

export default BuscarEncomenda;
