'use client';

import { ApiError } from '@/types/api';
import { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user-service';

export function useManageUsers() {
  const queryClient = useQueryClient();

  const getUser = (id: string) =>
    useQuery<User, ApiError>({
      queryKey: ['users', id],
      queryFn: async () => {
        const response = await userService.getUser(id);
        return response.data;
      },
    });

  const listUsers = useQuery<User[], ApiError>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.listUsers();
      return response.data;
    },
  });

  const deleteUser = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUser = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });

  return {
    getUser,
    listUsers,
    deleteUser,
    updateUser,
  };
}
