import { api, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { CreateRankData, Ranking, UpdateRankData } from '@/types/ranking';

export const rankingsService = {
  getRankings: async (
    disciplineId?: string
  ): Promise<ApiResponse<Ranking[]>> => {
    const params = disciplineId ? `?disciplineId=${disciplineId}` : '';
    const response = await api.get<Ranking[]>(`/ranks${params}`);
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
      `/rankings/discipline/${disciplineId}`);
    return response;
  },
};
