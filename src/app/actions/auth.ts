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
    await authService.login({
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
  const cookieStore = await cookies();

  // Delete the auth cookie with the same configuration used to set it
  // TODO: add enviroment variable for set domain
  cookieStore.delete({
    name: 'access_token',
    domain:
      process.env.NODE_ENV === 'production'
        ? '.budokanryu.com.br'
        : 'localhost',
    path: '/',
  });

  // Revalidate relevant paths after logout
  revalidatePath('/');
  revalidatePath('/login');
  revalidatePath('/dashboard');

  // Redirect to login page
  redirect('/login');
}

// Add this new server action
export async function handleUnauthorized() {
  // Delete the auth cookie
  (await cookies()).delete('access_token');

  // Revalidate relevant paths
  revalidatePath('/');

  // Redirect to login page
  redirect('/login');
}

// Add this new server action
export async function handleNotAccessPage() {
  // Delete the auth cookie

  // Revalidate relevant paths
  revalidatePath('/');

  // Redirect to login page
  redirect('/dashboard');
}
