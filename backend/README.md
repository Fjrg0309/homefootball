# HomeFootball - Backend API

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-green)
![Maven](https://img.shields.io/badge/Maven-3.8+-blue)
![H2](https://img.shields.io/badge/H2-Database-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema de gestión de ligas de fútbol desarrollado con Spring Boot. API REST completa para administrar ligas, equipos, jugadores y entrenadores.

## Documentación

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Diagrama E/R completo y arquitectura del proyecto
- **[SETUP.md](SETUP.md)** - Guía de instalación y configuración
- **[CHECKLIST.md](CHECKLIST.md)** - Checklist completo de requisitos implementados

## Inicio Rápido

### Prerequisitos

- Java 21+
- Maven 3.8+

### Instalación y Ejecución

#### Opción 1: Usando el script (Windows)
```bash
./run.bat
```

#### Opción 2: Comandos Maven
```bash
# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run
```

### Acceso

- **API REST**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Usuario: `sa`
  - Password: `sa`

## Características

### Completamente Implementado

- **5 Entidades** con relaciones complejas (herencia, 1:N, 1:1)
- **CRUD completo** para todas las entidades
- **40+ consultas personalizadas** con @Query, JPA derived queries, JOIN FETCH
- **Lógica de negocio avanzada**:
  - Validación de números de camiseta únicos por equipo
  - Control de asignación de entrenadores
  - Validación de transferencias de jugadores
- **Sistema de excepciones personalizado** con GlobalExceptionHandler
- **Validaciones Jakarta** en todos los DTOs
- **Configuración CORS** para frontend
- **Spring Security básico** configurado
- **JWT Utils** preparado para autenticación

## Estructura del Proyecto

```
backend/
├── src/main/java/com/example/information/
│   ├── entities/         # Entidades JPA (6)
│   ├── model/            # DTOs con validaciones (5)
│   ├── repositories/     # Repositorios con consultas custom (6)
│   ├── service/          # Lógica de negocio (5)
│   ├── web/              # Controladores REST (5)
│   ├── config/           # CORS, Security
│   ├── security/         # JWT Utils
│   └── exception/        # Excepciones custom (4)
├── src/main/resources/
│   ├── application.properties
│   └── data.sql          # Datos de prueba
├── ARCHITECTURE.md       # Documentación técnica
├── SETUP.md             # Guía de instalación
├── CHECKLIST.md         # Requisitos cumplidos
└── run.bat              # Script de ejecución
```

## Diagrama E/R (Simplificado)

```
Liga (1) ─────< (N) Equipo (1) ─────< (N) Jugador
                        │
                       (1)
                        │
                   Entrenador
                        │
                  (hereda de)
                        │
                    Miembro
```

Ver diagrama completo en [ARCHITECTURE.md](ARCHITECTURE.md)

## Endpoints Principales

| Recurso | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| **Ligas** | GET | `/api/ligas` | Listar todas |
| | GET | `/api/ligas/{id}` | Obtener por ID |
| | POST | `/api/ligas` | Crear nueva |
| | PUT | `/api/ligas/{id}` | Actualizar |
| | DELETE | `/api/ligas/{id}` | Eliminar |
| **Equipos** | GET | `/api/equipos` | Listar todos |
| | GET | `/api/equipos/liga/{ligaId}` | Por liga |
| | POST | `/api/equipos` | Crear nuevo |
| | PUT | `/api/equipos/{id}/entrenador/{entrenadorId}` | Asignar entrenador |
| **Jugadores** | GET | `/api/jugadores` | Listar todos |
| | GET | `/api/jugadores/top-goleadores` | Top goleadores |
| | GET | `/api/jugadores/equipo/{equipoId}` | Por equipo |
| | POST | `/api/jugadores/{id}/transferir` | Transferir jugador |
| **Entrenadores** | GET | `/api/entrenadores` | Listar todos |
| | GET | `/api/entrenadores/sin-equipo` | Libres |
| **Miembros** | GET | `/api/miembros` | Todos |
| | GET | `/api/miembros/jugadores` | Solo jugadores |
| | GET | `/api/miembros/entrenadores` | Solo entrenadores |

Ver todos los endpoints en [SETUP.md](SETUP.md)

## Tecnologías

- **Java 21**
- **Spring Boot 3.3.3**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring Validation
- **H2 Database** (desarrollo)
- **Lombok**
- **JWT (jjwt)**
- **Maven**

## Estadísticas

- **Entidades**: 6
- **DTOs**: 5
- **Repositorios**: 6
- **Servicios**: 5
- **Controladores**: 5
- **Consultas personalizadas**: 40+
- **Endpoints REST**: 50+
- **Líneas de código**: 2000+

## Testing

```bash
# Ejecutar tests (cuando estén implementados)
mvn test

# Con cobertura
mvn test jacoco:report
```

## Seguridad

### Configuración Actual (Desarrollo)
Todos los endpoints están abiertos para facilitar el desarrollo.

### Para Producción
Descomentar restricciones en `SecurityConfig.java` y completar implementación JWT:
- JwtRequestFilter
- UserDetailsService
- AuthService y AuthController

## Datos de Prueba

El proyecto incluye datos de ejemplo en `data.sql`:
- 4 Ligas (La Liga, Premier League, Serie A, Bundesliga)
- 3 Equipos (Real Madrid, FC Barcelona, Manchester City)
- 3 Entrenadores
- 12 Jugadores

## Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto es parte de un ejercicio académico.

## Autor

**Tu Nombre**

## Proyecto Académico

Proyecto desarrollado como parte del curso de desarrollo backend con Spring Boot.

---

⭐ Si te ha gustado este proyecto, dale una estrella!
