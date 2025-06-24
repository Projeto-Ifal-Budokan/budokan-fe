'use client';

import { ApiError } from '@/types/api';
import { Privilege } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { privilegesService } from '../services/privileges-service';

export const privilegeKeys = {
  all: ['privileges'] as const,
  detail: (id: string) => [...privilegeKeys.all, Number(id)] as const,
  lists: () => [...privilegeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...privilegeKeys.lists(), { filters }] as const,
  details: () => [...privilegeKeys.all, 'detail'] as const,
  byUser: (userId: string) => [...privilegeKeys.all, 'user', userId] as const,
} as const;

const getPrivilegesQuery = (page: number = 1, pageSize: number = 100) => ({
  queryKey: privilegeKeys.list({ page, pageSize }),
  queryFn: async () => {
    const response = await privilegesService.getPrivileges(page, pageSize);
    return response;
  },
});

const getAllPrivilegesQuery = () => ({
  queryKey: privilegeKeys.all,
  queryFn: async () => {
    const response = await privilegesService.getPrivileges(1, 100);
    return response.data.items;
  },
});

export function usePrivileges() {
  const queryClient = useQueryClient();

  // For paginated listing (new)
  const usePrivilegesPaginated = (page: number = 1, pageSize: number = 10) => {
    return useQuery({
      ...getPrivilegesQuery(page, pageSize),
    });
  };

  // For getting all privileges (existing pattern)
  const privileges = useQuery<Privilege[], ApiError>({
    ...getAllPrivilegesQuery(),
  });

  const createPrivilege = useMutation({
    mutationFn: privilegesService.createPrivilege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privilegeKeys.all });
    },
  });

  const updatePrivilege = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Privilege }) =>
      privilegesService.updatePrivilege(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privilegeKeys.all });
    },
  });

  const deletePrivilege = useMutation({
    mutationFn: privilegesService.deletePrivilege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privilegeKeys.all });
    },
  });

  return {
    privileges, // Keep existing for compatibility
    usePrivilegesPaginated, // New paginated version
    createPrivilege,
    updatePrivilege,
    deletePrivilege,
  };
}

export function usePrivilegesByUser(id: string) {
  return useQuery<Privilege[], ApiError>({
    queryKey: privilegeKeys.byUser(id),
    queryFn: async () => {
      const response = await privilegesService.getPrivilegesByUser(id);
      return response.data.items;
    },
    enabled: !!id,
  });
}
