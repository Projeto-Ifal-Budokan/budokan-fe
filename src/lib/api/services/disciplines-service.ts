import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Discipline } from '@/types/discipline';

export interface CreateDisciplineData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export const disciplinesService = {
  getDiscipline: async (id: string): Promise<ApiResponse<Discipline>> => {
    const response = await api.get<Discipline>(`/disciplines/${id}`);
    return response;
  },

  getDisciplines: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<ApiPaginatedResponse<Discipline[]>>> => {
    const response = await api.get<ApiPaginatedResponse<Discipline[]>>(
      `/disciplines/?page=${page}&page_size=${pageSize}`
    );
    return response;
  },

  createDiscipline: async (
    data: CreateDisciplineData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/disciplines/', data);
    return response;
  },

  updateDiscipline: async (
    data: Partial<Discipline>
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/disciplines/${data.id}`, data);
    return response;
  },

  deleteDiscipline: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/disciplines/${id}`);
    return response;
  },
};
