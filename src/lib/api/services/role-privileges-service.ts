import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Privilege } from '@/types/user';

export interface AssignPrivilegeData {
  idRole: number;
  idPrivilege: number;
}

export interface RemovePrivilegeData {
  idRole: number;
  idPrivilege: number;
}

export const rolePrivilegesService = {
  getRolePrivileges: async (id: string): Promise<ApiResponse<Privilege>> => {
    const response = await api.get<Privilege>(`/role-privileges/${id}`);
    return response;
  },

  getPrivilegesByRole: async (
    id: string
  ): Promise<ApiResponse<ApiPaginatedResponse<Privilege[]>>> => {
    const response = await api.get<ApiPaginatedResponse<Privilege[]>>(
      `/role-privileges/${id}`
    );
    return response;
  },

  assignPrivilege: async (
    data: AssignPrivilegeData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/role-privileges/assign', data);
    return response;
  },

  removePrivilege: async (
    data: RemovePrivilegeData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/role-privileges/remove', data);
    return response;
  },
};
