import { api, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Privilege } from '@/types/user';
import { getAuthHeaders } from '@/utils/cookie-utils';

export const privilegesService = {
  getPrivileges: async (): Promise<ApiResponse<Privilege[]>> => {
    const response = await api.get<Privilege[]>('/privileges');
    return response;
  },

  getPrivilegesByUser: async (
    id: string
  ): Promise<ApiResponse<Privilege[]>> => {
    const response = await api.get<Privilege[]>(`/privileges/user/${id}`, {
      headers: {
        Cookie: await getAuthHeaders(),
      },
    });
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
