# 🔍 Instrucciones para Debuggear Errores de Conexión

## Paso 1: Verificar que el Backend está corriendo

Abre una terminal PowerShell y ejecuta:

```powershell
cd c:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball
.\test-backend.ps1
```

Este script te dirá:
- ✓ Si el backend está corriendo
- ✓ Si la API key de API-Football está configurada
- ✓ Si puede hacer peticiones a la API externa
- ✓ Si puede obtener datos de partidos

## Paso 2: Si el Backend NO está corriendo

Abre una terminal **separada** y ejecuta:

```powershell
cd c:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend
mvn spring-boot:run
```

Espera hasta que veas el mensaje:
```
Started HomefootballApplication in X.XXX seconds
```

## Paso 3: Verificar la configuración del Frontend

Abre el navegador y ve a la consola de desarrollador (F12 → Console).

Deberías ver mensajes como:
```
FootballApiService initialized
API Base URL: http://localhost:8080/api/football
```

Si ves errores HTTP con status `0`, significa que:
- El backend NO está corriendo en http://localhost:8080
- Hay un problema de CORS
- El firewall está bloqueando la conexión

## Paso 4: Probar manualmente las peticiones

Abre el navegador y ve a estas URLs:

1. **Health check del backend:**
   ```
   http://localhost:8080/health
   ```
   Debería devolver: `{"status":"UP"}`

2. **Status de API Football:**
   ```
   http://localhost:8080/api/football/status
   ```
   Debería devolver: `{"configured":true,"message":"API-Football está configurado correctamente"}`

3. **Información de configuración:**
   ```
   http://localhost:8080/debug/config
   ```
   Te muestra la configuración del backend

4. **Partidos de La Liga - Jornada 38:**
   ```
   http://localhost:8080/api/football/fixtures/round?league=140&season=2023&round=Regular%20Season%20-%2038
   ```
   Debería devolver JSON con partidos

## Paso 5: Revisar los logs

### Logs del Backend:
Los logs del backend aparecen en la terminal donde ejecutaste `mvn spring-boot:run`.

Busca mensajes como:
```
Ejecutando petición a API-Football: https://v3.football.api-sports.io/...
Petición exitosa a: ...
```

Si ves errores, revisa:
- La API key en `backend/src/main/resources/application.properties`
- La conexión a internet
- El límite de peticiones de la API (100 por día en plan free)

### Logs del Frontend:
Los logs del frontend aparecen en la consola del navegador (F12 → Console).

Busca mensajes como:
```
🏟️ Solicitando partidos - Liga: 140, Temporada: 2023, Jornada: Regular Season - 38
📤 URL: http://localhost:8080/api/football/fixtures/round
```

## Paso 6: Problemas comunes y soluciones

### Error: "Sin conexión. Verifica tu red"
**Causa:** El frontend no puede conectarse al backend (error HTTP status 0)
**Solución:** 
1. Verifica que el backend está corriendo (`.\test-backend.ps1`)
2. Verifica que está en el puerto 8080
3. Reinicia el backend

### Error: "Port 8080 was already in use"
**Causa:** Ya hay un proceso usando el puerto 8080
**Solución:**
```powershell
# Detener el proceso que usa el puerto 8080
$port = 8080
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
if ($processId) {
    Stop-Process -Id $processId -Force
}
```

### Error: "API Key no configurada" o "API Key de API-Football no está configurada"
**Causa:** La API key no está en application.properties o está vacía
**Solución:**
1. Abre `backend/src/main/resources/application.properties`
2. Verifica que existe: `api.football.key=61b16fbce915950b51df57c3718b557b`
3. Guarda el archivo
4. Reinicia el backend

### Error: "Error de conexión con API-Football"
**Causa:** Problemas conectando con la API externa
**Solución:**
1. Verifica tu conexión a internet
2. Verifica que la API key es correcta
3. Verifica que no superaste el límite de peticiones (100/día en plan free)
4. Prueba directamente: https://v3.football.api-sports.io/leagues?id=140 (con tu API key en headers)

### Error: "Error en la petición" (400-499)
**Causa:** Petición mal formada o permisos
**Solución:**
1. Revisa los parámetros de la petición en los logs
2. Verifica que la liga ID, temporada y jornada son correctos

### Error: "Error del servidor" (500-599)
**Causa:** Error interno del backend
**Solución:**
1. Revisa los logs del backend
2. Busca el stack trace completo
3. Verifica la conexión a PostgreSQL

## Paso 7: Reinicio completo

Si todo lo anterior falla, haz un reinicio completo:

```powershell
# Terminal 1: Detener backend
# Presiona Ctrl+C en la terminal donde corre el backend

# Terminal 1: Limpiar y recompilar
cd c:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend
mvn clean package -DskipTests

# Terminal 1: Iniciar backend
mvn spring-boot:run

# Terminal 2: Verificar
cd c:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball
.\test-backend.ps1

# Terminal 3 (si usas frontend local): Reiniciar frontend
cd c:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\frontend
npm start
```

## Información Adicional

### URLs importantes:
- Backend: http://localhost:8080
- Frontend (desarrollo): http://localhost:4200
- API Football: https://v3.football.api-sports.io

### Datos de prueba:
- La Liga: ID 140, Temporada 2023, 38 jornadas
- Premier League: ID 39, Temporada 2023, 38 jornadas
- Champions League: ID 2, Temporada 2023

### Contactos:
- API Football Docs: https://www.api-football.com/documentation-v3
