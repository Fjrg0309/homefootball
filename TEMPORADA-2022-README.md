# Configuración de Temporada 2022-2023

## ✅ Cambios Aplicados

### Frontend
- **league-matches.ts**: Todas las ligas configuradas con temporada **2022**
- **football-api.service.ts**: Todos los métodos usan `season = 2022` por defecto

### Backend
- **ApiFootballController.java**: Todos los endpoints usan `defaultValue = "2022"`

## 🚀 Cómo Iniciar

### Opción 1: Usar el script BAT (Recomendado)
1. Navega a: `backend/`
2. Ejecuta: `START-BACKEND-TEMPORADA-2022.bat`
3. El script compilará y ejecutará automáticamente el backend

### Opción 2: Línea de comandos
```bash
cd backend
mvn spring-boot:run -DskipTests
```

### Opción 3: Usar JAR precompilado
```bash
cd backend
mvn clean package -DskipTests
java -jar target/homefootball-0.0.1-SNAPSHOT.jar
```

## 🔍 Verificación

Una vez iniciado el backend:
1. Deberías ver en la consola: `Tomcat started on port 8080`
2. Abre el navegador en: http://localhost:4200
3. Navega a: **Fichajes** → **LaLiga**
4. Deberías ver los partidos de la **Jornada 38 de la temporada 2022-2023**

## 📝 Nota sobre Temporadas

La API de API-Football usa el año de inicio de la temporada:
- **2022** = Temporada 2022-2023 (Agosto 2022 - Mayo 2023)
- La jornada 38 de LaLiga 2022-2023 finalizó en Mayo 2023

## ⚠️ Solución de Problemas

### Si el backend no inicia:
1. Verifica que el puerto 8080 esté libre:
   ```bash
   netstat -ano | findstr :8080
   ```

2. Si está ocupado, detén el proceso o cambia el puerto en `application.properties`

### Si no aparecen partidos:
- Verifica en la consola del navegador (F12) las peticiones a la API
- Busca errores de CORS o conexión
- Confirma que el backend responde en: http://localhost:8080/api/football/status
