'use server';

import { parseCookie } from '@/lib/auth';
import { LoginFormData } from '@/types/login';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Server action for login
export async function loginAction(data: LoginFormData) {
  const email = data.email;
  const password = data.password;
  const cookieStore = await cookies();

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store', // Don't cache login requests
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Login failed' };
    }

    // Get the Set-Cookie header from the response
    const setCookieHeader = response.headers.get('set-cookie');

    if (setCookieHeader) {
      // Parse the cookie value from the Set-Cookie header
      const cookieAuth = parseCookie(setCookieHeader);

      // Set the cookie in the response
      cookieStore.set({
        name: 'authToken',
        value: cookieAuth.access_token as string,
        httpOnly: cookieAuth.HttpOnly,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: cookieAuth.Path,
        maxAge: Number(cookieAuth['Max-Age']),
      });

      // Revalidate relevant paths after login
      revalidatePath('/dashboard');

      return { success: true };
    } else {
      return { success: false, error: 'No authentication cookie received' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

// Server action for logout
export async function logoutAction() {
  // Delete the auth cookie
  (await cookies()).delete('authToken');

  // Revalidate relevant paths after logout
  revalidatePath('/login');

  // Redirect to home page
  redirect('/login');
}
