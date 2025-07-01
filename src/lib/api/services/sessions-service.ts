import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import {
  CreateSessionData,
  Session,
  SessionFilters,
  UpdateSessionData,
} from '@/types/session';

export const sessionsService = {
  getSession: async (id: string): Promise<ApiResponse<Session>> => {
    const response = await api.get<Session>(`/sessions/${id}`);
    return response;
  },

  getSessions: async (
    filters: SessionFilters = {}
  ): Promise<ApiResponse<ApiPaginatedResponse<Session[]>>> => {
    const params = new URLSearchParams();

    if (filters.initialDate) params.append('initialDate', filters.initialDate);
    if (filters.finalDate) params.append('finalDate', filters.finalDate);
    if (filters.idInstructor)
      params.append('idInstructor', filters.idInstructor.toString());
    if (filters.idDiscipline)
      params.append('idDiscipline', filters.idDiscipline.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size)
      params.append('page_size', filters.page_size.toString());

    const queryString = params.toString();
    const url = queryString ? `/sessions?${queryString}` : '/sessions';

    const response = await api.get<ApiPaginatedResponse<Session[]>>(url);
    return response;
  },

  createSession: async (
    data: CreateSessionData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/sessions', data);
    return response;
  },

  updateSession: async (
    data: UpdateSessionData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/sessions/${data.id}`, data);
    return response;
  },

  deleteSession: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/sessions/${id}`);
    return response;
  },
};
