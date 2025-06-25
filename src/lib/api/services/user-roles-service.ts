import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Role } from '@/types/user';

export interface UserRole {
  id: number;
  name: string;
  description: string;
}

export interface AssignUserRoleData {
  idRole: number;
  idUser: number;
}

export interface RemoveUserRoleData {
  idRole: number;
  idUser: number;
}

export const userRolesService = {
  getUserRole: async (id: string): Promise<ApiResponse<UserRole>> => {
    const response = await api.get<UserRole>(`/user-roles/${id}`);
    return response;
  },

  getRolesByUser: async (
    userId: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<ApiResponse<ApiPaginatedResponse<Role[]>>> => {
    const response = await api.get<ApiPaginatedResponse<Role[]>>(
      `/user-roles/user/${userId}?page=${page}&page_size=${pageSize}`
    );
    return response;
  },

  assignRole: async (
    data: AssignUserRoleData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/user-roles/assign', data);
    return response;
  },

  removeRole: async (
    data: RemoveUserRoleData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/user-roles/remove', data);
    return response;
  },
};
