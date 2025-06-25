'use server';

import { authService } from '@/lib/api/services/auth-service';

// Server action for login
export async function meAction() {
  try {
    const userData = await authService.me();

    return userData.data;
  } catch (error) {
    console.error('user data error:', error);
    return { error: 'An error occurred during login' };
  }
}
