# Guía de Despliegue en DigitalOcean App Platform

## Arquitectura

```
┌─────────────────────┐     ┌─────────────────────┐
│      Frontend       │────►│       Backend       │
│   (Angular/Nginx)   │     │   (Spring Boot)     │
│  Puerto: 8080/80    │     │    Puerto: 8080     │
└─────────────────────┘     └─────────────────────┘
         │                           │
         │  Proxy /api ──────────────┘
         │
    Usuario (Browser)
```

## Pasos de Despliegue

### 1. Backend (Spring Boot)

1. **Crear App en DigitalOcean** → Components → Add Component → From Source Code
2. **Configuración:**
   - Source: GitHub/GitLab → Tu repositorio
   - Branch: `main`
   - Source Directory: `/backend`
   - Type: `Web Service`
   - Resource Size: `Basic ($5/mo)` o superior

3. **Variables de Entorno (IMPORTANTES):**
   ```
   DB_URL=jdbc:postgresql://tu-db-host:25060/homefootballdb?sslmode=require
   DB_USERNAME=doadmin
   DB_PASSWORD=tu-password-de-base-de-datos
   API_FOOTBALL_KEY=tu-api-key
   API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
   SPRING_PROFILES_ACTIVE=prod
   ```

   ⚠️ **CRÍTICO**: Estas variables DEBEN estar configuradas en Digital Ocean App Platform:
   - Ve a tu app → Settings → App-Level Environment Variables
   - Añade cada una de estas variables con sus valores reales

4. **Obtener la URL del Backend** después del deploy:
   - Ejemplo: `https://backend-xxxxx.ondigitalocean.app`

### 2. Frontend (Angular + Nginx)

1. **Crear Component** → Add Component → From Source Code
2. **Configuración:**
   - Source: GitHub/GitLab → Tu repositorio
   - Branch: `main`
   - Source Directory: `/frontend`
   - Type: `Web Service`
   - Resource Size: `Basic ($5/mo)` o superior

3. **Variable de Entorno (CRÍTICA):**
   ```
   BACKEND_URL=https://homefootball-backend-xxxxx.ondigitalocean.app
   ```
   ⚠️ **IMPORTANTE**: 
   - Reemplaza con la URL real del backend obtenida en el paso anterior
   - NO incluir `/api/` al final, solo la URL base del backend
   - El formato debe ser: `https://nombre-backend.ondigitalocean.app` (sin trailing slash)

4. **Puertos y HTTP Routes:**
   - HTTP Port: `80`
   - HTTP Routes: `/` (debe servir desde la raíz)

### 3. Verificación

1. Accede al frontend: `https://homefootballapp-xxxxx.ondigitalocean.app`
2. Abre DevTools (F12) → Network
3. Navega a una liga y sus partidos
4. Verifica que las peticiones a `/api/football/...` sean redirigidas correctamente

## Troubleshooting

### ⚠️ Error: "host not found in upstream backend"

**Error completo**:
```
nginx: [emerg] host not found in upstream "backend" in /etc/nginx/conf.d/default.conf:21
ERROR failed health checks after 2 attempts with error Readiness probe failed
```

**Causa**: El frontend está intentando conectarse a `http://backend:8080` pero este servicio no existe en Digital Ocean (solo funciona con docker-compose localmente).

**Solución**:
1. **CONFIGURAR la variable de entorno `BACKEND_URL` en el frontend**:
   - Ve a Digital Ocean → Tu App → Settings → Components → Frontend
   - Environment Variables → Add Variable
   - Key: `BACKEND_URL`
   - Value: La URL completa de tu backend, ejemplo: `https://homefootball-backend-abcd1234.ondigitalocean.app`
   - **NO incluir `/api/` al final**

2. **Redeploy el frontend** después de agregar la variable de entorno

3. **Verifica los logs** del frontend para confirmar que se está usando la URL correcta:
   ```
   === Configurando nginx con BACKEND_URL: https://homefootball-backend-xxxxx.ondigitalocean.app ===
   ```

### Error: "Sin conexión. Verifica tu red"

**Causa**: El frontend no puede comunicarse con el backend.

**Solución**:
1. Verifica que `BACKEND_URL` esté configurado en el frontend
2. Verifica que el backend esté corriendo (revisa los logs)
3. Verifica CORS en el backend

### Error: "Error al cargar los partidos"

**Causas posibles**:
1. API Key de API-Football no configurada
2. Rate limit de API-Football alcanzado (100 req/día free plan)
3. Backend no puede conectar con API-Football

**Solución**:
1. Revisa logs del backend
2. Verifica que `API_FOOTBALL_KEY` esté configurada
3. Prueba el endpoint directamente: `https://tu-backend.ondigitalocean.app/api/football/status`

### Verificar configuración de nginx

Conéctate al contenedor del frontend y verifica:
```bash
cat /etc/nginx/conf.d/default.conf
```

Debe contener:
```nginx
location /api/ {
    proxy_pass https://backend-xxxxx.ondigitalocean.app/api/;
    ...
}
```

## Configuración Local vs Producción

| Configuración | Local | Producción |
|--------------|-------|------------|
| Frontend URL | `http://localhost:4200` | `https://xxx.ondigitalocean.app` |
| Backend URL | `http://localhost:8080` | `https://xxx.ondigitalocean.app` |
| API URL (frontend) | `http://localhost:8080/api` | `/api` (proxy nginx) |
| CORS | `localhost:*` | `*.ondigitalocean.app` |

## Archivos Modificados

- `frontend/nginx.conf` - Añadido proxy para `/api`
- `frontend/Dockerfile` - Añadido script de arranque
- `frontend/docker-entrypoint.sh` - Procesa templates de nginx
- `backend/SecurityConfig.java` - CORS actualizado
- `frontend/environment.prod.ts` - USA `/api` (proxy relativo)
