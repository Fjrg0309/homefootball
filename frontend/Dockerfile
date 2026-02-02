# Dockerfile multi-stage para Angular App
# Etapa 1: Build de la aplicacion
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Configurar npm para aumentar timeouts
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias con reintentos
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps

# Copiar codigo fuente
COPY . .

# Build de la aplicacion en modo produccion
RUN npm run build -- --configuration production

# Etapa 2: Servidor de produccion con Nginx
FROM nginx:alpine

# Copiar archivos build al servidor Nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Crear directorio para templates de nginx
RUN mkdir -p /etc/nginx/templates

# Copiar configuracion de Nginx como template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copiar script de entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exponer puerto 80 (requerido por Digital Ocean App Platform)
EXPOSE 80

# Usar el entrypoint personalizado
ENTRYPOINT ["/docker-entrypoint.sh"]
