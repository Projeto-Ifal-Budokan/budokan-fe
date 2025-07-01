'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { trainingSchedulesService } from '../services/training-schedules-service';

export const trainingScheduleKeys = {
  all: ['training-schedules'] as const,
  detail: (id: string) => [...trainingScheduleKeys.all, Number(id)] as const,
  lists: () => [...trainingScheduleKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...trainingScheduleKeys.lists(), { filters }] as const,
  details: () => [...trainingScheduleKeys.all, 'detail'] as const,
} as const;

const getTrainingScheduleQuery = (id: string) => ({
  queryKey: trainingScheduleKeys.detail(id),
  queryFn: async () => {
    const response = await trainingSchedulesService.getTrainingSchedule(id);
    return response.data;
  },
});

const listTrainingSchedulesQuery = (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    idDiscipline?: string;
    weekday?: string;
    search?: string;
  }
) => ({
  queryKey: trainingScheduleKeys.list({ page, pageSize, filters }),
  queryFn: async () => {
    const response = await trainingSchedulesService.getTrainingSchedules(
      page,
      pageSize,
      filters
    );
    return response;
  },
});

export function useManageTrainingSchedules() {
  const queryClient = useQueryClient();

  const useTrainingSchedule = (id: string) => {
    return useQuery({
      ...getTrainingScheduleQuery(id),
      enabled: !!id,
    });
  };

  const useTrainingSchedules = (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      idDiscipline?: string;
      weekday?: string;
      search?: string;
    }
  ) => {
    return useQuery({
      ...listTrainingSchedulesQuery(page, pageSize, filters),
    });
  };

  const fetchTrainingSchedule = async (id: string) => {
    return await queryClient.fetchQuery(getTrainingScheduleQuery(id));
  };

  const fetchTrainingSchedules = async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      idDiscipline?: string;
      weekday?: string;
      search?: string;
    }
  ) => {
    return await queryClient.fetchQuery(
      listTrainingSchedulesQuery(page, pageSize, filters)
    );
  };

  const createTrainingSchedule = useMutation({
    mutationFn: trainingSchedulesService.createTrainingSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingScheduleKeys.all });
      toast.success('Cronograma de treino criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating training schedule:', error);
      toast.error('Erro ao criar cronograma de treino');
    },
  });

  const updateTrainingSchedule = useMutation({
    mutationFn: trainingSchedulesService.updateTrainingSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingScheduleKeys.all });
      toast.success('Cronograma de treino atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating training schedule:', error);
      toast.error('Erro ao atualizar cronograma de treino');
    },
  });

  const deleteTrainingSchedule = useMutation({
    mutationFn: trainingSchedulesService.deleteTrainingSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingScheduleKeys.all });
      toast.success('Cronograma de treino excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting training schedule:', error);
      toast.error('Erro ao excluir cronograma de treino');
    },
  });

  return {
    useTrainingSchedule,
    useTrainingSchedules,
    fetchTrainingSchedule,
    fetchTrainingSchedules,
    createTrainingSchedule,
    updateTrainingSchedule,
    deleteTrainingSchedule,
  };
}
