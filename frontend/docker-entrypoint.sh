#!/bin/sh
# Script para configurar nginx y API en tiempo de ejecución
# Permite cambiar BACKEND_URL sin rebuildar la imagen

set -e

# Usar variable de entorno o valor por defecto
BACKEND="${BACKEND_URL:-http://backend:8080}"

echo "=== Configurando nginx con BACKEND_URL: ${BACKEND} ==="

# Procesar el template de nginx manualmente (reemplazar ${BACKEND_URL})
envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Verificar configuración de nginx
nginx -t

echo "=== Configuración de nginx completada ==="

# Iniciar nginx
exec nginx -g 'daemon off;'
