# Data Fetching (React Query)

Provider: `src/providers/QueryProvider.tsx`

- Creates a `QueryClient` with defaults:
  - `staleTime`: 60_000 ms (1 minute)
  - `refetchOnWindowFocus`: false
- Includes `ReactQueryDevtools` (closed by default)

Conventions:

- Keep stable `queryKey`s like `['auth','me']`, `['sessions', page]`
- Mutations should trigger optimistic UI or show toasts on success/failure
- Prefer server actions for auth redirects and cookie changes

Example:

```ts
const { data: user } = useQuery({
  queryKey: ['auth', 'me'],
  queryFn: () => authService.me().then((r) => r.data),
});
```

See also: [api-client.md](./api-client.md) and feature hooks under `src/lib/api/queries/*`.
