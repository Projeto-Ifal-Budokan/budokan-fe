#!/bin/bash
#
# Deploy do frontend Budokan nesta máquina.
#
# Não usa `docker` direto: o usuário de deploy não tem acesso ao socket. Tudo
# passa pelo gateway /usr/local/bin/budokan-docker, que só aceita objetos do
# Budokan. Consequências intencionais deste script em relação ao anterior:
#
#   * sem `docker rmi` e sem `docker system prune` — isso apagaria imagens de
#     outros projetos da máquina
#   * sem `compose down --volumes` — o frontend não tem volume, e a flag é
#     destrutiva por padrão nos outros stacks
#   * sem `docker volume ls -qf dangling=true` — listagem é global
#
set -euo pipefail

GW="sudo -n /usr/local/bin/budokan-docker"
CONTAINER_NAME="frontend-budokanryu"

echo "=== DEPLOY STARTED at $(date) ==="

: "${NEXT_PUBLIC_API_URL:?ERRO: NEXT_PUBLIC_API_URL não definida.}"
export NEXT_PUBLIC_API_URL

echo "🔄 Resetando alterações locais..."
git reset --hard

echo "📥 Fazendo git pull da branch main..."
if ! git pull origin main; then
	echo "❌ Falha ao fazer git pull!"
	exit 1
fi

echo "🔍 NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"

echo "🐳 Reconstruindo e reiniciando..."
if $GW compose fe up -d --build --force-recreate; then
	echo "✅ Deploy concluído."
	echo "🔍 Status:"
	$GW compose fe ps
	echo "📋 Log (últimas linhas):"
	$GW logs "$CONTAINER_NAME" || echo "Container ainda não encontrado"
else
	echo "❌ Falha ao subir. Tentando remover container órfão e repetir uma vez..."
	$GW rm "$CONTAINER_NAME" || true
	if $GW compose fe up -d --build --force-recreate; then
		echo "✅ Deploy concluído na segunda tentativa."
		$GW compose fe ps
	else
		echo "❌ Falha também na segunda tentativa."
		$GW logs "$CONTAINER_NAME" || true
		exit 1
	fi
fi

echo "=== DEPLOY FINISHED at $(date) ==="
