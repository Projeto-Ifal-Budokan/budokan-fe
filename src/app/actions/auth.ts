'use server';

import { authService } from '@/lib/api/services/auth-service';

import { LoginFormData } from '@/types/login';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Server action for login
export async function loginAction(data: LoginFormData) {
  const email = data.email;
  const password = data.password;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const { data } = await authService.login({
      email,
      password,
    });

    return { success: true, user: data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

// Server action for logout
export async function logoutAction() {
  // Delete the auth cookie
  (await cookies()).delete('access_token');

  // Revalidate relevant paths after logout
  revalidatePath('/login');

  // Redirect to home page
  redirect('/login');
}
