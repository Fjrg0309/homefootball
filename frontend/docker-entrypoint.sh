#!/bin/sh
# Script para configurar nginx y API en tiempo de ejecución
# Permite cambiar BACKEND_URL sin rebuildar la imagen

set -e

# Usar variable de entorno o valor por defecto
export BACKEND_URL="${BACKEND_URL:-http://backend:8080}"

echo "=== Configurando nginx con BACKEND_URL: ${BACKEND_URL} ==="

# Procesar el template de nginx (reemplazar ${BACKEND_URL})
envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "=== Contenido del archivo nginx generado ==="
cat /etc/nginx/conf.d/default.conf | grep -A 5 "location /api/"

# Verificar configuración de nginx
nginx -t

echo "=== Configuración de nginx completada ==="

# Iniciar nginx
exec nginx -g 'daemon off;'
