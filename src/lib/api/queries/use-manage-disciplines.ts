'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { disciplinesService } from '../services/disciplines-service';

export const disciplineKeys = {
  all: ['disciplines'] as const,
  detail: (id: string) => [...disciplineKeys.all, Number(id)] as const,
  lists: () => [...disciplineKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...disciplineKeys.lists(), { filters }] as const,
  details: () => [...disciplineKeys.all, 'detail'] as const,
} as const;

const getDisciplineQuery = (id: string) => ({
  queryKey: disciplineKeys.detail(id),
  queryFn: async () => {
    const response = await disciplinesService.getDiscipline(id);
    return response.data;
  },
});

const listDisciplinesQuery = (page: number = 1, pageSize: number = 10) => ({
  queryKey: disciplineKeys.list({ page, pageSize }),
  queryFn: async () => {
    const response = await disciplinesService.getDisciplines(page, pageSize);
    return response;
  },
});

export function useManageDisciplines() {
  const queryClient = useQueryClient();

  const useDiscipline = (id: string) => {
    return useQuery({
      ...getDisciplineQuery(id),
      enabled: !!id,
    });
  };

  const useDisciplines = (page: number = 1, pageSize: number = 10) => {
    return useQuery({
      ...listDisciplinesQuery(page, pageSize),
    });
  };

  const fetchDiscipline = async (id: string) => {
    return await queryClient.fetchQuery(getDisciplineQuery(id));
  };

  const fetchDisciplines = async (page: number = 1, pageSize: number = 10) => {
    return await queryClient.fetchQuery(listDisciplinesQuery(page, pageSize));
  };

  const createDiscipline = useMutation({
    mutationFn: disciplinesService.createDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplineKeys.all });
      toast.success('Disciplina criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating discipline:', error);
      toast.error('Erro ao criar disciplina');
    },
  });

  const updateDiscipline = useMutation({
    mutationFn: disciplinesService.updateDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplineKeys.all });
      toast.success('Disciplina atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating discipline:', error);
      toast.error('Erro ao atualizar disciplina');
    },
  });

  const deleteDiscipline = useMutation({
    mutationFn: disciplinesService.deleteDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplineKeys.all });
      toast.success('Disciplina excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting discipline:', error);
      toast.error('Erro ao excluir disciplina');
    },
  });

  return {
    useDiscipline,
    useDisciplines,
    fetchDiscipline,
    fetchDisciplines,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
  };
}
