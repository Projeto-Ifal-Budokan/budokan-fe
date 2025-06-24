'use client';

import { ApiError } from '@/types/api';
import { Privilege } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { rolePrivilegesService } from '../services/role-privileges-service';

export function useRolePrivileges(roleId: string) {
  const queryClient = useQueryClient();

  const privilegesByRole = useQuery<Privilege[], ApiError>({
    queryKey: ['privileges', 'role', roleId],
    queryFn: async () => {
      const response = await rolePrivilegesService.getPrivilegesByRole(roleId);
      return response.data.items || [];
    },
    enabled: !!roleId,
  });

  const assignPrivilege = useMutation({
    mutationFn: rolePrivilegesService.assignPrivilege,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['privileges', 'role', roleId],
      });
    },
    onError: () => {
      toast.error('Erro ao atribuir privilégio');
    },
  });

  const removePrivilege = useMutation({
    mutationFn: rolePrivilegesService.removePrivilege,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['privileges', 'role', roleId],
      });
    },
    onError: () => {
      toast.error('Erro ao remover privilégio');
    },
  });

  return {
    privilegesByRole,
    assignPrivilege,
    removePrivilege,
  };
}
