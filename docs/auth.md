# Authentication

## Overview

- Cookie name: `access_token` (set by backend after successful login)
- Middleware enforces access to protected routes
- Server actions handle login/logout and redirects for auth errors
- Client hooks expose auth operations with React Query

## Middleware guard

File: `src/middleware.ts`

- Protected: `/dashboard` (and subpaths)
- Auth pages: `/login`, `/register`, `/forgot-password`
- Behavior:
  - If authenticated and visiting an auth page → redirect to `/dashboard`
  - If unauthenticated and visiting a protected page → redirect to `/login?from=/protected/path`

## Server actions

File: `src/app/actions/auth.ts`

- `loginAction({ email, password })`: delegates to `authService.login`
- `logoutAction()`: deletes `access_token` cookie, revalidates, redirects to `/login`
- `handleUnauthorized()`: clears cookie and redirects to `/login` (used by API client on 401)
- `handleNotAccessPage()`: revalidates and redirects to `/dashboard` (used on 403)

File: `src/app/actions/me.ts`

- `meAction()`: proxies `authService.me()` and returns current user data

## Client-side hook

File: `src/lib/api/queries/use-auth.ts`

- `me`: `useQuery(['auth','me'])` to fetch the current user
- `login`, `register`, `forgotPassword`, `resetPassword`: mutations with success toasts
- `clearAuthCache()`: utility to clear query cache if needed

## SSR/route helpers

File: `src/lib/auth.ts`

- `getUserPrivileges()`: uses `authService.me()`
- `hasPrivilege()`, `hasAnyPrivilege()`, `hasAllPrivileges()`
- `requirePrivilege()` and `requireAnyPrivilege()`: redirect to access denied if the user lacks required privileges

Note: Access denied page currently exists at `src/app/(internal)/dashboard/acesso-negado/page.tsx`. Ensure redirect paths align with the page route.
