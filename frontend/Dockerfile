# Dockerfile multi-stage para Angular App
# Etapa 1: Build de la aplicación
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

# Copiar código fuente
COPY . .

# Build de la aplicación en modo producción
RUN npm run build -- --configuration production

# Etapa 2: Servidor de producción con Nginx
FROM nginx:alpine

# Copiar archivos build al servidor Nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuración de Nginx como template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copiar y configurar script de arranque
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Variable de entorno para el backend
# En DigitalOcean App Platform, configura esta variable con la URL del backend
# Ejemplo: https://backend-xxxxx.ondigitalocean.app
ENV BACKEND_URL=http://backend:8080

# Exponer puerto 80
EXPOSE 80

# Usar script de arranque que procesa el template de nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
