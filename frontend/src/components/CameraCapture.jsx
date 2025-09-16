import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCaptured(null);
      toast.info("🎥 Câmera iniciada");
    } catch (err) {
      toast.error("⚠️ Erro ao acessar a câmera: " + err.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    toast.info("❌ Câmera fechada");
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      toast.warning("⚠️ Abra a câmera antes de capturar!");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "foto_entrega.jpg", { type: "image/jpeg" });
        setCaptured(URL.createObjectURL(blob));
        onCapture(file);
        toast.success("✅ Foto capturada!");
      }
    }, "image/jpeg");
  };

  return (
    <div className="mt-2">
      {!stream && (
        <button className="btn btn-outline-secondary w-100" type="button" onClick={startCamera}>
          🎥 Abrir Câmera
        </button>
      )}

      {stream && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded border mb-2"
            style={{ width: "100%", maxHeight: "220px", background: "#000" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div className="d-flex gap-2">
            <button className="btn btn-warning flex-fill" type="button" onClick={capturePhoto}>
              📸 Capturar
            </button>
            <button className="btn btn-danger flex-fill" type="button" onClick={stopCamera}>
              ❌ Fechar
            </button>
          </div>
        </div>
      )}

      {captured && (
        <div className="text-center mt-2">
          <img
            src={captured}
            alt="Prévia"
            className="img-fluid rounded border"
            style={{ maxHeight: "150px" }}
          />
          <p className="small text-muted">📷 Foto capturada</p>
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
