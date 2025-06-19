'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user-service';

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, Number(id)] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
} as const;

const getUserQuery = (id: string) => ({
  queryKey: userKeys.detail(id),
  queryFn: async () => {
    const response = await userService.getUser(id);
    return response.data;
  },
});

const listUsersQuery = () => ({
  queryKey: userKeys.lists(),
  queryFn: async () => {
    const response = await userService.listUsers();
    return response.data;
  },
});

export function useManageUsers() {
  const queryClient = useQueryClient();

  const useUser = (id: string) => {
    return useQuery({
      ...getUserQuery(id),
      enabled: !!id, // Only run if id exists
    });
  };

  const fetchUser = async (id: string) => {
    return await queryClient.fetchQuery(getUserQuery(id));
  };

  const fetchUsers = async () => {
    return await queryClient.fetchQuery(listUsersQuery());
  };

  const deleteUser = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  const updateUser = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  return {
    useUser,
    fetchUser,
    fetchUsers,
    deleteUser,
    updateUser,
  };
}
