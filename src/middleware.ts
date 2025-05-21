import { NextRequest, NextResponse } from 'next/server';

// Define which paths require authentication
const protectedPaths = [
  '/dashboard',
  // Add any other protected routes
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path should be protected
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath) {
    // Get auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;

    // If no token found, redirect to login
    if (!authToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Specify which paths the middleware should run on
  matcher: [
    '/dashboard/:path*',
    // Add other paths that need protection checking
  ],
};
