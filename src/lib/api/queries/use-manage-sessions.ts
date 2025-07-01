'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { SessionFilters } from '@/types/session';
import { sessionsService } from '../services/sessions-service';

export const sessionKeys = {
  all: ['sessions'] as const,
  detail: (id: string) => [...sessionKeys.all, Number(id)] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters?: SessionFilters) =>
    [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
} as const;

const getSessionQuery = (id: string) => ({
  queryKey: sessionKeys.detail(id),
  queryFn: async () => {
    const response = await sessionsService.getSession(id);
    return response.data;
  },
});

const listSessionsQuery = (filters: SessionFilters = {}) => ({
  queryKey: sessionKeys.list(filters),
  queryFn: async () => {
    const response = await sessionsService.getSessions(filters);
    return response;
  },
});

export function useManageSessions() {
  const queryClient = useQueryClient();

  const useSession = (id: string) => {
    return useQuery({
      ...getSessionQuery(id),
      enabled: !!id,
    });
  };

  const useSessions = (filters: SessionFilters = {}) => {
    return useQuery({
      ...listSessionsQuery(filters),
    });
  };

  const fetchSession = async (id: string) => {
    return await queryClient.fetchQuery(getSessionQuery(id));
  };

  const fetchSessions = async (filters: SessionFilters = {}) => {
    return await queryClient.fetchQuery(listSessionsQuery(filters));
  };

  const createSession = useMutation({
    mutationFn: sessionsService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      toast.success('Sessão criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      toast.error('Erro ao criar sessão');
    },
  });

  const updateSession = useMutation({
    mutationFn: sessionsService.updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      toast.success('Sessão atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating session:', error);
      toast.error('Erro ao atualizar sessão');
    },
  });

  const deleteSession = useMutation({
    mutationFn: sessionsService.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      toast.success('Sessão excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting session:', error);
      toast.error('Erro ao excluir sessão');
    },
  });

  return {
    useSession,
    useSessions,
    fetchSession,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
}
