# PRUEBA PRÁCTICA DWES - Desarrollo en Entorno Servidor

## 1. Endpoint Creado

### 1.1 Descripción del Endpoint

He creado un nuevo endpoint para la **Landing Page** de la aplicación que proporciona:

- **Total de usuarios registrados** en la plataforma
- **Lista de usuarios** con información pública (sin datos sensibles)
- **Equipo destacado** (Real Madrid) con su escudo/logo
- **Mensaje de bienvenida** personalizado

### 1.2 Rutas del Endpoint

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/landing` | Obtiene datos completos de la landing page |
| `GET` | `/api/landing/summary` | Obtiene un resumen (sin lista de usuarios) |

### 1.3 Propósito y Coherencia con el Dominio

El endpoint es **coherente con el dominio** de la aplicación "HomeFootball" porque:

1. **Usuarios registrados**: Muestra la comunidad activa de la plataforma de fútbol
2. **Equipo destacado**: Presenta información de un equipo grande (Real Madrid) con su escudo, alineado con la temática futbolística
3. **Estadísticas**: Proporciona datos relevantes para la landing page de una aplicación deportiva

### 1.4 Respuesta del Endpoint

```json
{
  "totalUsuarios": 5,
  "usuariosRegistrados": [
    { "id": 1, "username": "admin" },
    { "id": 2, "username": "usuario1" }
  ],
  "equipoDestacado": {
    "id": 1,
    "nombre": "Real Madrid",
    "fechaFundacion": "1902-03-06",
    "ligaNombre": "La Liga",
    "entrenadorNombre": "Carlo Ancelotti",
    "totalJugadores": 3,
    "escudoUrl": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg"
  },
  "mensajeBienvenida": "¡Bienvenido a HomeFootball! La mejor plataforma de información futbolística."
}
```

---

## 2. Arquitectura Implementada

### 2.1 Separación de Capas

La implementación sigue estrictamente la arquitectura de 3 capas:

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLADOR (Web Layer)                   │
│                   LandingPageController.java                 │
│          - Recibe peticiones HTTP                            │
│          - Valida autenticación JWT                          │
│          - Retorna ResponseEntity<LandingPageDTO>            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICIO (Business Layer)                 │
│                    LandingPageService.java                   │
│          - Lógica de negocio                                 │
│          - Conversión de entidades a DTOs                    │
│          - Obtención del equipo destacado                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   REPOSITORIO (Data Layer)                   │
│          UsuarioRepository.java + EquipoRepository.java      │
│          - Acceso a base de datos                            │
│          - Consultas JPA                                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Archivos Creados/Modificados

| Archivo | Capa | Descripción |
|---------|------|-------------|
| `LandingPageController.java` | Controlador | Expone los endpoints REST |
| `LandingPageService.java` | Servicio | Lógica de negocio |
| `LandingPageDTO.java` | Modelo | DTOs para la respuesta |
| `JwtAuthenticationFilter.java` | Seguridad | Filtro de autenticación JWT |
| `SecurityConfig.java` | Configuración | Configuración de seguridad |

---

## 3. Implementación de Seguridad

### 3.1 Estrategia de Seguridad: JWT (JSON Web Token)

El endpoint está **protegido mediante autenticación JWT**:

1. **Filtro JWT** (`JwtAuthenticationFilter.java`):
   - Intercepta todas las peticiones HTTP
   - Extrae el token del header `Authorization: Bearer <token>`
   - Valida el token usando `JwtUtil`
   - Establece la autenticación en el `SecurityContext`

2. **Configuración de Seguridad** (`SecurityConfig.java`):
   - El endpoint `/api/landing/**` requiere autenticación
   - El filtro JWT se ejecuta antes del filtro estándar de Spring Security

### 3.2 Flujo de Autenticación

```
┌──────────┐    ┌─────────────────────┐    ┌──────────────────┐
│  Cliente │───▶│ JwtAuthFilter       │───▶│ SecurityConfig   │
│          │    │ (Valida Token)      │    │ (Verifica Auth)  │
└──────────┘    └─────────────────────┘    └──────────────────┘
                         │                          │
                         ▼                          ▼
                ┌─────────────────┐        ┌───────────────────┐
                │    JwtUtil      │        │ LandingController │
                │ (Extrae User)   │        │ (Procesa Request) │
                └─────────────────┘        └───────────────────┘
```

### 3.3 Código de Seguridad Relevante

**SecurityConfig.java** (fragmento):
```java
.authorizeHttpRequests(auth -> auth
    // Permitir acceso público a autenticación
    .requestMatchers("/api/auth/**").permitAll()
    // PROTEGER endpoint de landing - requiere JWT
    .requestMatchers("/api/landing/**").authenticated()
    // Demás endpoints públicos
    .requestMatchers("/api/**").permitAll()
)
// Agregar filtro JWT
.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
```

**JwtAuthenticationFilter.java** (fragmento):
```java
if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
    jwt = authorizationHeader.substring(7);
    username = jwtUtil.extractUsername(jwt);
}

if (username != null && jwtUtil.validateToken(jwt, username)) {
    // Establecer autenticación en SecurityContext
    SecurityContextHolder.getContext().setAuthentication(authToken);
}
```

---

## 4. Pruebas del Endpoint

### 4.1 Prerrequisitos

1. Tener el backend ejecutándose en `http://localhost:8080`
2. Tener un usuario registrado y su token JWT

### 4.2 Paso 1: Registrar un Usuario

**Comando cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "Registro exitoso"
}
```

### 4.3 Paso 2: Iniciar Sesión (Obtener Token)

**Comando cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Guarda el token de la respuesta** para usarlo en los siguientes pasos.

### 4.4 Paso 3: Probar Endpoint SIN Autenticación (Debe Fallar)

**Comando cURL:**
```bash
curl -X GET http://localhost:8080/api/landing
```

**Respuesta esperada:** `403 Forbidden` o `401 Unauthorized`

### 4.5 Paso 4: Probar Endpoint CON Autenticación JWT

**Comando cURL:**
```bash
curl -X GET http://localhost:8080/api/landing \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

**Respuesta esperada (200 OK):**
```json
{
  "totalUsuarios": 1,
  "usuariosRegistrados": [
    { "id": 1, "username": "testuser" }
  ],
  "equipoDestacado": {
    "id": 1,
    "nombre": "Real Madrid",
    "fechaFundacion": "1902-03-06",
    "ligaNombre": "La Liga",
    "entrenadorNombre": "Carlo Ancelotti",
    "totalJugadores": 3,
    "escudoUrl": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg"
  },
  "mensajeBienvenida": "¡Bienvenido a HomeFootball!..."
}
```

### 4.6 Paso 5: Probar Endpoint Summary

**Comando cURL:**
```bash
curl -X GET http://localhost:8080/api/landing/summary \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

---

## 5. 📸 Capturas de Pantalla

### 5.1 Petición con Postman/Insomnia

**Configuración de la petición:**
- Método: `GET`
- URL: `http://localhost:8080/api/landing`
- Header: `Authorization: Bearer <token>`

### 5.2 Ejemplo de Respuesta Exitosa

![Landing Page Response](assets/landing-response.png)
*La captura muestra la respuesta completa del endpoint con usuarios y equipo destacado*

---

## 6. 📁 Estructura de Archivos Creados

```
backend/src/main/java/com/example/information/
├── config/
│   └── SecurityConfig.java          (MODIFICADO - Agregado filtro JWT)
├── model/
│   └── LandingPageDTO.java          (NUEVO)
├── security/
│   ├── JwtUtil.java                 (Existente)
│   └── JwtAuthenticationFilter.java (NUEVO)
├── service/
│   └── LandingPageService.java      (NUEVO)
└── web/
    └── LandingPageController.java   (NUEVO)
```

---

## 7. ✅ Resumen de Requisitos Cumplidos

| Requisito | Estado | Descripción |
|-----------|--------|-------------|
| Endpoint nuevo | ✅ | `/api/landing` y `/api/landing/summary` |
| Propósito claro | ✅ | Datos para landing page (usuarios + equipo) |
| Coherencia con dominio | ✅ | Alineado con temática futbolística |
| Arquitectura en capas | ✅ | Controller → Service → Repository |
| Seguridad JWT | ✅ | Filtro de autenticación implementado |
| Pruebas documentadas | ✅ | Comandos cURL incluidos |

---

## 8. Referencias

- **Spring Security**: https://spring.io/projects/spring-security
- **JWT**: https://jwt.io/introduction
- **API Football Shields**: Wikipedia Commons

---

*Documento generado para la prueba práctica DWES - Desarrollo en Entorno Servidor*
