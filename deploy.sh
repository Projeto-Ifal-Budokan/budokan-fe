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

# ⚠️ IMPORTANTE: Exportar a variável para que o docker-compose possa acessá-la
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}"

echo "🔍 Verificando variável de ambiente..."
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"

CONTAINER_NAME="frontend-budokanryu"
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
  echo "🗑️ Removendo container antigo: $CONTAINER_NAME"
  docker rm -f $CONTAINER_NAME || {
    echo "⚠️ Falha ao remover container existente!"
  }
fi

# Remover imagens antigas para forçar rebuild
echo "🧹 Limpando imagens antigas..."
docker image prune -f
docker builder prune -f

echo "🐳 Reconstruindo e reiniciando containers..."
if docker compose down --remove-orphans && docker compose up -d --build --force-recreate; then
  echo "✅ Deploy concluído com sucesso!"
  
  # Verificar se o container está rodando
  echo "🔍 Verificando status do container..."
  docker ps | grep $CONTAINER_NAME
  
  # Mostrar logs para debug
  echo "📋 Últimas linhas do log:"
  docker logs $CONTAINER_NAME --tail 20
else
  echo "❌ Falha ao reiniciar os containers."
  echo "📋 Logs do container para debug:"
  docker logs $CONTAINER_NAME --tail 50 2>/dev/null || echo "Container não encontrado"
  exit 1
fi

echo "=== DEPLOY FINISHED at $(date) ==="