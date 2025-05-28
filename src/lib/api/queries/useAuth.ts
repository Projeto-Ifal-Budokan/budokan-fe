'use client';

import { CreateUserData, User } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError, authService } from '../services/auth-service';

export function useAuth() {
  const me = useQuery<User, ApiError>({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    retry: 1,
  });

  const login = useMutation<
    ResponseInit,
    ApiError,
    { email: string; password: string }
  >({
    mutationFn: authService.login,
  });

  const register = useMutation<ResponseInit, ApiError, CreateUserData>({
    mutationFn: authService.register,
  });

  const forgotPassword = useMutation<
    { message: string },
    ApiError,
    { email: string }
  >({
    mutationFn: authService.forgotPassword,
  });

  const resetPassword = useMutation<
    { message: string },
    ApiError,
    { token: string; password: string }
  >({
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
