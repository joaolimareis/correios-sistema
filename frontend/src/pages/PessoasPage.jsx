import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function PessoasPage() {
  const [pessoas, setPessoas] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", cpf: "", senha: "", tipo_acesso: "FUNCIONARIO" });
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [showCadastro, setShowCadastro] = useState(false);
  const [excluindo, setExcluindo] = useState(null); // guarda o ID da pessoa a excluir

  const carregarPessoas = () => {
    api.get("/pessoas/")
      .then((res) => setPessoas(res.data))
      .catch(() => toast.error("Erro ao carregar pessoas!"));
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  // Adicionar pessoa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pessoas/adicionar/", form);
      toast.success("Pessoa adicionada com sucesso!");
      setForm({ nome: "", email: "", cpf: "", senha: "", tipo_acesso: "FUNCIONARIO" });
      setShowCadastro(false);
      carregarPessoas();
    } catch (error) {
      toast.error("Erro ao adicionar pessoa!");
    }
  };

  // Confirmar exclusão
  const confirmarExclusao = async () => {
    try {
      await api.delete(`/pessoas/excluir/${excluindo}/`);
      toast.success("Pessoa excluída!");
      setExcluindo(null);
      carregarPessoas();
    } catch (error) {
      toast.error("Erro ao excluir pessoa!");
    }
  };

  // Salvar edição
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/pessoas/editar/${editando}/`, formEdit);
      toast.success("Pessoa atualizada!");
      setEditando(null);
      carregarPessoas();
    } catch (error) {
      toast.error("Erro ao editar pessoa!");
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👥 Gestão de Pessoas</h2>
        <button className="btn btn-success" onClick={() => setShowCadastro(true)}>
          ➕ Cadastrar Pessoa
        </button>
      </div>

      {/* Lista */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white">Lista de Pessoas</div>
        <div className="card-body">
          <table className="table table-striped table-hover table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Tipo de Acesso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.email}</td>
                  <td>{p.cpf}</td>
                  <td>{p.tipo_acesso}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning mr-2"
                      onClick={() => {
                        setEditando(p.id);
                        setFormEdit({ ...p, senha: "" });
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setExcluindo(p.id)}
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
                <h5 className="modal-title">Cadastrar Pessoa</h5>                </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Nome</label>
                      <input className="form-control"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input type="email" className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>CPF</label>
                      <input className="form-control"
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                        required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Senha</label>
                      <input type="password" className="form-control"
                        value={form.senha}
                        onChange={(e) => setForm({ ...form, senha: e.target.value })}
                        required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Tipo de Acesso</label>
                      <select className="form-control"
                        value={form.tipo_acesso}
                        onChange={(e) => setForm({ ...form, tipo_acesso: e.target.value })}>
                        <option value="FUNCIONARIO">Funcionário</option>
                        <option value="SECRETARIA">Secretaria</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Salvar</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCadastro(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {editando && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Editar Pessoa</h5>
                
               
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nome</label>
                    <input className="form-control"
                      value={formEdit.nome}
                      onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control"
                      value={formEdit.email}
                      onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>CPF</label>
                    <input className="form-control"
                      value={formEdit.cpf}
                      onChange={(e) => setFormEdit({ ...formEdit, cpf: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Senha (deixe em branco para não alterar)</label>
                    <input type="password" className="form-control"
                      value={formEdit.senha || ""}
                      onChange={(e) => setFormEdit({ ...formEdit, senha: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Tipo de Acesso</label>
                    <select className="form-control"
                      value={formEdit.tipo_acesso}
                      onChange={(e) => setFormEdit({ ...formEdit, tipo_acesso: e.target.value })}>
                      <option value="FUNCIONARIO">Funcionário</option>
                      <option value="SECRETARIA">Secretaria</option>
                      <option value="ADMINISTRADOR">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-warning">Salvar Alterações</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditando(null)}>Cancelar</button>
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
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja excluir esta pessoa?</p>
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
    </Layout>
  );
}

export default PessoasPage;
