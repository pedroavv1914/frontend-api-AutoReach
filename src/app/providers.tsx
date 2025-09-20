"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Tenant } from "@/lib/types";
import { authApi } from "@/lib/auth-api";

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Carregar dados salvos na inicialização
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        if (authApi.isAuthenticated()) {
          const storedData = authApi.getStoredAuthData();
          if (storedData) {
            setUser(storedData.user);
            setTenant(storedData.tenant);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthProvider: Starting login process...', { email });
      setIsLoading(true);
      console.log('📡 AuthProvider: Calling authApi.login...');
      const response = await authApi.login({ email, password });
      console.log('📥 AuthProvider: Received response:', response);
      
      if (response.success && response.data) {
        const { user, token, tenant } = response.data;
        console.log('💾 AuthProvider: Saving auth data...', { user: user.email, tenant: tenant?.name });
        authApi.saveAuthData(token, user, tenant);
        setUser(user);
        setTenant(tenant);
        console.log('✅ AuthProvider: Login completed successfully');
      } else {
        console.error('❌ AuthProvider: Invalid login response structure:', response);
        throw new Error('Resposta de login inválida');
      }
    } catch (error: any) {
      console.error('❌ AuthProvider: Login error:', error);
      throw new Error(error?.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
      console.log('🏁 AuthProvider: Login process finished');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.register({ name, email, password });
      
      if (response.success && response.data) {
        const { user, token, tenant } = response.data;
        authApi.saveAuthData(token, user, tenant);
        setUser(user);
        setTenant(tenant);
      } else {
        throw new Error('Resposta de registro inválida');
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error?.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    authApi.logout();
  };

  const value: AuthContextType = {
    user,
    tenant,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

let queryClient: QueryClient | null = null;

export function Providers({ children }: { children: React.ReactNode }) {
  // Evita recriar o client em hot reload
  if (!queryClient) queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
