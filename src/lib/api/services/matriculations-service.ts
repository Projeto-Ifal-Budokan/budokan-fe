import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Matriculation } from '@/types/matriculation';

export interface CreateMatriculationServiceData {
  idStudent?: number;
  idInstructor?: number;
  idDiscipline: number;
  idRank: number;
}

export const matriculationsService = {
  getMatriculation: async (id: string): Promise<ApiResponse<Matriculation>> => {
    const response = await api.get<Matriculation>(`/matriculations/${id}`);
    return response;
  },

  getMatriculations: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: Record<string, unknown>
  ): Promise<ApiResponse<ApiPaginatedResponse<Matriculation[]>>> => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...Object.fromEntries(
        Object.entries(filters || {})
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([key, value]) => [key, String(value)])
      ),
    });

    const response = await api.get<ApiPaginatedResponse<Matriculation[]>>(
      `/matriculations/?${searchParams}`
    );
    return response;
  },

  createMatriculation: async (
    data: CreateMatriculationServiceData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/matriculations/', data);
    return response;
  },

  updateMatriculation: async (
    data: Partial<Matriculation>
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(
      `/matriculations/${data.id}`,
      data
    );
    return response;
  },

  deleteMatriculation: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/matriculations/${id}`);
    return response;
  },
};
