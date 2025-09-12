import { useState, useRef } from "react";
import api from "../api/axios";
import FiltroEncomenda from "./FiltroEncomenda";
import { toast } from "react-toastify"; // 🔔

function BuscarEncomenda() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fotoCapturada, setFotoCapturada] = useState({});
  const [expandirEntrega, setExpandirEntrega] = useState({}); // controla expansão por encomenda

  const videoRef = useRef({});
  const canvasRef = useRef({});
  const streamRef = useRef({});

  // 🔎 Busca
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = "/encomendas/buscar/";
      if (busca.trim()) url += `?nome=${busca}`;
      const res = await api.get(url);
      setResultados(res.data);
    } catch {
      toast.error("❌ Erro ao buscar encomendas!");
    } finally {
      setLoading(false);
    }
  };

  // 🎥 Abrir câmera
  const startCamera = async (id) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current[id]) {
        videoRef.current[id].srcObject = stream;
        streamRef.current[id] = stream;
      }
      toast.info("🎥 Câmera iniciada!");
    } catch (err) {
      toast.error("⚠️ Erro ao acessar a câmera: " + err.message);
    }
  };

  // ❌ Fechar câmera
  const stopCamera = (id) => {
    if (streamRef.current[id]) {
      streamRef.current[id].getTracks().forEach((track) => track.stop());
      streamRef.current[id] = null;
    }
    if (videoRef.current[id]) {
      videoRef.current[id].srcObject = null;
    }
    toast.info("❌ Câmera fechada.");
  };

  // 📷 Capturar foto
  const capturePhoto = (id) => {
    const video = videoRef.current[id];
    const canvas = canvasRef.current[id];
    if (!video || !video.srcObject) {
      toast.warning("⚠️ Abra a câmera antes de capturar!");
      return;
    }

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setFotoCapturada((prev) => ({ ...prev, [id]: blob }));
        toast.success("✅ Foto capturada! Agora clique em 'Marcar como Entregue'.");
      }
    }, "image/jpeg");
  };

  // 📦 Marcar como entregue
  const deliverPackage = async (id) => {
    const blob = fotoCapturada[id];
    if (!blob) {
      toast.warning("⚠️ É necessário capturar ou anexar uma foto antes de entregar!");
      return;
    }

    const file = new File([blob], `entrega_${id}.jpg`, { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("foto_encomenda_entregue", file);

    try {
      await api.put(`/encomendas/entregar/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("📦 Encomenda entregue com sucesso!");
      setFotoCapturada((prev) => ({ ...prev, [id]: null }));
      handleSearch(new Event("submit"));
    } catch {
      toast.error("❌ Erro ao salvar entrega!");
    }
  };

  // 📂 Upload manual
  const handleFileSelect = (id, file) => {
    if (!file) return;
    setFotoCapturada((prev) => ({ ...prev, [id]: file }));
    toast.success("✅ Arquivo anexado! Agora clique em 'Marcar como Entregue'.");
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold text-primary">📦 Buscar e Entregar Encomenda</h2>
          <p className="text-muted mb-0">
            Utilize os filtros ou a busca rápida para localizar encomendas.
          </p>
        </div>
        <form onSubmit={handleSearch} className="d-flex">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Digite nome, código ou status"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "🔄" : "🔍 Buscar"}
            </button>
          </div>
        </form>
      </div>

      <FiltroEncomenda onResultados={setResultados} />

      {resultados.length === 0 && !loading && (
        <p className="text-muted">Nenhuma encomenda encontrada.</p>
      )}

      <div className="row">
        {resultados.map((e) => (
          <div key={e.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold text-dark">
                  {e.nome_destinatario}
                </h5>
                <p className="small mb-1"><strong>Código:</strong> {e.codigo}</p>
                <p>
                  <span
                    className={`badge ${
                      e.status === "ENTREGUE"
                        ? "bg-success"
                        : e.status === "RECEBIDO"
                        ? "bg-info"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {e.status}
                  </span>
                </p>

                {/* Data de chegada */}
                <p className="small mb-1">
                  <strong>Data de Chegada:</strong>{" "}
                  {new Date(e.data_chegada).toLocaleString("pt-BR")}{" "}
                  {!e.foto_encomenda_recebida && (
                    <span className="text-danger">(⚠️ foto removida)</span>
                  )}
                </p>

                {/* Data de retirada */}
                <p className="small mb-3">
                  <strong>Data de Retirada:</strong>{" "}
                  {e.data_retirada
                    ? new Date(e.data_retirada).toLocaleString("pt-BR")
                    : "Ainda não retirada"}{" "}
                  {e.data_retirada && !e.foto_encomenda_entregue && (
                    <span className="text-danger">(⚠️ foto removida)</span>
                  )}
                </p>

                {/* Foto recebida */}
                {e.foto_encomenda_recebida && (
                  <div className="mb-3 text-center">
                    <img
                      src={`http://localhost:8000${e.foto_encomenda_recebida}`}
                      alt="Recebida"
                      className="img-fluid rounded border"
                      style={{ maxHeight: "150px" }}
                    />
                    <p className="text-muted small">📷 Foto recebida</p>
                  </div>
                )}

                {/* Foto entregue */}
                {e.foto_encomenda_entregue && (
                  <div className="mb-3 text-center">
                    <img
                      src={`http://localhost:8000${e.foto_encomenda_entregue}`}
                      alt="Entregue"
                      className="img-fluid rounded border"
                      style={{ maxHeight: "150px" }}
                    />
                    <p className="text-muted small">✅ Foto entregue</p>
                  </div>
                )}

                {/* Confirmar entrega - bloco recolhido/expandido */}
                {e.status !== "ENTREGUE" && (
                  <div className="mt-3">
                    {!expandirEntrega[e.id] ? (
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() =>
                          setExpandirEntrega((prev) => ({ ...prev, [e.id]: true }))
                        }
                      >
                        📦 Confirmar Entrega
                      </button>
                    ) : (
                      <>
                        <div className="card p-2 border bg-light">
                          <label className="form-label small fw-bold">
                            Confirmar entrega:
                          </label>

                          <div className="mb-2 text-center">
                            <video
                              ref={(el) => (videoRef.current[e.id] = el)}
                              autoPlay
                              playsInline
                              className="rounded border"
                              style={{ width: "100%", maxHeight: "180px" }}
                            />
                            <canvas
                              ref={(el) => (canvasRef.current[e.id] = el)}
                              style={{ display: "none" }}
                            />
                          </div>

                          <div className="d-grid gap-2">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => startCamera(e.id)}
                            >
                              🎥 Abrir Câmera
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              type="button"
                              onClick={() => stopCamera(e.id)}
                            >
                              ❌ Fechar Câmera
                            </button>

                            <label className="btn btn-outline-dark">
                              📂 Anexar Arquivo
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(event) =>
                                  handleFileSelect(e.id, event.target.files[0])
                                }
                              />
                            </label>

                            <button
                              className="btn btn-warning"
                              type="button"
                              onClick={() => capturePhoto(e.id)}
                            >
                              📸 Capturar Foto
                            </button>

                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={() => deliverPackage(e.id)}
                            >
                              ✅ Marcar como Entregue
                            </button>
                          </div>
                        </div>

                        <button
                          className="btn btn-sm btn-link mt-2"
                          onClick={() =>
                            setExpandirEntrega((prev) => ({ ...prev, [e.id]: false }))
                          }
                        >
                          🔽 Fechar opções
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuscarEncomenda;
