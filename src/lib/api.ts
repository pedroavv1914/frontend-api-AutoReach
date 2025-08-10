import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({ baseURL });

// Adiciona Authorization se houver token salvo
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Trata 401/403
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (typeof window !== "undefined" && (status === 401 || status === 403)) {
      // opcional: redirecionar para login
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);
