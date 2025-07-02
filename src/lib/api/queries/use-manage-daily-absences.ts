import {
  CreateDailyAbsenceData,
  DailyAbsenceFilters,
  ProcessDateData,
  ProcessDateRangeData,
  UpdateDailyAbsenceData,
} from '@/types/daily-absence';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dailyAbsenceService } from '../services/daily-absence-service';

export function useManageDailyAbsences() {
  const queryClient = useQueryClient();

  const useDailyAbsences = (filters: DailyAbsenceFilters = {}) => {
    return useQuery({
      queryKey: ['daily-absences', filters],
      queryFn: () => dailyAbsenceService.getDailyAbsences(filters),
    });
  };

  const useDailyAbsenceById = (id: number) => {
    return useQuery({
      queryKey: ['daily-absence', id],
      queryFn: () => dailyAbsenceService.getDailyAbsenceById(id),
      enabled: !!id,
    });
  };

  const createDailyAbsence = useMutation({
    mutationFn: (data: CreateDailyAbsenceData) =>
      dailyAbsenceService.createDailyAbsence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-absences'],
      });
    },
  });

  const updateDailyAbsence = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDailyAbsenceData }) =>
      dailyAbsenceService.updateDailyAbsence(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-absences'],
      });
    },
  });

  const deleteDailyAbsence = useMutation({
    mutationFn: (id: number) => dailyAbsenceService.deleteDailyAbsence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-absences'],
      });
    },
  });

  const processDate = useMutation({
    mutationFn: (data: ProcessDateData) =>
      dailyAbsenceService.processDate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-absences'],
      });
    },
  });

  const processDateRange = useMutation({
    mutationFn: (data: ProcessDateRangeData) =>
      dailyAbsenceService.processDateRange(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-absences'],
      });
    },
  });

  return {
    useDailyAbsences,
    useDailyAbsenceById,
    createDailyAbsence,
    updateDailyAbsence,
    deleteDailyAbsence,
    processDate,
    processDateRange,
  };
}
