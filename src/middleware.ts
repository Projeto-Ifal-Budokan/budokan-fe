import { NextRequest, NextResponse } from 'next/server';

// Define which paths require authentication
const protectedPaths = [
  '/dashboard',
  // Add any other protected routes
];

// Define auth pages that authenticated users shouldn't access
const authPages = [
  '/login',
  '/register',
  '/forgot-password',
  // Add any other auth pages
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const authToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!authToken;

  // Check if current path is a protected route
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if current path is an auth page
  const isAuthPage = authPages.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    const redirectTo = request.nextUrl.searchParams.get('from') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && isProtectedPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Specify which paths the middleware should run on
  matcher: [
    // Protected routes
    '/dashboard/:path*',

    // Auth pages
    '/login',
    '/register',
    '/forgot-password',

    // Add other paths that need protection checking
  ],
};
