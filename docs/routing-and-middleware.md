# Routing and Middleware

## Routing

- Uses Next.js App Router under `src/app/`
- Public site: `src/app/(landing-page)/*`
- Authenticated site: `src/app/(internal)/dashboard/*`

## Middleware

File: `src/middleware.ts`

- Matcher:
  - `/dashboard/:path*`
  - `/login`, `/register`, `/forgot-password`
- Logic:
  - Reads `access_token` from cookies
  - Redirects authenticated users away from auth pages to `/dashboard`
  - Redirects unauthenticated users from protected routes to `/login?from=...`

## Layouts

- Landing: `src/app/(landing-page)/layout.tsx` wraps header, footer, WhatsApp button
- Dashboard: `src/app/(internal)/dashboard/layout.tsx` fetches sidebar items and renders `ClientDashboardLayout`

See also: [auth.md](./auth.md).
