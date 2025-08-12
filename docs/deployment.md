# Deployment (Docker & Compose)

## Dockerfile

- Multi-stage build (`deps` → `builder` → `runner`)
- Build args/env: `NEXT_PUBLIC_API_URL`, `NODE_ENV=production`
- Next standalone output copied to runtime image
- Runs as non-root user `nextjs` on port 3000

## docker-compose.yaml

- Builds image with `NEXT_PUBLIC_API_URL`
- Sets environment variables and exposes `3000:3000`
- Healthcheck: simple HTTP probe on `/`
- Joins external network `swag_default`

## deploy.sh (server-side helper)

- Requires `NEXT_PUBLIC_API_URL` to be set (`: "${NEXT_PUBLIC_API_URL:?...}"`)
- Resets local changes, pulls `main`, exports env for Compose
- Removes old container/images, recreates via `docker compose up -d --build --force-recreate`
- Prints health logs for `frontend-budokanryu`

## Running locally with Docker

```bash
export NEXT_PUBLIC_API_URL="https://api.example.com"
docker compose up -d --build
# open http://localhost:3000
```

See also: [environment.md](./environment.md).
