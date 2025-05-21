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
      const cookieValue = parseCookie(setCookieHeader);

      // Set the cookie in the response
      (await cookies()).set(
        'access_token',
        String(cookieValue['access_token']),
        {
          httpOnly: cookieValue.HttpOnly,
          secure: process.env.NODE_ENV === 'production',
          sameSite: cookieValue['SameSite'] as
            | true
            | false
            | 'lax'
            | 'strict'
            | 'none'
            | undefined,
          path: cookieValue.Path,
          maxAge: Number(cookieValue['Max-age']),
          expires: new Date(String(cookieValue['Expires'])),
        }
      );

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
