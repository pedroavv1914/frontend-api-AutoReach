import { apiClient } from './api';
import { OAuthConfig, OAuthUrls } from './types';

export interface OAuthAppConfig {
  linkedin?: {
    clientId: string;
    clientSecret: string;
  };
  instagram?: {
    clientId: string;
    clientSecret: string;
  };
}

export interface ConnectedAccount {
  id: string;
  provider: 'linkedin' | 'instagram';
  providerAccountId: string;
  name?: string;
  username?: string;
  profileUrl?: string;
  followers?: number;
  isActive: boolean;
  connectedAt: string;
}

// OAuth Apps API functions
export const oauthApi = {
  // Obter configuração atual das OAuth apps
  getConfig: async (): Promise<OAuthConfig> => {
    return apiClient.get<OAuthConfig>('/oauth-apps/config');
  },

  // Salvar configuração das OAuth apps
  saveConfig: async (config: OAuthAppConfig): Promise<{ success: boolean; message: string }> => {
    return apiClient.put('/oauth-apps/config', config);
  },

  // Obter URLs de autorização
  getAuthorizationUrls: async (): Promise<OAuthUrls> => {
    return apiClient.get<OAuthUrls>('/oauth-apps/authorization-urls');
  },

  // Obter contas conectadas
  getConnectedAccounts: async (): Promise<ConnectedAccount[]> => {
    return apiClient.get<ConnectedAccount[]>('/accounts/connected');
  },

  // Desconectar conta
  disconnectAccount: async (accountId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/accounts/${accountId}/disconnect`);
  },

  // Testar configuração OAuth
  testConfig: async (provider: 'linkedin' | 'instagram'): Promise<{ valid: boolean; error?: string }> => {
    return apiClient.post(`/oauth-apps/test/${provider}`);
  }
};
