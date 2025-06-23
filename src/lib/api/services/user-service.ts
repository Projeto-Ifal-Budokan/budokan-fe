import { api, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { User, UserStatus } from '@/types/user';

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

  updateUserStatus: async (
    id: string,
    status: UserStatus
  ): Promise<ApiResponse<Response>> => {
    const response = await api.patch<Response>(`/users/${id}/status`, {
      status,
    });
    return response;
  },
};
