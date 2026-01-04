# 🏆 Guía de Integración API-Football

Esta documentación explica cómo se ha integrado **API-Football** en el proyecto HomeFootball para obtener datos reales de fútbol (ligas, equipos, jugadores, partidos, clasificaciones, etc.).

## 📋 Índice

1. [Arquitectura de la Integración](#arquitectura-de-la-integración)
2. [Configuración del Backend](#configuración-del-backend)
3. [Configuración del Frontend](#configuración-del-frontend)
4. [Obtener tu API Key](#obtener-tu-api-key)
5. [Página de Partidos - Funcionalidades](#página-de-partidos---funcionalidades)
6. [Endpoints Disponibles](#endpoints-disponibles)
7. [Ejemplos de Uso](#ejemplos-de-uso)
8. [IDs de Ligas Importantes](#ids-de-ligas-importantes)
9. [Límites y Buenas Prácticas](#límites-y-buenas-prácticas)

---

## 🏗️ Arquitectura de la Integración

```
┌─────────────────┐     HTTP      ┌─────────────────┐     HTTP      ┌─────────────────┐
│                 │  ────────────►│                 │  ────────────►│                 │
│    FRONTEND     │               │     BACKEND     │               │  API-FOOTBALL   │
│    (Angular)    │◄────────────  │  (Spring Boot)  │◄────────────  │   (Externo)     │
│                 │     JSON      │                 │     JSON      │                 │
└─────────────────┘               └─────────────────┘               └─────────────────┘
     Puerto 4200                       Puerto 8080                api-football.com
```

**¿Por qué usamos el Backend como proxy?**

1. **Seguridad**: La API key nunca se expone en el frontend
2. **CORS**: Evitamos problemas de cross-origin
3. **Control**: Podemos cachear respuestas, limitar peticiones, etc.
4. **Transformación**: Podemos adaptar los datos antes de enviarlos al frontend

---

## ⚙️ Configuración del Backend

### 1. Archivo de propiedades

Edita `backend/src/main/resources/application.properties`:

```properties
# ==================== API-FOOTBALL ====================
# Obtén tu API key en: https://dashboard.api-football.com/
# Plan gratuito: 100 peticiones/día
api.football.key=TU_API_KEY_AQUI
api.football.base-url=https://v3.football.api-sports.io
```

### 2. Archivos creados en el Backend

| Archivo | Descripción |
|---------|-------------|
| `config/ApiFootballConfig.java` | Configuración y RestTemplate |
| `service/ApiFootballService.java` | Servicio que consume la API externa |
| `web/ApiFootballController.java` | Controlador REST con los endpoints |
| `model/apifootball/*.java` | DTOs para mapear las respuestas JSON |

### 3. Estructura de los DTOs

```
model/apifootball/
├── LeagueResponse.java      # Respuesta de ligas
├── TeamResponse.java        # Respuesta de equipos
├── PlayerResponse.java      # Respuesta de jugadores
├── FixtureResponse.java     # Respuesta de partidos
└── StandingsResponse.java   # Respuesta de clasificaciones
```

---

## 🎨 Configuración del Frontend

### 1. Environment

El archivo `frontend/src/environments/environment.ts` ya está configurado:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Apunta al backend
};
```

### 2. Servicio Angular

Se ha creado `frontend/src/app/services/football-api.service.ts` con:

- Interfaces TypeScript para tipado fuerte
- Métodos para cada endpoint de la API
- Manejo de parámetros y opciones

---

## 🔑 Obtener tu API Key

1. Ve a [https://dashboard.api-football.com/](https://dashboard.api-football.com/)
2. Regístrate con tu email
3. Selecciona el plan **FREE** (100 peticiones/día)
4. Ve a tu perfil o configuración de cuenta
5. Copia tu API Key
6. Pégala en `application.properties`

```properties
api.football.key=abc123xyz456...
```

---

## ⚽ Página de Partidos - Funcionalidades

La página de partidos (`/liga/:id/partidos`) ahora incluye datos reales de la API con las siguientes características:

### Navegación por Fechas
- **Flechas izquierda/derecha**: Navegar al día anterior o siguiente
- **Botón "Ir a hoy"**: Volver rápidamente a la fecha actual
- **Búsqueda automática**: Si no hay partidos en un día, botones para buscar el próximo día con partidos

### Estados de los Partidos

| Estado | Visualización |
|--------|---------------|
| **Próximo** | Muestra la hora del partido (ej: "21:00") |
| **En vivo** | Marcador en **rojo** con animación pulsante, indica el minuto actual |
| **Finalizado** | Marcador normal, equipo ganador resaltado en verde |
| **Aplazado** | Muestra "APLZ" |
| **Suspendido** | Muestra "SUSP" |

### Mapeo de Ligas (slug → ID API)

```typescript
const LEAGUE_ID_MAP = {
  'laliga': 140,
  'premier-league': 39,
  'serie-a': 135,
  'bundesliga': 78,
  'ligue-1': 61,
  'ligue-2': 62,
  'primeira-liga': 94,
  'eredivisie': 88,
  'super-lig': 203,
  'mls': 253,
  'liga-mx': 262,
  'championship': 40
};
```

### Cómo funciona

1. Al entrar a `/liga/laliga/partidos`, se obtiene el ID de API (140)
2. Se hace petición a `/api/football/fixtures/date/YYYY-MM-DD`
3. Se filtran solo los partidos de esa liga
4. Se ordenan: partidos en vivo primero, luego por hora
5. Se muestra el marcador o la hora según el estado

---

## 🛠️ Endpoints Disponibles

### Backend (Spring Boot) - Puerto 8080

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/football/status` | Verifica si la API está configurada |
| GET | `/api/football/leagues` | Todas las ligas |
| GET | `/api/football/leagues/{id}` | Liga por ID |
| GET | `/api/football/leagues/country/{country}` | Ligas por país |
| GET | `/api/football/teams?league={id}&season={year}` | Equipos de una liga |
| GET | `/api/football/teams/{id}` | Equipo por ID |
| GET | `/api/football/teams/search?name={name}` | Buscar equipos |
| GET | `/api/football/players?team={id}&season={year}` | Jugadores de un equipo |
| GET | `/api/football/players/{id}?season={year}` | Jugador por ID |
| GET | `/api/football/players/topscorers?league={id}&season={year}` | Máximos goleadores |
| GET | `/api/football/fixtures?league={id}&season={year}` | Partidos de una liga |
| GET | `/api/football/fixtures/live` | Partidos en vivo |
| GET | `/api/football/fixtures/date/{date}` | Partidos por fecha (YYYY-MM-DD) |
| GET | `/api/football/fixtures/team/{teamId}?season={year}` | Partidos de un equipo |
| GET | `/api/football/standings?league={id}&season={year}` | Clasificación |

---

## 📝 Ejemplos de Uso

### En el Frontend (Angular)

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FootballApiService } from '../../services/football-api.service';

@Component({
  selector: 'app-mi-componente',
  template: `...`
})
export class MiComponente implements OnInit {
  private footballApi = inject(FootballApiService);

  ngOnInit() {
    // Obtener ligas de España
    this.footballApi.getLeaguesByCountry('Spain').subscribe({
      next: (response) => {
        console.log('Ligas:', response.response);
      },
      error: (err) => console.error('Error:', err)
    });

    // Obtener equipos de La Liga (ID 140)
    this.footballApi.getTeamsByLeague(140, 2024).subscribe({
      next: (response) => {
        console.log('Equipos:', response.response);
      }
    });

    // Obtener clasificación
    this.footballApi.getStandings(140, 2024).subscribe({
      next: (response) => {
        const standings = response.response[0].league.standings[0];
        console.log('Clasificación:', standings);
      }
    });

    // Obtener partidos en vivo
    this.footballApi.getLiveFixtures().subscribe({
      next: (response) => {
        console.log('Partidos en vivo:', response.response);
      }
    });
  }
}
```

### Usando cURL (Testing)

```bash
# Verificar estado
curl http://localhost:8080/api/football/status

# Obtener ligas de España
curl http://localhost:8080/api/football/leagues/country/Spain

# Obtener equipos de La Liga 2024
curl "http://localhost:8080/api/football/teams?league=140&season=2024"

# Obtener clasificación de La Liga
curl "http://localhost:8080/api/football/standings?league=140&season=2024"

# Obtener partidos de hoy
curl http://localhost:8080/api/football/fixtures/date/2026-01-04
```

### Usando archivo .http (VS Code REST Client)

Crea un archivo `test-api-football.http`:

```http
### Verificar estado de la API
GET http://localhost:8080/api/football/status

### Obtener todas las ligas
GET http://localhost:8080/api/football/leagues

### Ligas de España
GET http://localhost:8080/api/football/leagues/country/Spain

### Equipos de La Liga
GET http://localhost:8080/api/football/teams?league=140&season=2024

### Buscar equipo por nombre
GET http://localhost:8080/api/football/teams/search?name=Barcelona

### Clasificación de La Liga
GET http://localhost:8080/api/football/standings?league=140&season=2024

### Máximos goleadores de La Liga
GET http://localhost:8080/api/football/players/topscorers?league=140&season=2024

### Partidos en vivo
GET http://localhost:8080/api/football/fixtures/live
```

---

## 🏟️ IDs de Ligas Importantes

| ID | Liga | País |
|----|------|------|
| 140 | La Liga | España |
| 141 | La Liga 2 | España |
| 39 | Premier League | Inglaterra |
| 40 | Championship | Inglaterra |
| 135 | Serie A | Italia |
| 78 | Bundesliga | Alemania |
| 61 | Ligue 1 | Francia |
| 94 | Primeira Liga | Portugal |
| 88 | Eredivisie | Holanda |
| 2 | Champions League | Europa |
| 3 | Europa League | Europa |
| 848 | Conference League | Europa |

---

## ⚠️ Límites y Buenas Prácticas

### Plan Gratuito

- **100 peticiones por día**
- Reset a las 00:00 UTC
- Acceso a datos históricos limitado

### Buenas Prácticas

1. **Cachear respuestas**: Los datos de ligas/equipos no cambian frecuentemente
2. **Usar la temporada correcta**: Siempre especifica `season=2024` (o la actual)
3. **No hacer peticiones innecesarias**: Guarda los datos en el estado de la app
4. **Manejar errores**: Siempre implementa manejo de errores
5. **Mostrar loading states**: Indica al usuario cuando se están cargando datos

### Ejemplo de Caché Simple

```typescript
// En el servicio
private leaguesCache: LeagueData[] | null = null;

getLeagues(): Observable<LeagueData[]> {
  if (this.leaguesCache) {
    return of(this.leaguesCache);
  }
  
  return this.http.get<ApiFootballResponse<LeagueData>>(`${this.baseUrl}/leagues`).pipe(
    map(response => {
      this.leaguesCache = response.response;
      return response.response;
    })
  );
}
```

---

## 🚀 Iniciar el Proyecto

### 1. Backend

```bash
cd backend
# Configura tu API key en application.properties
./mvnw spring-boot:run
```

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

### 3. Probar

1. Abre `http://localhost:4200/football-demo`
2. Verifica que aparezcan las ligas de España
3. Haz clic en una liga para ver equipos y clasificación

---

## 📁 Archivos Modificados/Creados

### Backend

```
backend/src/main/
├── java/com/example/information/
│   ├── config/
│   │   └── ApiFootballConfig.java        ✅ NUEVO
│   ├── model/apifootball/
│   │   ├── LeagueResponse.java           ✅ NUEVO
│   │   ├── TeamResponse.java             ✅ NUEVO
│   │   ├── PlayerResponse.java           ✅ NUEVO
│   │   ├── FixtureResponse.java          ✅ NUEVO
│   │   └── StandingsResponse.java        ✅ NUEVO
│   ├── service/
│   │   └── ApiFootballService.java       ✅ NUEVO
│   └── web/
│       └── ApiFootballController.java    ✅ NUEVO
└── resources/
    └── application.properties            ✏️ MODIFICADO
```

### Frontend

```
frontend/src/app/
├── services/
│   └── football-api.service.ts           ✅ NUEVO
├── pages/
│   └── football-demo/
│       └── football-demo.component.ts    ✅ NUEVO
└── app.routes.ts                         ✏️ MODIFICADO
```

---

## 🔗 Referencias

- [API-Football Documentation v3](https://www.api-football.com/documentation-v3)
- [Dashboard API-Football](https://dashboard.api-football.com/)
- [Angular HttpClient](https://angular.dev/guide/http)
- [Spring RestTemplate](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)

---

## ❓ Troubleshooting

### Error: "Falta configurar la API key"

1. Verifica que has añadido tu API key en `application.properties`
2. Reinicia el backend

### Error: CORS

1. Verifica que el backend está corriendo en el puerto 8080
2. Verifica que `WebConfig.java` tiene `http://localhost:4200` en los orígenes permitidos

### Error: 429 Too Many Requests

1. Has excedido el límite de 100 peticiones/día
2. Espera al reset a las 00:00 UTC o implementa caché

### No aparecen datos

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña Network
3. Verifica que las peticiones al backend devuelven datos
4. Verifica que no hay errores en la consola

---

**Fecha de creación**: 4 de Enero de 2026  
**Autor**: GitHub Copilot  
**Proyecto**: HomeFootball
