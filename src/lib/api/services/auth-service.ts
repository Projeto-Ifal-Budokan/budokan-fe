import { api } from '@/lib/api/client';
import { CreateUserData, User } from '@/types/user';

// Types for API responses
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export const authService = {
  me: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    console.log('authservice', data);
    return data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ data: AuthResponse; headers: Headers }> => {
    const { data, headers } = await api.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return { data, headers };
  },

  register: async (userData: CreateUserData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  forgotPassword: async (data: {
    email: string;
  }): Promise<{ message: string }> => {
    const { data: response } = await api.post<{ message: string }>(
      '/auth/forgot-password',
      data
    );
    return response;
  },

  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<{ message: string }> => {
    const { data: response } = await api.post<{ message: string }>(
      '/auth/reset-password',
      data
    );
    return response;
  },
};
