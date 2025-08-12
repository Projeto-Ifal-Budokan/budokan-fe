# Architecture Overview

- Framework: Next.js App Router (TypeScript)
- State/data: TanStack React Query (`@tanstack/react-query`)
- UI: Tailwind CSS, shadcn/ui, Radix primitives, Lucide icons
- API access: Custom fetch wrapper in `src/lib/api/api.ts`; feature services in `src/lib/api/services/*`

## High-level layout

- Public site: `src/app/(landing-page)/` with `layout.tsx` and marketing pages
- Authenticated app: `src/app/(internal)/dashboard/` with `layout.tsx` and feature pages
- Server actions: `src/app/actions/*.ts` for auth and user utilities
- Middleware: `src/middleware.ts` to guard routes based on `access_token` cookie

## Data layer

- API wrapper: `src/lib/api/api.ts` centralizes base URL, auth cookie forwarding, timeouts, error handling (toasts), and redirects for 401/403 via server actions
- Services: `src/lib/api/services/*.ts` provide typed functions by domain (e.g., `auth-service.ts`)
- Query hooks: `src/lib/api/queries/*.ts` expose React hooks with cache keys and success toasts
- Provider: `src/providers/QueryProvider.tsx` sets cache defaults and enables devtools

## Access control

- Client helpers: `src/lib/auth.ts` (`requirePrivilege`, `hasAnyPrivilege`, etc.)
- Server utilities: `src/utils/access-control.ts` resolves user and privileges, then checks against role profiles

## UI system

- Shared primitives: `src/components/ui/*` using class-variance-authority; e.g., `button.tsx`
- Feature UIs: `src/components/dashboard/*` and `src/components/landing-page/*`

## Configuration

- Next config: `next.config.ts` (server actions, image domains)
- Environment: `NEXT_PUBLIC_API_URL` for backend base URL
- Tooling: ESLint, Prettier, TailwindCSS 4

See also: [project-structure.md](./project-structure.md) for a guided tour.
