#!/bin/sh
# Script para configurar nginx y API en tiempo de ejecución
# Permite cambiar BACKEND_URL sin rebuildar la imagen

set -e

# Usar variable de entorno o valor por defecto
export BACKEND_URL="${BACKEND_URL:-http://backend:8080}"

echo "=== HomeFootball Frontend Starting ==="
echo "BACKEND_URL configurado: ${BACKEND_URL}"

# Procesar el template de nginx (reemplazar ${BACKEND_URL})
# Solo reemplazamos BACKEND_URL para no interferir con variables de nginx como $host, $uri, etc.
envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "=== Configuración de nginx generada ==="
echo "Proxy /api/ -> ${BACKEND_URL}/api/"

# Verificar configuración de nginx
if nginx -t; then
    echo "=== Configuración de nginx válida ==="
else
    echo "=== ERROR: Configuración de nginx inválida ==="
    cat /etc/nginx/conf.d/default.conf
    exit 1
fi

echo "=== Iniciando nginx ==="

# Iniciar nginx
exec nginx -g 'daemon off;'
