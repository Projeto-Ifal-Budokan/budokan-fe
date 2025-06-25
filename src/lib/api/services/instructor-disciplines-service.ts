import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import {
  CreateInstructorDisciplineRequest,
  InstructorDiscipline,
  UpdateInstructorDisciplineRequest,
} from '@/types/instructor';

export const instructorDisciplinesService = {
  getInstructorDiscipline: async (
    id: string
  ): Promise<ApiResponse<InstructorDiscipline>> => {
    const response = await api.get<InstructorDiscipline>(
      `/instructor-disciplines/${id}`
    );
    return response;
  },

  listInstructorDisciplines: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: Record<string, unknown>
  ): Promise<ApiResponse<ApiPaginatedResponse<InstructorDiscipline[]>>> => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...Object.fromEntries(
        Object.entries(filters || {})
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([key, value]) => [key, String(value)])
      ),
    });

    const response = await api.get<
      ApiPaginatedResponse<InstructorDiscipline[]>
    >(`/instructor-disciplines/?${searchParams}`);
    return response;
  },

  createInstructorDiscipline: async (
    data: CreateInstructorDisciplineRequest
  ): Promise<ApiResponse<InstructorDiscipline>> => {
    const response = await api.post<InstructorDiscipline>(
      '/instructor-disciplines/',
      data
    );
    return response;
  },

  updateInstructorDiscipline: async (
    data: UpdateInstructorDisciplineRequest
  ): Promise<ApiResponse<InstructorDiscipline>> => {
    const response = await api.put<InstructorDiscipline>(
      `/instructor-disciplines/${data.id}`,
      data
    );
    return response;
  },

  deleteInstructorDiscipline: async (
    id: string
  ): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(
      `/instructor-disciplines/${id}`
    );
    return response;
  },
};
