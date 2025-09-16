import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import "../assets/encomendas.css";

function EncomendasPage() {
  const [encomendas, setEncomendas] = useState([]);
  const [form, setForm] = useState({
    nome_destinatario: "",
    codigo: "",
    observacao: "",
    foto_encomenda_recebida: null,
  });
  const [previewRecebidaCadastro, setPreviewRecebidaCadastro] = useState(null);

  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [previewRecebidaEdit, setPreviewRecebidaEdit] = useState(null);
  const [previewEntregueEdit, setPreviewEntregueEdit] = useState(null);

  const [showCadastro, setShowCadastro] = useState(false);
  const [excluindo, setExcluindo] = useState(null);

  const [imagemModal, setImagemModal] = useState(null);

  // 🔄 Carregar encomendas
  const carregarEncomendas = () => {
    api
      .get("/encomendas/")
      .then((res) => setEncomendas(res.data))
      .catch(() => toast.error("Erro ao carregar encomendas!"));
  };

  useEffect(() => {
    carregarEncomendas();
  }, []);

  // ➕ Criar encomenda
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.foto_encomenda_recebida) {
      toast.warning("⚠️ Para cadastrar uma encomenda é necessário enviar a foto recebida!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome_destinatario", form.nome_destinatario);
      formData.append("codigo", form.codigo);
      formData.append("observacao", form.observacao || "");
      formData.append("foto_encomenda_recebida", form.foto_encomenda_recebida);

      await api.post("/encomendas/criar/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      toast.success("📦 Encomenda cadastrada!");
      setForm({ nome_destinatario: "", codigo: "", observacao: "", foto_encomenda_recebida: null });
      setPreviewRecebidaCadastro(null);
      setShowCadastro(false);
      carregarEncomendas();
    } catch (err) {
      console.error("Erro:", err.response?.data);
      toast.error("Erro ao cadastrar encomenda!");
    }
  };

  // 📝 Editar encomenda
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nome_destinatario", formEdit.nome_destinatario);
      formData.append("codigo", formEdit.codigo);
      formData.append("status", formEdit.status);
      formData.append("observacao", formEdit.observacao || "");

      if (formEdit.foto_encomenda_recebida instanceof File) {
        formData.append("foto_encomenda_recebida", formEdit.foto_encomenda_recebida);
      }
      if (formEdit.foto_encomenda_entregue instanceof File) {
        formData.append("foto_encomenda_entregue", formEdit.foto_encomenda_entregue);
      }

      await api.put(`/encomendas/editar/${editando}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Encomenda atualizada!");
      setEditando(null);
      carregarEncomendas();
    } catch (err) {
      console.error("Erro ao editar:", err.response?.data);
      toast.error("Erro ao editar encomenda!");
    }
  };

  // 🗑️ Excluir encomenda
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
      <div className="encomendas-page">
        {/* Header */}
        <div className="encomendas-header d-flex justify-content-between align-items-center mb-3">
          <h2>📦 Gestão de Encomendas</h2>
          <button className="btn btn-success" onClick={() => setShowCadastro(true)}>
            Cadastrar Encomenda
          </button>
        </div>

        {/* Lista */}
        <div className="card shadow-sm mb-4 encomendas-card">
          <div className="card-header">Lista de Encomendas</div>
          <div className="card-body">
            <table className="table encomendas-table table-hover table-bordered">
              <thead>
                <tr>
                  <th>Destinatário</th>
                  <th>Código</th>
                  <th>Status</th>
                  <th>Observação</th>
                  <th>Cadastrado por</th>
                  <th>Entregue por</th>
                  <th>Foto Recebida</th>
                  <th>Foto Entregue</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {encomendas.map((e) => (
                  <tr key={e.id}>
                    <td>{e.nome_destinatario}</td>
                    <td>{e.codigo}</td>
                    <td>{e.status}</td>
                    <td>{e.observacao || "-"}</td>
                    <td>{e.cadastrado_por_username || "-"}</td>
                    <td>{e.entregue_por_username || "-"}</td>
                    <td>
                      {e.foto_encomenda_recebida && (
                        <img
                          src={`http://localhost:8000${e.foto_encomenda_recebida}`}
                          alt="Recebida"
                          width="80"
                          className="encomendas-img"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setImagemModal(`http://localhost:8000${e.foto_encomenda_recebida}`)
                          }
                        />
                      )}
                    </td>
                    <td>
                      {e.foto_encomenda_entregue && (
                        <img
                          src={`http://localhost:8000${e.foto_encomenda_entregue}`}
                          alt="Entregue"
                          width="80"
                          className="encomendas-img"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setImagemModal(`http://localhost:8000${e.foto_encomenda_entregue}`)
                          }
                        />
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          setEditando(e.id);
                          setFormEdit({ ...e });
                          setPreviewRecebidaEdit(
                            e.foto_encomenda_recebida
                              ? `http://localhost:8000${e.foto_encomenda_recebida}`
                              : null
                          );
                          setPreviewEntregueEdit(
                            e.foto_encomenda_entregue
                              ? `http://localhost:8000${e.foto_encomenda_entregue}`
                              : null
                          );
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
          <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Cadastrar Encomenda</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
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
                          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label>Observação</label>
                        <textarea
                          className="form-control"
                          value={form.observacao}
                          onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label>Foto Recebida</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setForm({ ...form, foto_encomenda_recebida: file });
                            setPreviewRecebidaCadastro(URL.createObjectURL(file));
                          }}
                          required
                        />
                        {previewRecebidaCadastro && (
                          <img
                            src={previewRecebidaCadastro}
                            alt="Preview"
                            className="mt-2"
                            width="120"
                          />
                        )}
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

        {/* Modal de edição */}
        {editando && (
          <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">Editar Encomenda</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditando(null)}
                  ></button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Destinatário</label>
                        <input
                          className="form-control"
                          value={formEdit.nome_destinatario || ""}
                          onChange={(e) =>
                            setFormEdit({ ...formEdit, nome_destinatario: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Código</label>
                        <input
                          className="form-control"
                          value={formEdit.codigo || ""}
                          onChange={(e) => setFormEdit({ ...formEdit, codigo: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Status</label>
                        <select
                          className="form-select"
                          value={formEdit.status || ""}
                          onChange={(e) => setFormEdit({ ...formEdit, status: e.target.value })}
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="RECEBIDO">📦 Recebido</option>
                          <option value="ENTREGUE">✅ Entregue</option>
                        </select>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label>Observação</label>
                        <textarea
                          className="form-control"
                          value={formEdit.observacao || ""}
                          onChange={(e) => setFormEdit({ ...formEdit, observacao: e.target.value })}
                          rows="3"
                        ></textarea>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Foto Recebida</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFormEdit({ ...formEdit, foto_encomenda_recebida: file });
                            setPreviewRecebidaEdit(URL.createObjectURL(file));
                          }}
                        />
                        {previewRecebidaEdit && (
                          <img src={previewRecebidaEdit} alt="Preview Recebida" width="120" />
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Foto Entregue</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFormEdit({ ...formEdit, foto_encomenda_entregue: file });
                            setPreviewEntregueEdit(URL.createObjectURL(file));
                          }}
                        />
                        {previewEntregueEdit && (
                          <img src={previewEntregueEdit} alt="Preview Entregue" width="120" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-warning">
                      Salvar Alterações
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditando(null)}
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
          <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirmar Exclusão</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
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
                  <button className="btn btn-secondary" onClick={() => setExcluindo(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de imagem ampliada */}
        {imagemModal && (
          <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-transparent border-0 text-center">
                <img src={imagemModal} alt="Visualização" className="img-fluid rounded" />
                <button className="btn btn-light mt-3" onClick={() => setImagemModal(null)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EncomendasPage;
