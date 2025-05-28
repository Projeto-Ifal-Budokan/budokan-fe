import { api, ApiResponse } from '@/lib/api/client';
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
    return data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<
    ApiResponse<{
      message: string;
    }>
  > => {
    const response = await api.post<{ message: string }>(
      '/auth/login',
      credentials
    );
    return response;
  },

  register: async (
    userData: CreateUserData
  ): Promise<
    ApiResponse<{
      message: string;
    }>
  > => {
    const response = await api.post<{ message: string }>(
      '/auth/register',
      userData
    );
    return response;
  },

  forgotPassword: async (data: {
    email: string;
  }): Promise<{ message: string }> => {
    const { data: responseData } = await api.post<{ message: string }>(
      '/auth/forgot-password',
      data
    );
    return responseData;
  },

  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<{ message: string }> => {
    const { data: responseData } = await api.post<{ message: string }>(
      '/auth/reset-password',
      data
    );
    return responseData;
  },
};
