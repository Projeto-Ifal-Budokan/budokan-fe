# Etapa 1: build
FROM node:22.14-alpine AS builder

RUN apk add --no-cache wget bash

# Instalar pnpm
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh - \
  && ln -s /root/.local/share/pnpm/pnpm /usr/local/bin/pnpm

WORKDIR /app

# Copiar e instalar dependências
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copiar o código
COPY . .

# Definir variáveis de ambiente para build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Fazer o build
RUN pnpm build

# Etapa 2: produção
FROM node:22.14-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar pnpm novamente
RUN apk add --no-cache wget bash \
  && wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh - \
  && ln -s /root/.local/share/pnpm/pnpm /usr/local/bin/pnpm

# Copiar apenas o necessário da etapa anterior
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expor a porta
EXPOSE 3000

# Rodar a aplicação
CMD ["pnpm", "start"]
