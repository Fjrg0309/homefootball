# Configuración de Variables de Entorno

Este proyecto utiliza variables de entorno para mantener las credenciales seguras y fuera del control de versiones.

## Configuración Local (Desarrollo)

### Opción 1: Archivo application-local.properties (Recomendado)

1. Copia el archivo ejemplo:
   ```bash
   cd backend/src/main/resources
   cp application-local.properties.example application-local.properties
   ```

2. Edita `application-local.properties` y agrega tus credenciales:
   ```properties
   # PostgreSQL - DigitalOcean
   spring.datasource.url=jdbc:postgresql://TU_HOST:25060/homefootballdb?sslmode=require
   spring.datasource.username=TU_USUARIO
   spring.datasource.password=TU_PASSWORD
   
   # API Football
   api.football.key=TU_API_KEY
   ```

3. Este archivo **NO se subirá a Git** (está en .gitignore)

4. Ejecuta el backend:
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```

### Opción 2: Variables de Entorno

Configura las siguientes variables de entorno:

```bash
# Windows PowerShell
$env:DB_URL="jdbc:postgresql://TU_HOST:25060/homefootballdb?sslmode=require"
$env:DB_USERNAME="TU_USUARIO"
$env:DB_PASSWORD="TU_PASSWORD"
$env:API_FOOTBALL_KEY="TU_API_KEY"

# Linux/Mac
export DB_URL="jdbc:postgresql://TU_HOST:25060/homefootballdb?sslmode=require"
export DB_USERNAME="TU_USUARIO"
export DB_PASSWORD="TU_PASSWORD"
export API_FOOTBALL_KEY="TU_API_KEY"
```

Luego ejecuta:
```bash
cd backend
mvn spring-boot:run
```

## Credenciales Necesarias

### 1. Base de Datos PostgreSQL (DigitalOcean)
- **URL**: Tu cluster de PostgreSQL en DigitalOcean
- **Usuario**: Usuario de la base de datos
- **Password**: Contraseña de la base de datos

### 2. API Football
- **API Key**: Obtén tu key en https://www.api-football.com/
- Plan gratuito: 100 peticiones/día

## Producción

Para producción, usa variables de entorno en tu plataforma de deployment:
- DigitalOcean App Platform: Configurar en "Environment Variables"
- Heroku: `heroku config:set VAR=value`
- Docker: Pasar variables con `-e` o usar `.env` file

## ⚠️ IMPORTANTE

**NUNCA** subas archivos con credenciales reales a Git:
- ✅ `application.properties` (con valores por defecto o ${VAR})
- ✅ `application-local.properties.example` (con placeholders)
- ❌ `application-local.properties` (con credenciales reales)
- ❌ `application-prod.properties` (con credenciales reales)
