# Scripts and Commands

From `package.json`:

- `pnpm dev`: start dev server (Turbopack)
- `pnpm build`: production build
- `pnpm start`: start production server
- `pnpm lint`: run ESLint
- `pnpm format`: run Prettier write
- `pnpm format:check`: run Prettier check

Useful Docker commands:

```bash
docker compose up -d --build
docker compose logs -f app
docker compose down --remove-orphans
```

See also: [deployment.md](./deployment.md).
