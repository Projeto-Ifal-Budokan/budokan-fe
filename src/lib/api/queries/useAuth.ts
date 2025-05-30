'use client';

import { User } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError, authService } from '../services/auth-service';

export function useAuth() {
  const me = useQuery<User, ApiError>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authService.me();
      return response.data;
    },
    retry: 1,
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

  return {
    me,
    login,
    register,
    forgotPassword,
    resetPassword,
  };
}
