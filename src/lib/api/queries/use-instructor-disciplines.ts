'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { instructorDisciplinesService } from '../services/instructor-disciplines-service';

export const instructorDisciplineKeys = {
  all: ['instructor-disciplines'] as const,
  detail: (id: string) =>
    [...instructorDisciplineKeys.all, Number(id)] as const,
  lists: () => [...instructorDisciplineKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...instructorDisciplineKeys.lists(), { filters }] as const,
} as const;

const getInstructorDisciplineQuery = (id: string) => ({
  queryKey: instructorDisciplineKeys.detail(id),
  queryFn: async () => {
    const response =
      await instructorDisciplinesService.getInstructorDiscipline(id);
    return response.data;
  },
});

const listInstructorDisciplinesQuery = (
  page: number = 1,
  pageSize: number = 10,
  filters?: Record<string, unknown>
) => ({
  queryKey: instructorDisciplineKeys.list({ page, pageSize, ...filters }),
  queryFn: async () => {
    const response =
      await instructorDisciplinesService.listInstructorDisciplines(
        page,
        pageSize,
        filters
      );
    return response;
  },
});

export function useInstructorDisciplines() {
  const queryClient = useQueryClient();

  const useInstructorDiscipline = (id: string) => {
    return useQuery({
      ...getInstructorDisciplineQuery(id),
      enabled: !!id,
    });
  };

  const useInstructorDisciplinesList = (
    page: number = 1,
    pageSize: number = 10,
    filters?: Record<string, unknown>
  ) => {
    return useQuery({
      ...listInstructorDisciplinesQuery(page, pageSize, filters),
    });
  };

  const createInstructorDiscipline = useMutation({
    mutationFn: instructorDisciplinesService.createInstructorDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorDisciplineKeys.all });
      toast.success('Disciplina associada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating instructor discipline:', error);
      toast.error('Erro ao associar disciplina');
    },
  });

  const updateInstructorDiscipline = useMutation({
    mutationFn: instructorDisciplinesService.updateInstructorDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorDisciplineKeys.all });
      toast.success('Disciplina atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating instructor discipline:', error);
      toast.error('Erro ao atualizar disciplina');
    },
  });

  const deleteInstructorDiscipline = useMutation({
    mutationFn: instructorDisciplinesService.deleteInstructorDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorDisciplineKeys.all });
      toast.success('Disciplina removida com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting instructor discipline:', error);
      toast.error('Erro ao remover disciplina');
    },
  });

  return {
    useInstructorDiscipline,
    useInstructorDisciplinesList,
    createInstructorDiscipline,
    updateInstructorDiscipline,
    deleteInstructorDiscipline,
  };
}
