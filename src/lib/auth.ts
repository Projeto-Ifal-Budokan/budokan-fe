import { cookies } from 'next/headers';

// For server-side data fetching with caching
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = (await cookies()).get('authToken')?.value;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    // Next.js 15 fetch caching options
    cache: options.cache || 'no-store',
  });
}

// Check if user is authenticated (for server components)
export async function getAuthToken() {
  return (await cookies()).get('authToken')?.value;
}

export async function isAuthenticated() {
  return !!(await getAuthToken());
}

// Get current user data with caching
export async function getCurrentUser() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch('http://localhost:3000/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Using Next.js 15's cache options:
      // Revalidate every 60 seconds to ensure relatively fresh user data
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

type CookieData = {
  access_token?: string;
  'Max-Age'?: string;
  Path?: string;
  Expires?: string;
  HttpOnly?: boolean;
  SameSite?: 'Strict' | 'Lax' | 'None';
  [key: string]: string | boolean | undefined;
};

export const parseCookie = (cookieStr: string): CookieData => {
  const parts = cookieStr.split(';').map((part) => part.trim());
  const result: CookieData = {};

  for (const part of parts) {
    const [key, ...valParts] = part.split('=');
    if (valParts.length > 0) {
      result[key] = valParts.join('=');
    } else {
      // Handle flags like HttpOnly with no "="
      result[key] = true;
    }
  }

  return result;
};
