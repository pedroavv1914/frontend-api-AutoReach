import { apiClient } from './api';
import { AuthResponse, User, Tenant } from './types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password: string;
}

// Auth API functions
export const authApi = {
  // Login com contexto de tenant
  login: async (data: LoginData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  // Registro com contexto de tenant
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  // Obter informações do usuário atual
  me: async (): Promise<{ id: string; name?: string; email: string; roles?: string[] }> => {
    return apiClient.get('/users/me');
  },

  // Logout (limpa token local)
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
  },

  // Salvar dados de autenticação
  saveAuthData: (token: string, user: User, tenant: Tenant) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify({ user, tenant }));
    }
  },

  // Recuperar dados salvos
  getStoredAuthData: (): { user: User; tenant: Tenant } | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return !!token;
    }
    return false;
  }
};
