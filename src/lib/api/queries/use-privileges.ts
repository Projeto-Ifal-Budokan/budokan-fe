'use client';

import { ApiError } from '@/types/api';
import { Privilege } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { privilegesService } from '../services/privileges-service';

export function usePrivileges() {
  const queryClient = useQueryClient();

  const privileges = useQuery<Privilege[], ApiError>({
    queryKey: ['privileges'],
    queryFn: async () => {
      const response = await privilegesService.getPrivileges();
      return response.data;
    },
  });

  const createPrivilege = useMutation({
    mutationFn: privilegesService.createPrivilege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privileges'] });
    },
  });

  const updatePrivilege = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Privilege }) =>
      privilegesService.updatePrivilege(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privileges'] });
    },
  });

  const deletePrivilege = useMutation({
    mutationFn: privilegesService.deletePrivilege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privileges'] });
    },
  });

  return {
    privileges,
    createPrivilege,
    updatePrivilege,
    deletePrivilege,
  };
}

export function usePrivilegesByUser(id: string) {
  return useQuery<Privilege[], ApiError>({
    queryKey: ['privileges', 'user', id],
    queryFn: async () => {
      const response = await privilegesService.getPrivilegesByUser(id);
      return response.data;
    },
    enabled: !!id,
  });
}
