'use client';

import { ApiError } from '@/types/api';
import { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '../services/auth-service';

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
    onSuccess: () => {
      toast.success('Login realizado com sucesso!');
    },
  });

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Conta criada com sucesso!');
    },
  });

  const forgotPassword = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success('E-mail de recuperação enviado com sucesso!');
    },
  });

  const resetPassword = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!');
    },
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
