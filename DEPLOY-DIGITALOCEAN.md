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
   API_FOOTBALL_KEY=tu-api-key
   SPRING_PROFILES_ACTIVE=prod
   ```

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
   BACKEND_URL=https://backend-xxxxx.ondigitalocean.app
   ```
   ⚠️ **IMPORTANTE**: Reemplaza con la URL real del backend obtenida en el paso anterior.

### 3. Verificación

1. Accede al frontend: `https://homefootballapp-xxxxx.ondigitalocean.app`
2. Abre DevTools (F12) → Network
3. Navega a una liga y sus partidos
4. Verifica que las peticiones a `/api/football/...` sean redirigidas correctamente

## Troubleshooting

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
