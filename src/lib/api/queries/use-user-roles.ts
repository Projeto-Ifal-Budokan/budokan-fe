'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AssignUserRoleData,
  RemoveUserRoleData,
  userRolesService,
} from '../services/user-roles-service';

export const userRoleKeys = {
  all: ['user-roles'] as const,
  detail: (id: string) => [...userRoleKeys.all, Number(id)] as const,
  lists: () => [...userRoleKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userRoleKeys.lists(), { filters }] as const,
  details: () => [...userRoleKeys.all, 'detail'] as const,
  byUser: (userId: string) => [...userRoleKeys.all, 'user', userId] as const,
} as const;

const getUserRoleQuery = (id: string) => ({
  queryKey: userRoleKeys.detail(id),
  queryFn: () => userRolesService.getUserRole(id),
});

const getRolesByUserQuery = (
  userId: string,
  page: number = 1,
  pageSize: number = 100
) => ({
  queryKey: userRoleKeys.byUser(userId),
  queryFn: () => userRolesService.getRolesByUser(userId, page, pageSize),
});

export function useUserRoles() {
  const queryClient = useQueryClient();

  const useUserRole = (id: string) => {
    return useQuery({
      ...getUserRoleQuery(id),
      enabled: !!id,
    });
  };

  const useRolesByUser = (
    userId: string,
    page: number = 1,
    pageSize: number = 100
  ) => {
    return useQuery({
      ...getRolesByUserQuery(userId, page, pageSize),
      enabled: !!userId,
    });
  };

  const fetchUserRole = async (id: string) => {
    return await queryClient.fetchQuery(getUserRoleQuery(id));
  };

  const fetchRolesByUser = async (
    userId: string,
    page: number = 1,
    pageSize: number = 100
  ) => {
    return await queryClient.fetchQuery(
      getRolesByUserQuery(userId, page, pageSize)
    );
  };

  const assignRole = useMutation({
    mutationFn: (data: AssignUserRoleData) => userRolesService.assignRole(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userRoleKeys.all });
      queryClient.invalidateQueries({
        queryKey: userRoleKeys.byUser(variables.idUser.toString()),
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Papel atribuído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atribuir papel');
    },
  });

  const removeRole = useMutation({
    mutationFn: (data: RemoveUserRoleData) => userRolesService.removeRole(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userRoleKeys.all });
      queryClient.invalidateQueries({
        queryKey: userRoleKeys.byUser(variables.idUser.toString()),
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Papel removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover papel');
    },
  });

  return {
    useUserRole,
    useRolesByUser,
    fetchUserRole,
    fetchRolesByUser,
    assignRole,
    removeRole,
  };
}
