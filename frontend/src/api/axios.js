import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // backend Django
});

// Interceptor: adiciona o JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: trata token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove tokens salvos
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Redireciona para login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
