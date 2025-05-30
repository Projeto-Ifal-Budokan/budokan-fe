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

interface ResponseApi {
  message: string;
}

export const authService = {
  me: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<User>('/auth/me', {
      cache: 'force-cache',
      next: {
        revalidate: 60,
      },
    });
    return response;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<ResponseApi>> => {
    const response = await api.post<{ message: string }>(
      '/auth/login',
      credentials
    );
    return response;
  },

  register: async (
    userData: CreateUserData
  ): Promise<ApiResponse<ResponseApi>> => {
    const response = await api.post<ResponseApi>('/auth/register', userData);
    return response;
  },

  forgotPassword: async (data: { email: string }): Promise<ResponseApi> => {
    const { data: responseData } = await api.post<ResponseApi>(
      '/auth/forgot-password',
      data
    );
    return responseData;
  },

  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<ResponseApi> => {
    const { data: responseData } = await api.post<ResponseApi>(
      '/auth/reset-password',
      data
    );
    return responseData;
  },
};
