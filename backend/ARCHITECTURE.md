# Home Football - Sistema de Gestión de Fútbol

API REST desarrollada con Spring Boot para la gestión de ligas, equipos, jugadores y entrenadores.

## Diagrama Entidad-Relación (E/R)

```
┌─────────────────────┐
│       LIGA          │
├─────────────────────┤
│ 🔑 id (PK)          │
│    nombre           │
│    pais             │
│    temporadaActual  │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│      EQUIPO         │
├─────────────────────┤
│ 🔑 id (PK)          │
│    nombre           │
│    fechaFundacion   │
│ 🔗 liga_id (FK)     │
│ 🔗 entrenador_id(FK)│
└──────┬──────────────┘
       │              ▲
       │ 1:N          │ 1:1
       │              │
┌──────▼──────────┐   │
│    JUGADOR      │   │
├─────────────────┤   │
│ 🔑 id (PK)      │   │
│    nombre       │   │
│    fechaNac     │   │
│    nacionalidad │   │
│    posicion     │   │
│    numeroCamis  │   │
│    goles        │   │
│ 🔗 equipo_id(FK)│   │
└─────────────────┘   │
                      │
┌─────────────────────┤
│    ENTRENADOR       │
├─────────────────────┤
│ 🔑 id (PK)          │
│    nombre           │
│    fechaNac         │
│    nacionalidad     │
│    añosExperiencia  │
│    titulosGanados   │
└─────────────────────┘
         ▲
         │
         │ Herencia (JOINED)
         │
┌────────┴─────────┐
│     MIEMBRO      │
├──────────────────┤
│ 🔑 id (PK)       │
│    nombre        │
│    fechaNac      │
│    nacionalidad  │
└──────────────────┘
      (Abstracta)


┌─────────────────────┐
│      USUARIO        │
├─────────────────────┤
│ 🔑 id (PK)          │
│    username (UQ)    │
│    password         │
│    email            │
│    roles            │
│    enabled          │
└─────────────────────┘
```

### Relaciones:

1. **Liga → Equipo** (1:N)
   - Una liga tiene múltiples equipos
   - Un equipo pertenece a una liga

2. **Equipo → Jugador** (1:N)
   - Un equipo tiene múltiples jugadores
   - Un jugador pertenece a un equipo

3. **Equipo → Entrenador** (1:1)
   - Un equipo tiene un entrenador
   - Un entrenador dirige un equipo

4. **Miembro** (Clase abstracta)
   - Jugador y Entrenador heredan de Miembro
   - Estrategia: JOINED (tablas separadas con FK al padre)

5. **Usuario** (Independiente)
   - Para autenticación y autorización

### 🎯 Restricciones de Negocio:

- ✅ Un jugador no puede tener el mismo número de camiseta que otro en el mismo equipo
- ✅ Un entrenador solo puede dirigir un equipo a la vez
- ✅ Un equipo solo puede tener un entrenador asignado
- ✅ Los nombres de equipos y ligas son únicos
- ✅ Validación de datos con Jakarta Validation

## 🗂️ Estructura del Proyecto

```
backend/
├── src/main/java/com/example/information/
│   ├── entities/         # Entidades JPA
│   │   ├── Miembro.java (abstracta)
│   │   ├── Jugador.java
│   │   ├── Entrenador.java
│   │   ├── Equipo.java
│   │   ├── Liga.java
│   │   └── Usuario.java
│   ├── model/            # DTOs
│   │   ├── MiembroDTO.java
│   │   ├── JugadorDTO.java
│   │   ├── EntrenadorDTO.java
│   │   ├── EquipoDTO.java
│   │   └── LigaDTO.java
│   ├── repositories/     # Repositorios JPA
│   │   ├── MiembroRepository.java
│   │   ├── JugadorRepository.java
│   │   ├── EntrenadorRepository.java
│   │   ├── EquipoRepository.java
│   │   ├── LigaRepository.java
│   │   └── UsuarioRepository.java
│   ├── service/          # Lógica de negocio
│   │   ├── MiembroService.java
│   │   ├── JugadorService.java
│   │   ├── EntrenadorService.java
│   │   ├── EquipoService.java
│   │   └── LigaService.java
│   ├── web/              # Controladores REST
│   │   ├── MiembroController.java
│   │   ├── JugadorController.java
│   │   ├── EntrenadorController.java
│   │   ├── EquipoController.java
│   │   └── LigaController.java
│   ├── config/           # Configuración
│   │   ├── WebConfig.java (CORS)
│   │   └── SecurityConfig.java (Spring Security)
│   ├── security/         # JWT y Seguridad
│   │   └── JwtUtil.java
│   └── exception/        # Manejo de excepciones
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       ├── DuplicateResourceException.java
│       ├── InvalidOperationException.java
│       └── BadRequestException.java
└── src/main/resources/
    └── application.properties
```

