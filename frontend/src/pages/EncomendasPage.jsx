import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function EncomendasPage() {
  const [encomendas, setEncomendas] = useState([]);
  const [form, setForm] = useState({
    nome_destinatario: "",
    codigo: "",
    foto_encomenda_recebida: null,
  });
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [showCadastro, setShowCadastro] = useState(false);
  const [excluindo, setExcluindo] = useState(null);

  // Carregar encomendas
  const carregarEncomendas = () => {
    api
      .get("/encomendas/")
      .then((res) => setEncomendas(res.data))
      .catch(() => toast.error("Erro ao carregar encomendas!"));
  };

  useEffect(() => {
    carregarEncomendas();
  }, []);

  // Criar encomenda
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nome_destinatario", form.nome_destinatario);
      formData.append("codigo", form.codigo);
      if (form.foto_encomenda_recebida) {
        formData.append("foto_encomenda_recebida", form.foto_encomenda_recebida);
      }

      await api.post("/encomendas/criar/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      toast.success("Encomenda cadastrada!");
      setForm({ nome_destinatario: "", codigo: "", foto_encomenda_recebida: null });
      setShowCadastro(false);
      carregarEncomendas();
    } catch (err) {
      console.error("Erro:", err.response?.data);
      toast.error("Erro ao cadastrar encomenda!");
    }
  };

  // Excluir encomenda
  const confirmarExclusao = async () => {
    try {
      await api.delete(`/encomendas/deletar/${excluindo}/`);
      toast.success("Encomenda excluída!");
      setExcluindo(null);
      carregarEncomendas();
    } catch {
      toast.error("Erro ao excluir encomenda!");
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📦 Gestão de Encomendas</h2>
        <button className="btn btn-success" onClick={() => setShowCadastro(true)}>
          ➕ Cadastrar Encomenda
        </button>
      </div>

      {/* Lista */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white">Lista de Encomendas</div>
        <div className="card-body">
          <table className="table table-striped table-hover table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Destinatário</th>
                <th>Código</th>
                <th>Status</th>
                <th>Foto Recebida</th>
                <th>Foto Entregue</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {encomendas.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.nome_destinatario}</td>
                  <td>{e.codigo}</td>
                  <td>{e.status}</td>
                  <td>
                    {e.foto_encomenda_recebida && (
                      <img
                        src={`http://localhost:8000${e.foto_encomenda_recebida}`}
                        alt="Recebida"
                        width="80"
                      />
                    )}
                  </td>
                  <td>
                    {e.foto_encomenda_entregue && (
                      <img
                        src={`http://localhost:8000${e.foto_encomenda_entregue}`}
                        alt="Entregue"
                        width="80"
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning mr-2"
                      onClick={() => {
                        setEditando(e.id);
                        setFormEdit({ ...e });
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setExcluindo(e.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de cadastro */}
      {showCadastro && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Cadastrar Encomenda</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowCadastro(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Destinatário</label>
                      <input
                        className="form-control"
                        value={form.nome_destinatario}
                        onChange={(e) =>
                          setForm({ ...form, nome_destinatario: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Código</label>
                      <input
                        className="form-control"
                        value={form.codigo}
                        onChange={(e) =>
                          setForm({ ...form, codigo: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label>Foto Recebida</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            foto_encomenda_recebida: e.target.files[0],
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Salvar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCadastro(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exclusão */}
      {excluindo && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar Exclusão</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setExcluindo(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja excluir esta encomenda?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={confirmarExclusao}>
                  Confirmar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setExcluindo(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição (a implementar depois) */}
    </Layout>
  );
}

export default EncomendasPage;
