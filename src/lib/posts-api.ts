import { apiClient } from './api';
import { Post, PostsResponse } from './types';

export interface CreatePostData {
  content: string;
  mediaUrls?: string[];
  networks: string[];
  scheduledAt?: string;
}

export interface PostFilters {
  status?: 'pending' | 'published' | 'error' | 'canceled';
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

// Posts API functions
export const postsApi = {
  // Listar posts com filtros
  list: async (filters: PostFilters = {}): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const query = params.toString();
    return apiClient.get<PostsResponse>(`/posts${query ? `?${query}` : ''}`);
  },

  // Criar novo post
  create: async (data: CreatePostData): Promise<Post> => {
    return apiClient.post<Post>('/posts', data);
  },

  // Obter post por ID
  getById: async (id: string): Promise<Post> => {
    return apiClient.get<Post>(`/posts/${id}`);
  },

  // Atualizar post
  update: async (id: string, data: Partial<CreatePostData>): Promise<Post> => {
    return apiClient.put<Post>(`/posts/${id}`, data);
  },

  // Deletar post
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/posts/${id}`);
  },

  // Cancelar post agendado
  cancel: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post(`/posts/${id}/cancel`);
  },

  // Reenviar post com erro
  retry: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post(`/posts/${id}/retry`);
  }
};
