import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { CreateRankData, Ranking, UpdateRankData } from '@/types/ranking';

export const rankingsService = {
  getRankings: async (
    disciplineId?: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<ApiPaginatedResponse<Ranking[]>>> => {
    const params = new URLSearchParams();

    if (disciplineId) {
      params.append('disciplineId', disciplineId);
    }
    if (page) {
      params.append('page', page.toString());
    }
    if (limit) {
      params.append('limit', limit.toString());
    }

    const queryString = params.toString();
    const response = await api.get<ApiPaginatedResponse<Ranking[]>>(
      `/ranks${queryString ? `?${queryString}` : ''}`
    );
    return response;
  },

  getRankingById: async (id: string): Promise<ApiResponse<Ranking>> => {
    const response = await api.get<Ranking>(`/ranks/${id}`);
    return response;
  },

  createRanking: async (
    data: CreateRankData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/ranks', data);
    return response;
  },

  updateRanking: async (
    id: string,
    data: UpdateRankData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/ranks/${id}`, data);
    return response;
  },

  deleteRanking: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/ranks/${id}`);
    return response;
  },

  getRankingsByDiscipline: async (
    disciplineId: string
  ): Promise<ApiResponse<Ranking[]>> => {
    const response = await api.get<Ranking[]>(
      `/rankings/discipline/${disciplineId}`
    );
    return response;
  },
};
