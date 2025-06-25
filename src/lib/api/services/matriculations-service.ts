import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { Matriculation } from '@/types/matriculation';

export interface CreateMatriculationServiceData {
  idUser: number;
  idDiscipline: number;
  idRank: number;
  type: 'student' | 'instructor';
  paymentExempt?: boolean;
  isPaymentExempt?: boolean;
}

export const matriculationsService = {
  getMatriculation: async (id: string): Promise<ApiResponse<Matriculation>> => {
    const response = await api.get<Matriculation>(`/matriculations/${id}`);
    return response;
  },

  getMatriculations: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      type?: string;
      status?: string;
      discipline?: string;
      search?: string;
    }
  ): Promise<ApiResponse<ApiPaginatedResponse<Matriculation[]>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.discipline && filters.discipline !== 'all') {
      params.append('discipline', filters.discipline);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await api.get<ApiPaginatedResponse<Matriculation[]>>(
      `/matriculations/?${params.toString()}`
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
