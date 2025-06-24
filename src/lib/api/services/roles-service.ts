import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Role } from '@/types/user';

export interface CreateRoleData {
  name: string;
  description: string;
}

export interface UpdateRoleData {
  name: string;
  description: string;
}

export const rolesService = {
  getRole: async (id: string): Promise<ApiResponse<Role>> => {
    const response = await api.get<Role>(`/roles/${id}`);
    return response;
  },

  listRoles: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<ApiPaginatedResponse<Role[]>>> => {
    const response = await api.get<ApiPaginatedResponse<Role[]>>(
      `/roles/?page=${page}&page_size=${pageSize}`
    );
    return response;
  },

  createRole: async (data: CreateRoleData): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/roles/', data);
    return response;
  },

  updateRole: async (
    id: string,
    data: UpdateRoleData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/roles/${id}`, data);
    return response;
  },

  deleteRole: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/roles/${id}`);
    return response;
  },
};
