import { api, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { CreateRankData, Ranking, UpdateRankData } from '@/types/ranking';
import { getAuthHeaders } from '@/utils/cookie-utils';

export const rankingsService = {
  getRankings: async (
    disciplineId?: string
  ): Promise<ApiResponse<Ranking[]>> => {
    const params = disciplineId ? `?disciplineId=${disciplineId}` : '';
    const response = await api.get<Ranking[]>(`/ranks${params}`, {
      headers: {
        Cookie: await getAuthHeaders(),
      },
    });
    return response;
  },

  getRankingById: async (id: string): Promise<ApiResponse<Ranking>> => {
    const response = await api.get<Ranking>(`/ranks/${id}`, {
      headers: {
        Cookie: await getAuthHeaders(),
      },
    });
    return response;
  },

  createRanking: async (
    data: CreateRankData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/ranks', data, {
      headers: {
        Cookie: await getAuthHeaders(),
      },
    });
    return response;
  },

  updateRanking: async (
    id: string,
    data: UpdateRankData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/ranks/${id}`, data, {
      headers: {
        Cookie: await getAuthHeaders(),
      },
    });
    return response;
  },

  deleteRanking: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/ranks/${id}`, {
      headers: {
        Cookie: await getAuthHeaders(),
      },
    });
    return response;
  },

  getRankingsByDiscipline: async (
    disciplineId: string
  ): Promise<ApiResponse<Ranking[]>> => {
    const response = await api.get<Ranking[]>(
      `/rankings/discipline/${disciplineId}`,
      {
        headers: {
          Cookie: await getAuthHeaders(),
        },
      }
    );
    return response;
  },
};
