import axios from "axios";
import { config } from "./env";

// Estender a interface do Axios para incluir propriedade tenant
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    tenant?: {
      host: string;
      domain: string;
    };
  }
}

// Base URL para o backend multi-tenant
export const api = axios.create({ 
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (config.tenant?.host && !window.location.hostname.includes(config.tenant.domain)) {
      config.headers = config.headers || {};
      config.headers["x-tenant-host"] = config.tenant.host;
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
  get: <T = unknown>(url: string, config?: Record<string, unknown>) => 
    api.get<T>(url, config).then(res => res.data),
  
  post: <T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>) => 
    api.post<T>(url, data, config).then(res => res.data),
  
  put: <T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>) => 
    api.put<T>(url, data, config).then(res => res.data),

  delete: <T = unknown>(url: string, config?: Record<string, unknown>) => 
    api.delete<T>(url, config).then(res => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>) => 
    api.patch<T>(url, data, config).then(res => res.data),
};
