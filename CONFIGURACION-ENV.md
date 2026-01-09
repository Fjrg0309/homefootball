# 🔐 Configuración de Variables de Entorno

## Configuración Inicial

### 1. Crear archivo .env

Copia el archivo `.env.example` a `.env` en `backend/src/main/resources/`:

```bash
cd backend/src/main/resources
cp .env.example .env
```

### 2. Configurar credenciales

Edita el archivo `.env` y configura tus credenciales:

```properties
# PostgreSQL Database
DB_URL=jdbc:postgresql://tu-host:puerto/tu-database?sslmode=require
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

# API Football
API_FOOTBALL_KEY=tu_api_key_de_api_football
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io

# Server
SERVER_PORT=8080
```

### 3. Obtener API Key de API-Football

1. Ve a https://www.api-football.com/
2. Regístrate (es gratis)
3. Ve a tu dashboard: https://dashboard.api-football.com/
4. Copia tu API Key
5. Pégala en `.env` en la variable `API_FOOTBALL_KEY`

**Plan Free:** 100 peticiones por día

### 4. Configurar PostgreSQL

Tienes dos opciones:

#### Opción A: Usar base de datos local

```properties
DB_URL=jdbc:postgresql://localhost:5432/homefootball
DB_USERNAME=postgres
DB_PASSWORD=tu_password_local
```

#### Opción B: Usar DigitalOcean (producción)

1. Ve a tu cluster de PostgreSQL en DigitalOcean
2. Copia la cadena de conexión
3. Configura:

```properties
DB_URL=jdbc:postgresql://tu-cluster.db.ondigitalocean.com:25060/homefootballdb?sslmode=require
DB_USERNAME=doadmin
DB_PASSWORD=tu_password_de_digitalocean
```

## Iniciar el Backend

### Opción 1: PowerShell (Recomendado)

```powershell
cd backend
.\start-backend.ps1
```

Este script:
- ✅ Carga automáticamente las variables desde `.env`
- ✅ Verifica Java
- ✅ Compila el proyecto
- ✅ Inicia el servidor

### Opción 2: Batch File

```cmd
cd backend
start-backend.bat
```

### Opción 3: Maven directo

```bash
cd backend
mvn spring-boot:run
```

**Nota:** Con Maven directo, debes configurar las variables de entorno manualmente antes de ejecutar.

## Verificar que funciona

Una vez iniciado el backend, prueba estos endpoints:

1. **Health Check:**
   ```
   http://localhost:8080/health
   ```
   Debería devolver: `{"status":"UP"}`

2. **API Football Status:**
   ```
   http://localhost:8080/api/football/status
   ```
   Debería devolver: `{"configured":true,...}`

3. **Partidos de La Liga:**
   ```
   http://localhost:8080/api/football/fixtures/latest-round?league=140&season=2024
   ```
   Debería devolver JSON con partidos

## Scripts de Prueba

Ejecuta los scripts de prueba para verificar la configuración:

```powershell
# Prueba completa del backend
.\test-backend.ps1

# Prueba específica de la jornada 38
.\test-jornada38.ps1

# Debug de formatos de jornadas
.\debug-rounds.ps1
```

## Troubleshooting

### Error: "API Key no configurada"

- Verifica que el archivo `.env` existe en `backend/src/main/resources/`
- Verifica que `API_FOOTBALL_KEY` tiene un valor
- Reinicia el backend después de editar `.env`

### Error: "Cannot connect to database"

- Verifica que PostgreSQL está corriendo (si es local)
- Verifica las credenciales en `.env`
- Verifica que el puerto es correcto (25060 para DigitalOcean, 5432 para local)
- Verifica la conexión de red si usas DigitalOcean

### Error: "Port 8080 already in use"

Detén el proceso que usa el puerto:

```powershell
$port = 8080
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
if ($processId) { Stop-Process -Id $processId -Force }
```

## Seguridad

⚠️ **IMPORTANTE:**

- ❌ **NUNCA** subas el archivo `.env` a Git
- ❌ **NUNCA** compartas tus API keys públicamente
- ✅ El archivo `.env` está en `.gitignore`
- ✅ Sube `.env.example` con valores de ejemplo
- ✅ Usa variables de entorno en todos los archivos de configuración

## Variables de Entorno en Producción

En producción (DigitalOcean, Heroku, etc.), configura las variables de entorno directamente en la plataforma:

```bash
# Ejemplo para DigitalOcean App Platform
doctl apps update <app-id> --spec .do/app.yaml
```

Las variables de entorno en producción sobrescriben los valores de `.env`.
