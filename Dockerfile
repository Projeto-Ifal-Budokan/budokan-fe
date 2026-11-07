# Base image with latest Node.js (alpine = smaller image)
FROM node:23-alpine AS base

# Dependency installation stage
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install dependencies using available lockfile
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "No lockfile found." && exit 1; \
  fi

# Application build stage
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# NEXT_PUBLIC_* congela no build: trocar o client ID exige rebuild, nao so restart.
# Ausente = o formulario mostra o login como indisponivel e a server action recusa.
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
# O pre-render da home precisa dos depoimentos, mas o alias interno budokan-cms so existe em
# runtime: durante o docker build nao ha rede para o outro container, a busca falha, o fallback
# devolve lista vazia e "ainda nao ha depoimentos publicados" congela no HTML estatico. A
# janela durava ate o ISR regenerar — 2 a 5 minutos a cada deploy do frontend. Na build a fala
# sai pelo dominio publico; em runtime o compose continua usando o alias interno.
# Se o dominio estiver fora na hora do build, o resultado e o mesmo de hoje: pagina sem
# depoimentos ate a primeira revalidacao. Nada aqui faz o build falhar por isso.
ARG STRAPI_BUILD_URL=https://strapi.budokanryu.com.br/api
ENV STRAPI_URL=$STRAPI_BUILD_URL
ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "No lockfile found." && exit 1; \
  fi

# Final runtime stage
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy necessary build output
# O --chown nao e decoracao: o checkout na maquina tem tudo em 0700 nas maos de
# budokan-agent (uid 1002), COPY preserva dono e modo, e aqui embaixo roda USER nextjs
# (uid 1001). Sem o chown, /app/public fica ilegivel para o usuario da app e todo arquivo
# servido de public/ quebra -- logo no header e no hero, robots.txt, logos do rodape.
# Os dois COPY de baixo ja faziam isso; public/ era o unico que nao.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure cache folder exists and is writable by the app user
RUN mkdir -p /app/.next/cache \
  && chown -R nextjs:nodejs /app/.next

# Drop privileges to the non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]