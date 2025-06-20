import { api, ApiResponse } from '@/lib/api/client';

// Types for API responses
export interface Ranking {
  id: number;
  idDiscipline: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  disciplineName?: string;
}

export interface CreateRankingData {
  idDiscipline: number;
  name: string;
  description: string;
}

export interface UpdateRankingData {
  idDiscipline: number;
  name: string;
  description: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

interface ResponseApi {
  message: string;
}

export const rankingService = {
  // Get all rankings
  list: async (): Promise<Ranking[]> => {
    const { data } = await api.get<Ranking[]>('/rankings');
    return data;
  },

  // Get ranking by ID
  getById: async (id: number): Promise<Ranking> => {
    const { data } = await api.get<Ranking>(`/rankings/${id}`);
    return data;
  },

  // Create new ranking
  create: async (
    rankingData: CreateRankingData
  ): Promise<ApiResponse<ResponseApi>> => {
    const response = await api.post<ResponseApi>('/rankings', rankingData);
    return response;
  },

  // Update ranking
  update: async (
    id: number,
    rankingData: UpdateRankingData
  ): Promise<ApiResponse<ResponseApi>> => {
    const response = await api.put<ResponseApi>(`/rankings/${id}`, rankingData);
    return response;
  },

  // Delete ranking
  delete: async (id: number): Promise<ApiResponse<ResponseApi>> => {
    const response = await api.delete<ResponseApi>(`/rankings/${id}`);
    return response;
  },

  // Get rankings by discipline
  getByDiscipline: async (disciplineId: number): Promise<Ranking[]> => {
    const { data } = await api.get<Ranking[]>(
      `/rankings/discipline/${disciplineId}`
    );
    return data;
  },

  // // Get ranking statistics
  // getStats: async (
  //   id: number
  // ): Promise<{
  //   totalStudents: number;
  //   activeStudents: number;
  //   lastExam: string;
  //   nextExam: string;
  // }> => {
  //   const { data } = await api.get(`/rankings/${id}/stats`);
  //   return data;
  // },
};
