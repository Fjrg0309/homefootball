# 🏆 API Football - Última Jornada y Datos Recientes

## 📋 Resumen de Mejoras

Se han implementado mejoras significativas en la integración con la API de Football para manejar correctamente la obtención de datos sin acceso a información en vivo:

### ✅ Mejoras Implementadas

1. **Manejo Robusto de Errores**
   - Validación de API key antes de cada petición
   - Captura y logging detallado de errores de conexión
   - Mensajes de error informativos para el usuario

2. **Nuevos Endpoints**
   - `/api/football/fixtures/latest-round` - Obtiene la última jornada completada
   - `/api/football/fixtures/round` - Obtiene partidos de una jornada específica
   - `/api/football/fixtures/latest-date` - Encuentra la última fecha con datos disponibles

3. **Mejoras en el Backend**
   - Método genérico `executeRequest()` con manejo centralizado de errores
   - Logging mejorado para facilitar debugging
   - Filtrado inteligente de partidos finalizados
   - Ordenación por fecha para encontrar datos más recientes

## 🚀 Cómo Usar

### Backend

#### Método 1: Obtener Última Jornada de una Liga

```java
// En tu servicio o controlador
FixtureResponse lastRound = apiFootballService.getLatestRound(140, 2024);
// 140 = La Liga, 2024 = Temporada
```

#### Método 2: Buscar Última Fecha con Datos

```java
String latestDate = apiFootballService.getLatestAvailableDate(140, 2024);
// Devuelve algo como "2024-01-05"
```

#### Método 3: Partidos de una Jornada Específica

```java
FixtureResponse fixtures = apiFootballService.getFixturesByRound(140, 2024, "Regular Season - 15");
```

### Frontend (Angular)

```typescript
import { FootballApiService } from './services/football-api.service';

export class MiComponente {
  private footballApi = inject(FootballApiService);

  cargarUltimaJornada() {
    const laLigaId = 140;
    const temporada = 2024;

    this.footballApi.getLatestRound(laLigaId, temporada).subscribe({
      next: (response) => {
        console.log('Partidos de la última jornada:', response.response);
        // response.response contiene un array de FixtureData
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  buscarUltimaFecha() {
    this.footballApi.getLatestAvailableDate(140, 2024).subscribe({
      next: (response) => {
        console.log('Última fecha con datos:', response.date);
        // Usar esta fecha para obtener partidos
      }
    });
  }
}
```

## 📡 Endpoints HTTP

### Probar con REST Client (VSCode)

Abre el archivo `backend/src/main/resources/test-latest-round.http`:

```http
### Obtener última jornada de La Liga
GET http://localhost:8080/api/football/fixtures/latest-round?league=140&season=2024

### Obtener última jornada de Premier League
GET http://localhost:8080/api/football/fixtures/latest-round?league=39&season=2024

### Buscar última fecha con datos
GET http://localhost:8080/api/football/fixtures/latest-date?league=140&season=2024

### Obtener jornada específica
GET http://localhost:8080/api/football/fixtures/round?league=140&season=2024&round=Regular Season - 15
```

### Probar con cURL

```bash
# Última jornada de La Liga
curl "http://localhost:8080/api/football/fixtures/latest-round?league=140&season=2024"

# Última fecha con datos
curl "http://localhost:8080/api/football/fixtures/latest-date?league=140&season=2024"

# Jornada específica
curl "http://localhost:8080/api/football/fixtures/round?league=140&season=2024&round=Regular%20Season%20-%2015"
```

## 🎯 IDs de Ligas Principales

| Liga | ID | País |
|------|-----|------|
| La Liga | 140 | España |
| Premier League | 39 | Inglaterra |
| Serie A | 135 | Italia |
| Bundesliga | 78 | Alemania |
| Ligue 1 | 61 | Francia |
| Champions League | 2 | Europa |

## 📦 Componente de Ejemplo

Se ha creado un componente completo de ejemplo en:
`frontend/src/app/pages/latest-round-example/latest-round-example.component.ts`

Para usarlo, añádelo a tus rutas:

```typescript
// En app.routes.ts
{
  path: 'latest-round-example',
  loadComponent: () => import('./pages/latest-round-example/latest-round-example.component')
    .then(m => m.LatestRoundExampleComponent)
}
```

## 🔧 Solución de Problemas

### Error: "API Key no configurada"

Verifica que en `backend/src/main/resources/application.properties` tengas:

```properties
api.football.key=TU_API_KEY_AQUI
api.football.base-url=https://v3.football.api-sports.io
```

### Error: "Error de conexión"

1. Verifica que el backend esté ejecutándose en `http://localhost:8080`
2. Comprueba que tienes cuota disponible en tu API key (100 requests/día en plan gratuito)
3. Revisa los logs del backend para más detalles

### No se encuentran partidos

- Algunas ligas pueden no tener datos en todas las temporadas
- Intenta con una temporada diferente (2023, 2022)
- Verifica que la liga esté activa en esa temporada

## 📊 Respuesta de Ejemplo

```json
{
  "results": 10,
  "response": [
    {
      "fixture": {
        "id": 12345,
        "date": "2024-01-05T20:00:00+00:00",
        "status": {
          "long": "Match Finished",
          "short": "FT"
        },
        "venue": {
          "name": "Santiago Bernabéu",
          "city": "Madrid"
        }
      },
      "league": {
        "id": 140,
        "name": "La Liga",
        "round": "Regular Season - 15"
      },
      "teams": {
        "home": {
          "id": 541,
          "name": "Real Madrid",
          "logo": "https://..."
        },
        "away": {
          "id": 529,
          "name": "Barcelona",
          "logo": "https://..."
        }
      },
      "goals": {
        "home": 2,
        "away": 1
      }
    }
  ]
}
```

## 💡 Consejos

1. **Usa `getLatestRound()`** cuando quieras mostrar los resultados más recientes
2. **Usa `getLatestAvailableDate()`** para encontrar la fecha más reciente y luego obtener partidos específicos
3. **Cachea los datos** en el frontend para no hacer peticiones repetidas
4. **Maneja errores** siempre, especialmente errores de conexión

## 🔗 Recursos

- [API Football Documentación](https://www.api-football.com/documentation-v3)
- [Dashboard API Football](https://dashboard.api-football.com/)
- Guía completa: `docs/API-FOOTBALL-GUIDE.md`

## 📝 Notas

- Los datos en vivo (live) requieren planes de pago
- El plan gratuito tiene 100 peticiones/día
- Los datos históricos están disponibles para todas las ligas principales
- Las jornadas se identifican con strings como "Regular Season - 15"
