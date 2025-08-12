# Environment and Configuration

## Environment variables

- `NEXT_PUBLIC_API_URL` (required): base URL of the backend API consumed by the frontend
- `NODE_ENV`: standard Node environment

## Next.js configuration

File: `next.config.ts`

- `output: 'standalone'` for Docker-friendly builds
- `experimental.serverActions.allowedOrigins`: allow server actions from
  - `localhost:3000`
  - `budokanryu.com.br` (with and without scheme/port)
- `images.remotePatterns`: allow images from `budokanryu.com.br`, Vercel Blob storage, and GitHub avatars
- `poweredByHeader: false`, `compress: true`

## Cookies and headers

- Server-side API calls include the request cookies via `src/utils/cookie-utils.ts`
- Cookie name used for auth: `access_token`

See also: [deployment.md](./deployment.md).
