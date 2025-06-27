#!/bin/bash

echo "=== DEPLOY STARTED at $(date) ==="

# 🔒 Verifica se as variáveis obrigatórias estão definidas
: "${NEXT_PUBLIC_API_URL:?❌ ERRO: Variável NEXT_PUBLIC_API_URL não definida.}"


echo "🔄 Resetando alterações locais..."
git reset --hard

echo "📥 Fazendo git pull da branch main..."
if git pull origin main; then
  echo "✅ Código atualizado com sucesso!"
else
  echo "❌ Falha ao fazer git pull!"
  exit 1
fi

echo "📝 Gerando .env..."
cat <<EOF > .env
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
EOF

CONTAINER_NAME="frontend-***ryu"
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
  echo "🗑️ Removendo container antigo: $CONTAINER_NAME"
  docker rm -f $CONTAINER_NAME || {
    echo "⚠️ Falha ao remover container existente!"
  }
fi

NETWORK_NAME="***-fe_default"
if docker network inspect $NETWORK_NAME >/dev/null 2>&1; then
  echo "🔌 Removendo rede antiga: $NETWORK_NAME"
  docker network rm $NETWORK_NAME || {
    echo "⚠️ Falha ao remover rede existente!"
  }
fi

echo "🐳 Reconstruindo e reiniciando containers..."
if docker compose down --remove-orphans && docker compose up -d --build; then
  echo "✅ Deploy concluído com sucesso!"
else
  echo "❌ Falha ao reiniciar os containers."
  exit 1
fi

echo "=== DEPLOY FINISHED at $(date) ==="
