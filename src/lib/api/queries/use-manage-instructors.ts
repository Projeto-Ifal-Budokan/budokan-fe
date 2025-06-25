'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { instructorDisciplinesService } from '../services/instructor-disciplines-service';

export const instructorKeys = {
  instructorDisciplines: {
    all: ['instructor-disciplines'] as const,
    lists: () => [...instructorKeys.instructorDisciplines.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...instructorKeys.instructorDisciplines.lists(), { filters }] as const,
    detail: (id: string) =>
      [...instructorKeys.instructorDisciplines.all, id] as const,
  },
} as const;

const listInstructorDisciplinesQuery = (
  page: number = 1,
  pageSize: number = 10,
  filters?: Record<string, unknown>
) => ({
  queryKey: instructorKeys.instructorDisciplines.list({
    page,
    pageSize,
    ...filters,
  }),
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

const getInstructorDisciplineQuery = (id: string) => ({
  queryKey: instructorKeys.instructorDisciplines.detail(id),
  queryFn: async () => {
    const response =
      await instructorDisciplinesService.getInstructorDiscipline(id);
    return response.data;
  },
});

export function useManageInstructors() {
  const queryClient = useQueryClient();

  const useInstructorDisciplines = (
    page: number = 1,
    pageSize: number = 10,
    filters?: Record<string, unknown>
  ) => {
    return useQuery({
      ...listInstructorDisciplinesQuery(page, pageSize, filters),
    });
  };

  const useInstructorDiscipline = (id: string) => {
    return useQuery({
      ...getInstructorDisciplineQuery(id),
      enabled: !!id,
    });
  };

  const createInstructorDiscipline = useMutation({
    mutationFn: instructorDisciplinesService.createInstructorDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: instructorKeys.instructorDisciplines.all,
      });
      toast.success('Disciplina do instrutor criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating instructor discipline:', error);
      toast.error('Erro ao criar disciplina do instrutor');
    },
  });

  const updateInstructorDiscipline = useMutation({
    mutationFn: instructorDisciplinesService.updateInstructorDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: instructorKeys.instructorDisciplines.all,
      });
      toast.success('Disciplina do instrutor atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating instructor discipline:', error);
      toast.error('Erro ao atualizar disciplina do instrutor');
    },
  });

  const deleteInstructorDiscipline = useMutation({
    mutationFn: instructorDisciplinesService.deleteInstructorDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: instructorKeys.instructorDisciplines.all,
      });
      toast.success('Disciplina do instrutor excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting instructor discipline:', error);
      toast.error('Erro ao excluir disciplina do instrutor');
    },
  });

  return {
    useInstructorDisciplines,
    useInstructorDiscipline,
    createInstructorDiscipline,
    updateInstructorDiscipline,
    deleteInstructorDiscipline,
  };
}
