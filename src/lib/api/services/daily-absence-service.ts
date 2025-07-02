import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import {
  CreateDailyAbsenceData,
  DailyAbsence,
  DailyAbsenceFilters,
  ProcessDateData,
  ProcessDateRangeData,
  UpdateDailyAbsenceData,
} from '@/types/daily-absence';

export const dailyAbsenceService = {
  getDailyAbsences: async (
    filters: DailyAbsenceFilters = {}
  ): Promise<ApiResponse<ApiPaginatedResponse<DailyAbsence[]>>> => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.idMatriculation)
      params.append('idMatriculation', filters.idMatriculation.toString());
    if (filters.justification)
      params.append('justification', filters.justification);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size)
      params.append('page_size', filters.page_size.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/daily-absences?${queryString}`
      : `/daily-absences`;

    const response = await api.get<ApiPaginatedResponse<DailyAbsence[]>>(url);
    return response;
  },

  getDailyAbsenceById: async (
    id: number
  ): Promise<ApiResponse<DailyAbsence>> => {
    const response = await api.get<DailyAbsence>(`/daily-absences/${id}`);
    return response;
  },

  createDailyAbsence: async (
    data: CreateDailyAbsenceData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/daily-absences', data);
    return response;
  },

  updateDailyAbsence: async (
    id: number,
    data: UpdateDailyAbsenceData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(`/daily-absences/${id}`, data);
    return response;
  },

  deleteDailyAbsence: async (id: number): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/daily-absences/${id}`);
    return response;
  },

  processDate: async (
    data: ProcessDateData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>(
      '/daily-absences/process-date',
      data
    );
    return response;
  },

  processDateRange: async (
    data: ProcessDateRangeData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>(
      '/daily-absences/process-date-range',
      data
    );
    return response;
  },
};
