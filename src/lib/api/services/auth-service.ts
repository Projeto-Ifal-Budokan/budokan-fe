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
    const { data, response } = await api.get<User>('/auth/me');

    return data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ data: { message: string }; response: ResponseInit }> => {
    const response = await api.post<{ message: string }>(
      '/auth/login',
      credentials
    );
    return response;
  },

  register: async (userData: CreateUserData): Promise<ResponseInit> => {
    const { response } = await api.post<ResponseInit>(
      '/auth/register',
      userData
    );
    return response;
  },

  forgotPassword: async (data: {
    email: string;
  }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      '/auth/forgot-password',
      data
    );
    return response.data;
  },

  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      '/auth/reset-password',
      data
    );
    return response.data;
  },
};