## 🛠️ Tecnologías Utilizadas

- **Java 21**
- **Spring Boot 3.3.3**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring Validation
- **Base de datos**: H2 (desarrollo)
- **Lombok**: Reducción de código boilerplate
- **JWT**: Autenticación con tokens
- **Maven**: Gestión de dependencias

## 🚀 Características Implementadas

### ✅ CRUD Completo
- Operaciones CREATE, READ, UPDATE, DELETE para todas las entidades

### ✅ Consultas Personalizadas
- Búsquedas por nombre, nacionalidad, posición
- Top goleadores por liga
- Entrenadores sin equipo
- Búsqueda con palabras clave (LIKE)
- Queries con JOIN FETCH para optimización

### ✅ Lógica de Negocio
- Validación de números de camiseta únicos por equipo
- Control de asignación de entrenadores (un entrenador = un equipo)
- Verificación de recursos duplicados
- Validación de transferencias de jugadores
- Manejo de relaciones bidireccionales

### ✅ Manejo de Excepciones
- Respuestas HTTP personalizadas
- Mensajes de error descriptivos
- Validación de entrada con Jakarta Validation

### ✅ Seguridad (Básica Implementada)
- **CORS**: Configurado para frontend (puertos 3000, 4200, 5173)
- **Spring Security**: Configuración básica con endpoints públicos
- **JWT**: Utilidades para generación y validación de tokens
- **Entidad Usuario**: Con roles y autenticación

### 🔧 Pendientes de Implementación Completa
- Servicio de autenticación (login/registro)
- Filtro JWT para validar tokens en cada request
- Endpoints protegidos según roles
- UserDetailsService personalizado

## 📡 Endpoints Principales

### Miembros
- `GET /api/miembros` - Listar todos
- `GET /api/miembros/{id}` - Obtener por ID
- `GET /api/miembros/jugadores` - Solo jugadores
- `GET /api/miembros/entrenadores` - Solo entrenadores

### Jugadores
- `POST /api/jugadores` - Crear jugador
- `PUT /api/jugadores/{id}` - Actualizar
- `GET /api/jugadores/equipo/{equipoId}` - Por equipo
- `GET /api/jugadores/top-goleadores` - Top goleadores

### Equipos
- `POST /api/equipos` - Crear equipo
- `PUT /api/equipos/{id}/entrenador/{entrenadorId}` - Asignar entrenador
- `GET /api/equipos/liga/{ligaId}` - Por liga

### Ligas
- `GET /api/ligas` - Listar todas
- `POST /api/ligas` - Crear liga
- `GET /api/ligas/pais/{pais}` - Por país

## ⚙️ Configuración

### Base de Datos H2
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

Acceso: `http://localhost:8080/h2-console`

### Puerto del Servidor
```properties
server.port=8080
```

## 🔐 Seguridad

La configuración de seguridad actual permite acceso público a todos los endpoints para facilitar el desarrollo. Para producción, descomentar las restricciones en `SecurityConfig.java`.

## 📝 Notas de Desarrollo

- Todos los servicios utilizan `@Transactional` para garantizar consistencia
- Los DTOs incluyen validaciones con anotaciones Jakarta
- Las relaciones están configuradas con cascadas apropiadas
- Se utiliza herencia JOINED para la jerarquía Miembro → Jugador/Entrenador

---

**Autor**: [Tu nombre]  
**Fecha**: Diciembre 2025  
**Versión**: 1.0.0
