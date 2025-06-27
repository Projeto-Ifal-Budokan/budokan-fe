#!/bin/bash

echo "=== DEPLOY STARTED at $(date) ==="

# Reset do código para evitar conflitos locais
echo "🔄 Resetando alterações locais..."
git reset --hard

# Atualiza o código da branch main
echo "📥 Fazendo git pull da branch main..."
if git pull origin main; then
  echo "✅ Código atualizado com sucesso!"
else
  echo "❌ Falha ao fazer git pull!"
  exit 1
fi

# Gera o arquivo .env com variáveis de ambiente recebidas do GitHub Actions
echo "📝 Gerando .env com variáveis..."
cat <<EOF > .env
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
EOF

# Remove container antigo se existir (evita conflitos)
CONTAINER_NAME="frontend-budokanryu"
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
  echo "🗑️ Removendo container antigo: $CONTAINER_NAME"
  docker rm -f $CONTAINER_NAME || echo "⚠️ Falha ao remover container existente"
fi

# Remove rede antiga com erro, se existir
NETWORK_NAME="budokan-fe_default"
if docker network inspect $NETWORK_NAME >/dev/null 2>&1; then
  echo "🔌 Removendo rede antiga: $NETWORK_NAME"
  docker network rm $NETWORK_NAME || echo "⚠️ Falha ao remover rede existente"
fi

# (Re)constrói e sobe os containers
echo "🐳 Reconstruindo e reiniciando containers..."
if docker compose down --remove-orphans && docker compose up -d --build; then
  echo "✅ Deploy concluído com sucesso!"
else
  echo "❌ Falha ao reiniciar os containers."
  exit 1
fi

echo "=== DEPLOY FINISHED at $(date) ==="
