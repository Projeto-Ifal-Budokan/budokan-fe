import { api, ApiResponse } from '@/lib/api/client';
import { Response } from '@/types/api';
import { User } from '@/types/user';

export const userService = {
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<User>(`/users/${id}`);
    return response;
  },

  listUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get<User[]>('/users/');
    return response;
  },

  deleteUser: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/users/${id}`);
    return response;
  },

  updateUser: async (data: User): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/users/${data.id}`, data);
    return response;
  },
};
