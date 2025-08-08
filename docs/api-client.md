# API Client and Services

Location: `src/lib/api/api.ts`

## Base configuration

- Base URL: `NEXT_PUBLIC_API_URL` (required in all environments)
- Cookie forwarding: builds a `Cookie` header from the incoming request via `getAuthHeaders()` so backend receives auth cookies server-side
- Credentials: `include` (sends cookies with cross-origin requests if allowed)
- Timeout: default 10s; aborts with 408 if exceeded

## Error handling

- Parses JSON or text for all statuses
- On non-2xx:
  - Extracts message and shows a toast via `sonner`
  - 401 → calls `handleUnauthorized()` (server action) and throws
  - 403 → calls `handleNotAccessPage()` and throws
  - 404/5xx → throws `ApiError`
- `throwOnHttpError` option (default true): when false, returns `{ ok: false, status, data }` instead of throwing

## Helpers

- `api.get|post|put|patch|delete<T>(endpoint, options)`
- `ApiResponse<T> = { data, response, status, ok }`
- `ApiPaginatedResponse<T> = { items, count, page, page_size }`

## Writing a service

Example: `src/lib/api/services/auth-service.ts`

```ts
import { api, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import { CreateUserData, User } from '@/types/user';

export const authService = {
  me: async (): Promise<ApiResponse<User>> => api.get<User>('/auth/me'),
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<Response>> =>
    api.post<Response>('/auth/login', credentials),
  register: async (userData: CreateUserData): Promise<ApiResponse<Response>> =>
    api.post<Response>('/auth/register', userData),
};
```

## Writing a query hook

Example: `src/lib/api/queries/use-auth.ts`

```ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth-service';

export function useAuth() {
  const me = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => (await authService.me()).data,
  });
  const login = useMutation({ mutationFn: authService.login });
  return { me, login };
}
```

See also: [data-fetching.md](./data-fetching.md) and [auth.md](./auth.md).
