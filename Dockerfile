FROM node:22.14-alpine

# Instalar dependências do sistema primeiro
RUN apk add --no-cache wget bash

# Instalar pnpm globalmente
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
ENV PATH="/root/.local/share/pnpm:$PATH"

# Definir diretório de trabalho
WORKDIR /opt/budokan-fe

# Copiar arquivos de dependências primeiro (para cache layers)
COPY package.json pnpm-lock.yaml* ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar todo o código fonte
COPY . .

# Definir ARGs que serão passados durante o build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Outras variáveis de ambiente para o build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Fazer o build da aplicação (agora com as variáveis disponíveis)
RUN pnpm build

# Expor a porta
EXPOSE 3000

# Comando de inicialização
ENTRYPOINT ["pnpm", "start"]