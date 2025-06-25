'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesService, UpdateRoleData } from '../services/roles-service';

export const roleKeys = {
  all: ['roles'] as const,
  detail: (id: string) => [...roleKeys.all, Number(id)] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...roleKeys.lists(), { filters }] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
} as const;

const getRoleQuery = (id: string) => ({
  queryKey: roleKeys.detail(id),
  queryFn: async () => {
    const response = await rolesService.getRole(id);
    return response.data;
  },
});

const listRolesQuery = (page?: number, pageSize?: number) => ({
  queryKey: roleKeys.list({ page, pageSize }),
  queryFn: async () => {
    const response = await rolesService.listRoles(page, pageSize);
    return response;
  },
});

export function useManageRoles() {
  const queryClient = useQueryClient();

  const useRole = (id: string) => {
    return useQuery({
      ...getRoleQuery(id),
      enabled: !!id, // Only run if id exists
    });
  };

  const useRoles = (page: number = 1, pageSize: number = 10) => {
    return useQuery({
      ...listRolesQuery(page, pageSize),
    });
  };

  const fetchRole = async (id: string) => {
    return await queryClient.fetchQuery(getRoleQuery(id));
  };

  const fetchRoles = async (page?: number, pageSize?: number) => {
    return await queryClient.fetchQuery(listRolesQuery(page, pageSize));
  };

  const createRole = useMutation({
    mutationFn: rolesService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success('Papel criado com sucesso!');
    },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) =>
      rolesService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success('Papel atualizado com sucesso!');
    },
  });

  const deleteRole = useMutation({
    mutationFn: rolesService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success('Papel excluído com sucesso!');
    },
  });

  return {
    useRole,
    useRoles,
    fetchRole,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}
