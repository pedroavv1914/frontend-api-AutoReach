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
    console.log('🌐 AuthAPI: Making login request to backend...', { email: data.email });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      console.log('📡 AuthAPI: Backend response received:', response);
      return response;
    } catch (error) {
      console.error('❌ AuthAPI: Request failed:', error);
      throw error;
    }
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
      console.log('🚪 AuthAPI: Logging out and clearing tokens...');
      
      // Limpar localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Limpar cookie
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      console.log('✅ AuthAPI: Logout completed, redirecting to login...');
      window.location.href = '/login';
    }
  },

  // Salvar dados de autenticação
  saveAuthData: (token: string, user: User, tenant: Tenant) => {
    if (typeof window !== 'undefined') {
      console.log('💾 AuthAPI: Saving token to localStorage and cookie...', { token: token.substring(0, 20) + '...' });
      
      // Salvar no localStorage (para uso no cliente)
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify({ user, tenant }));
      
      // Salvar no cookie (para o middleware)
      document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      
      console.log('✅ AuthAPI: Token saved successfully');
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
