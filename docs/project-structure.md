# Project Structure (guided tour)

Key areas you will work with most often:

- `src/app/(landing-page)/`
  - `layout.tsx`: header/footer shell; renders marketing pages
  - Pages: `archery/`, `karate/`, `kendo/`, `team-developers/`, etc.
- `src/app/(internal)/dashboard/`
  - `layout.tsx`: fetches sidebar items and renders `ClientDashboardLayout`
  - Feature pages: `attendance/`, `disciplines/`, `instructors/`, `matriculations/`, `payments/`, `profile/`, `rankings/`, `reports/`, `roles/`, `sessions/`, `students/`, `training-schedules/`, `users/`
  - Special: `acesso-negado/` (access denied page)
- `src/app/actions/`
  - `auth.ts`: `loginAction`, `logoutAction`, `handleUnauthorized`, `handleNotAccessPage`
  - `me.ts`: `meAction` fetches the current user
- `src/lib/api/`
  - `api.ts`: fetch wrapper (base URL, cookies, timeouts, errors)
  - `services/*`: domain services (e.g., `auth-service.ts`)
  - `queries/*`: React Query hooks (e.g., `use-auth.ts`)
- `src/providers/QueryProvider.tsx`: React Query client with sensible defaults
- `src/utils/`
  - `cookie-utils.ts`: forwards request cookies to backend
  - `access-control.ts`: role/profile privilege checks
- `src/components/`
  - `ui/*`: shadcn-style primitives (e.g., `button.tsx`)
  - `dashboard/*`: complex feature UIs
  - `landing-page/*`: home/marketing components
- `src/types/*`: shared TypeScript models (user, privileges, sessions, etc.)
- `src/middleware.ts`: gatekeeping for `/dashboard` and auth pages

Infrastructure:

- `next.config.ts`: server actions, image domains, performance flags
- `Dockerfile`, `docker-compose.yaml`, `deploy.sh`: production build and run
- `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`: tooling

For deeper explanations, see the topic docs in this folder.
