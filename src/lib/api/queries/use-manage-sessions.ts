'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  CreateSessionData,
  SessionFilters,
  UpdateSessionData,
} from '@/types/session';
import { sessionsService } from '../services/sessions-service';

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters?: SessionFilters) =>
    [...sessionKeys.lists(), { filters }] as const,
} as const;

const listSessionsQuery = (filters: SessionFilters = {}) => ({
  queryKey: sessionKeys.list(filters),
  queryFn: async () => {
    const response = await sessionsService.getSessions(filters);
    return response;
  },
});

export function useManageSessions() {
  const queryClient = useQueryClient();

  const useSessions = (filters: SessionFilters = {}) => {
    return useQuery({
      queryKey: ['sessions', filters],
      queryFn: () => sessionsService.getSessions(filters),
    });
  };

  const fetchSessions = async (filters: SessionFilters = {}) => {
    return await queryClient.fetchQuery(listSessionsQuery(filters));
  };

  const createSession = useMutation({
    mutationFn: (data: CreateSessionData) =>
      sessionsService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sessions'],
      });
      toast.success('Sessão criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      toast.error('Erro ao criar sessão');
    },
  });

  const updateSession = useMutation({
    mutationFn: (data: UpdateSessionData) =>
      sessionsService.updateSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sessions'],
      });
      toast.success('Sessão atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating session:', error);
      toast.error('Erro ao atualizar sessão');
    },
  });

  const deleteSession = useMutation({
    mutationFn: (id: string) => sessionsService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sessions'],
      });
      toast.success('Sessão excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting session:', error);
      toast.error('Erro ao excluir sessão');
    },
  });

  return {
    useSessions,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
}
