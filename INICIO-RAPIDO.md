# 🚀 GUÍA DE INICIO RÁPIDO - HomeFootball

## Iniciar Backend con DigitalOcean

El backend está configurado para usar la base de datos PostgreSQL de DigitalOcean.

### Opción 1: Ejecutar con script automatizado (Recomendado)

```bash
.\START-BACKEND-DIGITALOCEAN.bat
```

### Opción 2: Ejecutar manualmente

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Verificar que funciona

- Backend: http://localhost:8080/api/health
- Swagger: http://localhost:8080/swagger-ui.html

## Iniciar Frontend

```bash
cd frontend
npm install
npm start
```

Frontend disponible en: http://localhost:4200

## Iniciar Todo con Docker

```bash
docker compose up -d --build
```

- Frontend: http://localhost:80
- Backend: http://localhost:8080

## Configuración de Base de Datos

La configuración está en:
- `backend/src/main/resources/application-local.properties` (desarrollo local)
- `docker-compose.yml` (producción con Docker)

Base de datos DigitalOcean:
- Host: db-postgresql-lon1-93988-do-user-30736003-0.k.db.ondigitalocean.com:25060
- Database: homefootballdb
- SSL: Required

## Solución de Problemas

### Backend no arranca

1. Verificar Java 17: `java -version`
2. Verificar Maven: `mvn -version`
3. Compilar: `mvn clean compile`

### Frontend no compila

1. Limpiar node_modules: `rm -rf node_modules`
2. Reinstalar: `npm install`
3. Compilar: `npm run build`

### Docker falla

1. Limpiar: `docker compose down -v`
2. Reconstruir: `docker compose build --no-cache`
3. Iniciar: `docker compose up -d`
