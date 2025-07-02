import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import {
  Attendance,
  AttendanceBatchUpdate,
  AttendanceFilters,
  CreateAttendanceData,
  UpdateAttendanceData,
} from '@/types/attendance';

export const attendanceService = {
  getSessionAttendances: async (
    filters: AttendanceFilters = {}
  ): Promise<ApiResponse<ApiPaginatedResponse<Attendance[]>>> => {
    const params = new URLSearchParams();

    if (filters.status && filters.status !== 'all')
      params.append('status', filters.status);
    if (filters.idSession)
      params.append('idSession', filters.idSession.toString());
    if (filters.studentName) params.append('studentName', filters.studentName);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size)
      params.append('page_size', filters.page_size.toString());

    const queryString = params.toString();
    const url = queryString ? `/attendances?${queryString}` : `/attendances`;

    const response = await api.get<ApiPaginatedResponse<Attendance[]>>(url);
    return response;
  },

  createAttendance: async (
    data: CreateAttendanceData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>('/attendances', data);
    return response;
  },

  updateAttendance: async (
    idSession: number,
    data: UpdateAttendanceData[]
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(
      `/attendances/session/${idSession}`,
      data
    );
    return response;
  },

  batchUpdateAttendances: async (
    sessionId: string,
    data: AttendanceBatchUpdate
  ): Promise<ApiResponse<Response>> => {
    const response = await api.patch<Response>(
      `/sessions/${sessionId}/attendances/batch`,
      data
    );
    return response;
  },

  deleteAttendance: async (id: string): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/attendances/${id}`);
    return response;
  },
};
