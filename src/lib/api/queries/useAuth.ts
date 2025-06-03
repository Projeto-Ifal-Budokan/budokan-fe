'use client';

import { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, authService } from '../services/auth-service';

export function useAuth() {
  const queryClient = useQueryClient();

  const me = useQuery<User, ApiError>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authService.me();

      return response.data;
    },
  });

  const login = useMutation({
    mutationFn: authService.login,
  });

  const register = useMutation({
    mutationFn: authService.register,
  });

  const forgotPassword = useMutation({
    mutationFn: authService.forgotPassword,
  });

  const resetPassword = useMutation({
    mutationFn: authService.resetPassword,
  });

  const clearAuthCache = () => {
    queryClient.clear(); // This will clear all queries
  };

  return {
    me,
    login,
    register,
    forgotPassword,
    resetPassword,
    clearAuthCache,
  };
}
