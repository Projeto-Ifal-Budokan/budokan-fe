'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { matriculationsService } from '../services/matriculations-service';

export const matriculationKeys = {
  all: ['matriculations'] as const,
  detail: (id: string) => [...matriculationKeys.all, Number(id)] as const,
  lists: () => [...matriculationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...matriculationKeys.lists(), { filters }] as const,
  details: () => [...matriculationKeys.all, 'detail'] as const,
} as const;

const getMatriculationQuery = (id: string) => ({
  queryKey: matriculationKeys.detail(id),
  queryFn: async () => {
    const response = await matriculationsService.getMatriculation(id);
    return response.data;
  },
});

const listMatriculationsQuery = (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    type?: string;
    status?: string;
    discipline?: string;
    search?: string;
  }
) => ({
  queryKey: matriculationKeys.list({ page, pageSize, filters }),
  queryFn: async () => {
    const response = await matriculationsService.getMatriculations(
      page,
      pageSize,
      filters
    );
    return response;
  },
});

export function useManageMatriculations() {
  const queryClient = useQueryClient();

  const useMatriculation = (id: string) => {
    return useQuery({
      ...getMatriculationQuery(id),
      enabled: !!id,
    });
  };

  const useMatriculations = (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      type?: string;
      status?: string;
      discipline?: string;
      search?: string;
      idStudent?: string;
      idDiscipline?: string;
      idRank?: string;
    }
  ) => {
    return useQuery({
      ...listMatriculationsQuery(page, pageSize, filters),
    });
  };

  const fetchMatriculation = async (id: string) => {
    return await queryClient.fetchQuery(getMatriculationQuery(id));
  };

  const fetchMatriculations = async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      type?: string;
      status?: string;
      discipline?: string;
      search?: string;
    }
  ) => {
    return await queryClient.fetchQuery(
      listMatriculationsQuery(page, pageSize, filters)
    );
  };

  const createMatriculation = useMutation({
    mutationFn: matriculationsService.createMatriculation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matriculationKeys.all });
      toast.success('Matrícula criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating matriculation:', error);
      toast.error('Erro ao criar matrícula');
    },
  });

  const updateMatriculation = useMutation({
    mutationFn: matriculationsService.updateMatriculation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matriculationKeys.all });
      toast.success('Matrícula atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating matriculation:', error);
      toast.error('Erro ao atualizar matrícula');
    },
  });

  const deleteMatriculation = useMutation({
    mutationFn: matriculationsService.deleteMatriculation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matriculationKeys.all });
      toast.success('Matrícula excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting matriculation:', error);
      toast.error('Erro ao excluir matrícula');
    },
  });

  return {
    useMatriculation,
    useMatriculations,
    fetchMatriculation,
    fetchMatriculations,
    createMatriculation,
    updateMatriculation,
    deleteMatriculation,
  };
}
