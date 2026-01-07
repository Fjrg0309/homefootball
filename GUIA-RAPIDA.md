# 🚀 Guía Rápida - Proyecto API Football

## 📋 Requisitos Previos

- **Java JDK 17 o superior** (para el backend)
- **Node.js 18 o superior** (para el frontend)
- **Maven** (incluido con el proyecto como mvnw)

## 🏁 Inicio Rápido

### Opción 1: Scripts Automáticos (Recomendado)

1. **Iniciar Backend:**
   - Haz doble clic en `INICIAR-BACKEND.bat`
   - Espera a ver: "Started InformationApplication in X seconds"
   - El backend estará en: http://localhost:8080

2. **Iniciar Frontend:**
   - Haz doble clic en `INICIAR-FRONTEND.bat`
   - Espera a ver: "Compiled successfully"
   - El frontend estará en: http://localhost:4200

### Opción 2: Manual

#### Backend (Terminal 1)
```bash
cd backend
mvnw.cmd spring-boot:run
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

## 🧪 Probar la Conexión

### 1. Verificar Backend
Abre en tu navegador: http://localhost:8080/api/football/ping

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": 1234567890
}
```

### 2. Verificar Estado de la API
Abre: http://localhost:8080/api/football/status

Deberías ver:
```json
{
  "configured": true,
  "message": "API-Football está configurado correctamente"
}
```

### 3. Probar una Petición Real
Abre: http://localhost:8080/api/football/leagues/country/Spain

Deberías ver un JSON con las ligas de España.

### 4. Acceder al Frontend
Abre: http://localhost:4200/football-demo

Deberías ver:
- ✅ Estado de la API en verde
- ⚽ Lista de ligas españolas
- 👕 Equipos de La Liga
- 📊 Clasificación de La Liga

## ❌ Solución de Problemas

### Error: "No se puede conectar al backend"
- ✅ Verifica que el backend esté corriendo (Terminal 1)
- ✅ Comprueba que esté en http://localhost:8080
- ✅ Revisa que no haya errores en la consola del backend

### Error: "Error al cargar las ligas"
- ✅ Verifica la API key en `backend/src/main/resources/application.properties`
- ✅ Asegúrate de que `api.football.key` esté configurada
- ✅ Comprueba que no hayas excedido el límite de peticiones (100/día en plan gratuito)

### Error: CORS / Cross-Origin
- ✅ El backend ya tiene CORS configurado para permitir todas las peticiones
- ✅ Si usas un puerto diferente a 4200, actualiza el frontend en `environment.ts`

### La página se queda en "Cargando..."
- ✅ Abre las DevTools del navegador (F12)
- ✅ Ve a la pestaña Console y busca errores en rojo
- ✅ Ve a la pestaña Network y verifica que las peticiones a `/api/football/` se completen

## 📊 Endpoints Disponibles

### Status
- `GET /api/football/ping` - Verificar que el backend funciona
- `GET /api/football/status` - Estado de la configuración

### Ligas
- `GET /api/football/leagues` - Todas las ligas
- `GET /api/football/leagues/country/{country}` - Ligas por país (ej: Spain)
- `GET /api/football/leagues/{id}` - Liga por ID

### Equipos
- `GET /api/football/teams?league={id}&season=2023` - Equipos de una liga
- `GET /api/football/teams/{id}` - Equipo por ID
- `GET /api/football/teams/search?name={name}` - Buscar equipos

### Partidos
- `GET /api/football/fixtures?league={id}&season=2023` - Partidos de una liga
- `GET /api/football/fixtures/latest-round?league={id}&season=2023` - Última jornada
- `GET /api/football/fixtures/date/{date}` - Partidos por fecha (YYYY-MM-DD)
- `GET /api/football/fixtures/team/{id}?season=2023` - Partidos de un equipo

### Jugadores
- `GET /api/football/players?team={id}&season=2023` - Jugadores de un equipo
- `GET /api/football/players/{id}?season=2023` - Jugador por ID
- `GET /api/football/players/topscorers?league={id}&season=2023` - Máximos goleadores

### Clasificación
- `GET /api/football/standings?league={id}&season=2023` - Clasificación de una liga

## ⚠️ Nota Importante sobre Temporadas

La API gratuita de API-Football **NO tiene datos actuales de 2024-2025**. Por eso:
- ✅ Usa siempre **season=2023** en tus peticiones
- ✅ Los datos son de la temporada 2022-2023
- ✅ No intentes acceder a partidos en vivo (no hay datos actuales)

## 📝 Ejemplos de Uso en Angular

### Obtener Ligas
```typescript
this.footballApiService.getLeaguesByCountry('Spain').subscribe({
  next: (response) => {
    console.log('Ligas:', response.response);
  },
  error: (err) => {
    console.error('Error:', err);
  }
});
```

### Obtener Equipos
```typescript
this.footballApiService.getTeamsByLeague(140, 2023).subscribe({
  next: (response) => {
    console.log('Equipos:', response.response);
  },
  error: (err) => {
    console.error('Error:', err);
  }
});
```

### Obtener Clasificación
```typescript
this.footballApiService.getStandings(140, 2023).subscribe({
  next: (response) => {
    const standings = response.response[0].league.standings[0];
    console.log('Clasificación:', standings);
  },
  error: (err) => {
    console.error('Error:', err);
  }
});
```

## 🔍 Herramientas de Prueba

### VS Code Extension: REST Client
Si tienes la extensión REST Client instalada, puedes usar los archivos `.http`:
- `backend/src/main/resources/api-football-test.http`
- `backend/src/main/resources/test-latest-round.http`

### Postman / Insomnia
Importa los endpoints desde esta guía y prueba directamente.

### cURL
```bash
# Ping
curl http://localhost:8080/api/football/ping

# Status
curl http://localhost:8080/api/football/status

# Ligas de España
curl http://localhost:8080/api/football/leagues/country/Spain
```

## 📚 Documentación Adicional

- `backend/SOLUCION-ERRORES-API.md` - Guía completa de solución de problemas
- `backend/README.md` - Documentación del backend
- `frontend/README.md` - Documentación del frontend
- `docs/API-FOOTBALL-GUIDE.md` - Guía de la API de Football

## 💡 Consejos

1. **Siempre inicia el backend primero**, luego el frontend
2. **Usa 2023 como temporada** en todas las peticiones
3. **Revisa la consola del navegador** (F12) si algo falla
4. **Límite de peticiones**: 100 por día en plan gratuito
5. **No cierres las terminales** mientras uses la aplicación

---

¿Tienes problemas? Consulta `backend/SOLUCION-ERRORES-API.md` para ayuda detallada.
