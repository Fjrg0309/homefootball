# 🐳 Docker Setup - HomeFootball Frontend

Este proyecto incluye configuración completa de Docker para desarrollo y producción.

## 📋 Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado

## 🚀 Modo Desarrollo (con hot reload)

Inicia el servidor de desarrollo con recarga automática:

```bash
docker-compose up dev
```

La aplicación estará disponible en: **http://localhost:4200**

### Características del modo desarrollo:
- ✅ Hot reload automático
- ✅ Volúmenes montados para cambios en tiempo real
- ✅ Angular DevServer
- ✅ Logs en consola
- ✅ Port: 4200

### Detener el servicio:
```bash
docker-compose down
```

## 🏭 Modo Producción (Nginx optimizado)

Build y ejecuta la versión optimizada de producción:

```bash
docker-compose up prod
```

La aplicación estará disponible en: **http://localhost**

### Características del modo producción:
- ✅ Build optimizado y minificado
- ✅ Servidor Nginx ultra-rápido
- ✅ Gzip compression activada
- ✅ Cache de assets estáticos
- ✅ Health check endpoint (`/health`)
- ✅ Reinicio automático
- ✅ Port: 80

### Detener el servicio:
```bash
docker-compose down
```

## 🛠️ Comandos Útiles

### Rebuild completo (desarrollo):
```bash
docker-compose build dev
docker-compose up dev
```

### Rebuild completo (producción):
```bash
docker-compose build --no-cache prod
docker-compose up prod
```

### Ver logs en tiempo real:
```bash
docker-compose logs -f dev
# o
docker-compose logs -f prod
```

### Ejecutar comandos dentro del contenedor:
```bash
# Desarrollo
docker-compose exec dev sh
docker-compose exec dev npm run test

# Producción
docker-compose exec prod sh
```

### Limpiar todo (contenedores, volúmenes, imágenes):
```bash
docker-compose down -v
docker system prune -a
```

## 📁 Estructura de Archivos Docker

```
frontend/
├── Dockerfile              # Build multi-stage para producción
├── Dockerfile.dev          # Imagen para desarrollo
├── docker-compose.yml      # Orquestación de servicios
├── nginx.conf              # Configuración de Nginx
└── .dockerignore           # Archivos excluidos del build
```

## 🔧 Configuración

### Cambiar puertos:

Edita `docker-compose.yml`:

```yaml
services:
  dev:
    ports:
      - "4201:4200"  # Cambiar el primer número

  prod:
    ports:
      - "8080:80"    # Cambiar el primer número
```

### Variables de entorno:

Crea un archivo `.env` en la raíz:

```env
NODE_ENV=production
API_URL=https://api.example.com
```

## 🏥 Health Check

El servicio de producción incluye un endpoint de salud:

```bash
curl http://localhost/health
# Respuesta: healthy
```

Docker lo usa automáticamente para monitorear el estado del contenedor.

## 🐛 Troubleshooting

### Error: Puerto ya en uso
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :4200
# Matar el proceso o cambiar el puerto en docker-compose.yml
```

### Error: Permisos en Windows
```bash
# Ejecutar PowerShell como Administrador
```

### Rebuild forzado
```bash
docker-compose build --no-cache
docker-compose up --force-recreate
```

### Ver recursos de Docker
```bash
docker stats
docker system df
```

## 📊 Comparación Desarrollo vs Producción

| Característica | Desarrollo | Producción |
|---------------|-----------|------------|
| **Tamaño imagen** | ~1.2 GB | ~50 MB |
| **Tiempo de build** | 2-3 min | 4-5 min |
| **Hot reload** | ✅ Sí | ❌ No |
| **Optimización** | ❌ No | ✅ Sí |
| **Servidor** | Angular DevServer | Nginx |
| **Port** | 4200 | 80 |
| **Restart policy** | ❌ No | ✅ unless-stopped |

## 🚢 Deploy a Producción

### Build de la imagen:
```bash
docker build -t homefootball-frontend:latest .
```

### Subir a Docker Hub:
```bash
docker tag homefootball-frontend:latest yourusername/homefootball:v1.0.0
docker push yourusername/homefootball:v1.0.0
```

### Ejecutar en servidor:
```bash
docker pull yourusername/homefootball:v1.0.0
docker run -d -p 80:80 --name homefootball yourusername/homefootball:v1.0.0
```

## 📝 Notas

- El modo desarrollo usa volúmenes para hot reload
- El modo producción usa build multi-stage para optimizar el tamaño
- Nginx está configurado con las mejores prácticas de seguridad
- El health check asegura alta disponibilidad

## 🆘 Soporte

Si encuentras problemas:
1. Verifica que Docker Desktop esté corriendo
2. Revisa los logs: `docker-compose logs`
3. Limpia cache: `docker system prune -a`
4. Rebuild: `docker-compose build --no-cache`

---

**¡Listo para dockerizar tu aplicación Angular! 🐋**
