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

# Copiar configuracion de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Arrancar nginx
CMD ["nginx", "-g", "daemon off;"]
