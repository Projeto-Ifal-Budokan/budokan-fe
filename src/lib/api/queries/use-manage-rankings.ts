'use client';

import { Ranking } from '@/types/ranking';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rankingsService } from '../services/rankings-service';

export const rankingKeys = {
  all: ['rankings'] as const,
  detail: (id: string) => [...rankingKeys.all, id] as const,
  lists: () => [...rankingKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...rankingKeys.lists(), { filters }] as const,
  byDiscipline: (disciplineId: string) =>
    [...rankingKeys.all, 'discipline', disciplineId] as const,
} as const;

const getRankingsQuery = (
  disciplineId?: string,
  page?: number,
  limit?: number
) => ({
  queryKey: rankingKeys.list({ disciplineId, page, limit }),
  queryFn: async () => {
    const response = await rankingsService.getRankings(
      disciplineId,
      page,
      limit
    );
    return response;
  },
});

const getRankingQuery = (id: string) => ({
  queryKey: rankingKeys.detail(id),
  queryFn: async () => {
    const response = await rankingsService.getRankingById(id);
    return response.data;
  },
});

const getRankingsByDisciplineQuery = (disciplineId: string) => ({
  queryKey: rankingKeys.byDiscipline(disciplineId),
  queryFn: async () => {
    const response =
      await rankingsService.getRankingsByDiscipline(disciplineId);
    return response.data;
  },
});

export function useManageRankings() {
  const queryClient = useQueryClient();

  const useRankings = (
    disciplineId?: string,
    page?: number,
    limit?: number
  ) => {
    return useQuery({
      ...getRankingsQuery(disciplineId, page, limit),
    });
  };

  const useRanking = (id: string) => {
    return useQuery({
      ...getRankingQuery(id),
      enabled: !!id,
    });
  };

  const fetchRankings = async (disciplineId?: string) => {
    return await queryClient.fetchQuery(getRankingsQuery(disciplineId));
  };

  const fetchRanking = async (id: string) => {
    return await queryClient.fetchQuery(getRankingQuery(id));
  };

  const fetchRankingsByDiscipline = async (disciplineId: string) => {
    return await queryClient.fetchQuery(
      getRankingsByDisciplineQuery(disciplineId)
    );
  };

  const createRanking = useMutation({
    mutationFn: rankingsService.createRanking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rankingKeys.all });
      toast.success('Ranking criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating ranking:', error);
      toast.error('Erro ao criar ranking');
    },
  });

  const updateRanking = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Ranking }) =>
      rankingsService.updateRanking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rankingKeys.all });
      toast.success('Ranking atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating ranking:', error);
      toast.error('Erro ao atualizar ranking');
    },
  });

  const deleteRanking = useMutation({
    mutationFn: rankingsService.deleteRanking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rankingKeys.all });
      toast.success('Ranking excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting ranking:', error);
      toast.error('Erro ao excluir ranking');
    },
  });

  return {
    useRankings,
    useRanking,
    fetchRankings,
    fetchRanking,
    fetchRankingsByDiscipline,
    createRanking,
    updateRanking,
    deleteRanking,
  };
}
