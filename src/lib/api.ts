import axios from "axios";

// Base URL para o backend multi-tenant
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const api = axios.create({ 
  baseURL,
  timeout: 10000,
});

// Interceptor para adicionar headers necessários
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Adiciona JWT token se disponível
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Para desenvolvimento local: adiciona header de tenant se não estiver usando subdomínios
    const tenantHost = process.env.NEXT_PUBLIC_TENANT_HOST || "dev.aithosreach.com";
    if (tenantHost && !window.location.hostname.includes("aithosreach.com")) {
      config.headers = config.headers || {};
      config.headers["x-tenant-host"] = tenantHost;
    }
  }
  return config;
});

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    
    if (typeof window !== "undefined") {
      if (status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      } else if (status === 403) {
        // Sem permissão
        console.error("Acesso negado");
      } else if (status === 400 && error?.response?.data?.message?.includes("tenant")) {
        // Erro de tenant
        console.error("Erro de tenant:", error.response.data.message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helpers para requisições tipadas
export const apiClient = {
  get: <T = any>(url: string, config?: any) => 
    api.get<T>(url, config).then(res => res.data),
    
  post: <T = any>(url: string, data?: any, config?: any) => 
    api.post<T>(url, data, config).then(res => res.data),
    
  put: <T = any>(url: string, data?: any, config?: any) => 
    api.put<T>(url, data, config).then(res => res.data),
    
  delete: <T = any>(url: string, config?: any) => 
    api.delete<T>(url, config).then(res => res.data),
    
  patch: <T = any>(url: string, data?: any, config?: any) => 
    api.patch<T>(url, data, config).then(res => res.data),
};
