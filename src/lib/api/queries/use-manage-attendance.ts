import {
  AttendanceBatchUpdate,
  AttendanceFilters,
  CreateAttendanceData,
  UpdateAttendanceData,
} from '@/types/attendance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services/attendance-service';

export function useManageAttendance() {
  const queryClient = useQueryClient();

  const useSessionAttendances = (filters: AttendanceFilters = {}) => {
    return useQuery({
      queryKey: ['session-attendances', filters],
      queryFn: () => attendanceService.getSessionAttendances(filters),
    });
  };

  const createAttendance = useMutation({
    mutationFn: (data: CreateAttendanceData) =>
      attendanceService.createAttendance(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['session-attendances', variables.idSession],
      });
    },
  });

  const updateAttendance = useMutation({
    mutationFn: (data: { idSession: number; data: UpdateAttendanceData[] }) =>
      attendanceService.updateAttendance(data.idSession, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session-attendances'],
      });
    },
  });

  const batchUpdateAttendances = useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: AttendanceBatchUpdate;
    }) => attendanceService.batchUpdateAttendances(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['session-attendances', variables.sessionId],
      });
    },
  });

  const deleteAttendance = useMutation({
    mutationFn: (id: string) => attendanceService.deleteAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session-attendances'],
      });
    },
  });

  return {
    useSessionAttendances,
    createAttendance,
    updateAttendance,
    batchUpdateAttendances,
    deleteAttendance,
  };
}
