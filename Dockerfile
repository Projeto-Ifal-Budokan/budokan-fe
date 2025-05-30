FROM node:22.14-alpine

COPY . /opt/budokan-fe

WORKDIR /opt/budokan-fe

RUN apk add --no-cache wget bash

ENV SHELL=/bin/sh

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
ENV PATH="/root/.local/share/pnpm:$PATH"
#RUN pnpm install
RUN pnpm install \
    && pnpm build

# Cria diretório de trabalho
WORKDIR /opt/budokan-fe

# Expõe a porta padrão da aplicação (altere se necessário)
EXPOSE 3000

# Comando para iniciar o app
#ENTRYPOINT ["pnpm", "dev"]
ENTRYPOINT ["pnpm", "build"]