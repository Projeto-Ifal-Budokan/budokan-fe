import { api, ApiResponse } from '@/lib/api/client';
import { Response } from '@/types/api';
import { CreateUserData, User } from '@/types/user';

export const authService = {
  me: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<User>('/auth/me');
    return response;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<Response>> => {
    const response = await api.post<{ message: string }>(
      '/auth/login',
      credentials
    );
    return response;
  },

  register: async (
    userData: CreateUserData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/auth/register', userData);
    return response;
  },

  forgotPassword: async (data: { email: string }): Promise<Response> => {
    const { data: responseData } = await api.post<Response>(
      '/auth/forgot-password',
      data
    );
    return responseData;
  },

  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<Response> => {
    const { data: responseData } = await api.post<Response>(
      '/auth/reset-password',
      data
    );
    return responseData;
  },
};
