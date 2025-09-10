// Types para o sistema multi-tenant
export interface User {
  id: string;
  email: string;
  name?: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  plan?: string;
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    tenant: Tenant;
  };
}

export interface OAuthConfig {
  linkedin?: {
    configured: boolean;
    clientId?: string;
    redirectUri?: string;
    scopes?: string[];
  };
  instagram?: {
    configured: boolean;
    clientId?: string;
    redirectUri?: string;
    scopes?: string[];
  };
}

export interface OAuthUrls {
  linkedin?: string | null;
  instagram?: string | null;
}

export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  networks: string[];
  scheduledAt: string;
  status: 'pending' | 'published' | 'error' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  items: Post[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
