import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';

export interface TrainingSchedule {
  id: number;
  idDiscipline: string;
  weekday: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainingScheduleData {
  idDiscipline: string;
  weekday: string;
  startTime: string;
  endTime: string;
}

export const trainingSchedulesService = {
  getTrainingSchedule: async (
    id: string
  ): Promise<ApiResponse<TrainingSchedule>> => {
    const response = await api.get<TrainingSchedule>(
      `/training-schedules/${id}`
    );
    return response;
  },

  getTrainingSchedules: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      idDiscipline?: string;
      weekday?: string;
      search?: string;
    }
  ): Promise<ApiResponse<ApiPaginatedResponse<TrainingSchedule[]>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (filters?.idDiscipline && filters.idDiscipline !== 'all') {
      params.append('idDiscipline', filters.idDiscipline);
    }
    if (filters?.weekday && filters.weekday !== 'all') {
      params.append('weekday', filters.weekday);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await api.get<ApiPaginatedResponse<TrainingSchedule[]>>(
      `/training-schedules/?${params.toString()}`
    );
    return response;
  },

  createTrainingSchedule: async (
    data: CreateTrainingScheduleData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/training-schedules/', data);
    return response;
  },

  updateTrainingSchedule: async (
    data: Partial<TrainingSchedule>
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(
      `/training-schedules/${data.id}`,
      data
    );
    return response;
  },

  deleteTrainingSchedule: async (
    id: string
  ): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/training-schedules/${id}`);
    return response;
  },
};
