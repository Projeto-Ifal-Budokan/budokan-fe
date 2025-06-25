import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Privilege } from '@/types/user';
import { getAuthHeaders } from '@/utils/cookie-utils';

export const privilegesService = {
  getPrivileges: async (
    page: number = 1,
    pageSize: number = 100
  ): Promise<ApiResponse<ApiPaginatedResponse<Privilege[]>>> => {
    const response = await api.get<ApiPaginatedResponse<Privilege[]>>(
      `/privileges/?page=${page}&page_size=${pageSize}`
    );
    return response;
  },

  getPrivilegesByUser: async (
    id: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<ApiResponse<ApiPaginatedResponse<Privilege[]>>> => {
    const response = await api.get<ApiPaginatedResponse<Privilege[]>>(
      `/privileges/user/${id}?page=${page}&page_size=${pageSize}`,
      {
        headers: {
          Cookie: await getAuthHeaders(),
        },
      }
    );
    return response;
  },

  createPrivilege: async (data: Privilege): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/privileges', data, {});
    return response;
  },

  updatePrivilege: async (
    id: string,
    data: Privilege
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/privileges/${id}`, data, {});
    return response;
  },

  deletePrivilege: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/privileges/${id}`, {});
    return response;
  },
};
