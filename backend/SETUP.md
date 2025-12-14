# 🚀 Guía de Configuración y Ejecución

## 📋 Prerrequisitos

- **Java JDK 21** o superior
- **Maven 3.8+**
- IDE recomendado: IntelliJ IDEA, VS Code con Extension Pack for Java, o Eclipse

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
cd backend
```

### 2. Compilar el proyecto
```bash
mvn clean install
```

### 3. Ejecutar la aplicación
```bash
mvn spring-boot:run
```

O desde tu IDE, ejecutar la clase principal con el método `main()`.

## 🌐 Acceso a la Aplicación

- **API REST**: http://localhost:8080/api
- **Consola H2**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Usuario: `sa`
  - Contraseña: `sa`

## 📡 Probar los Endpoints

### Usando archivo.http (VS Code con REST Client)

El proyecto incluye un archivo `src/main/resources/archivo.http` con ejemplos de requests.

### Usando cURL

#### Listar todas las ligas
```bash
curl http://localhost:8080/api/ligas
```

#### Obtener un equipo por ID
```bash
curl http://localhost:8080/api/equipos/1
```

#### Crear un nuevo jugador
```bash
curl -X POST http://localhost:8080/api/jugadores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Jugador",
    "fechaNacimiento": "2000-01-01",
    "nacionalidad": "España",
    "posicion": "Delantero",
    "numeroCamiseta": 10,
    "golesMarcados": 0,
    "equipoId": 1
  }'
```

#### Top goleadores
```bash
curl http://localhost:8080/api/jugadores/top-goleadores
```

### Usando Postman

1. Importa la colección desde `classroom/ejemplos.http`
2. Configura el base URL: `http://localhost:8080`
3. Ejecuta las peticiones

## 🔧 Configuración Personalizada

### Cambiar el puerto del servidor
En `application.properties`:
```properties
server.port=9090
```

### Habilitar logs de SQL
Ya está habilitado por defecto:
```properties
spring.jpa.show-sql=true
```

### Cambiar a base de datos persistente (MySQL/PostgreSQL)

#### Para MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/homefootball
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

Añadir dependencia en `pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 🧪 Testing

### Ejecutar tests
```bash
mvn test
```

### Ver cobertura de tests
```bash
mvn test jacoco:report
```

## 🔐 Configuración de Seguridad

### Modo Desarrollo (Actual)
Todos los endpoints están abiertos para facilitar el desarrollo.

### Activar Autenticación JWT (Producción)

1. En `SecurityConfig.java`, cambiar:
```java
.requestMatchers("/api/**").permitAll()
```
Por:
```java
.requestMatchers("/api/**").authenticated()
```

2. Implementar el filtro JWT (próximamente)

3. Crear endpoints de autenticación:
   - `POST /api/auth/register` - Registro
   - `POST /api/auth/login` - Login (retorna JWT)

## 📦 Generar JAR ejecutable

```bash
mvn clean package
```

El JAR se genera en: `target/book-catalog-0.0.1-SNAPSHOT.jar`

Ejecutar:
```bash
java -jar target/book-catalog-0.0.1-SNAPSHOT.jar
```

## 🐛 Solución de Problemas

### Error: Puerto 8080 en uso
Cambiar el puerto en `application.properties` o detener la aplicación que usa el puerto:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Error: Could not find or load main class
Ejecutar:
```bash
mvn clean compile
```

### Base de datos no se inicializa con datos
Verificar que `spring.jpa.defer-datasource-initialization=true` esté en `application.properties`

## 📚 Endpoints Documentados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ligas` | Todas las ligas |
| GET | `/api/ligas/{id}` | Liga por ID |
| POST | `/api/ligas` | Crear liga |
| PUT | `/api/ligas/{id}` | Actualizar liga |
| DELETE | `/api/ligas/{id}` | Eliminar liga |
| GET | `/api/equipos` | Todos los equipos |
| GET | `/api/equipos/{id}` | Equipo por ID |
| GET | `/api/equipos/liga/{ligaId}` | Equipos de una liga |
| POST | `/api/equipos` | Crear equipo |
| PUT | `/api/equipos/{id}` | Actualizar equipo |
| PUT | `/api/equipos/{id}/entrenador/{entrenadorId}` | Asignar entrenador |
| DELETE | `/api/equipos/{id}` | Eliminar equipo |
| GET | `/api/jugadores` | Todos los jugadores |
| GET | `/api/jugadores/{id}` | Jugador por ID |
| GET | `/api/jugadores/equipo/{equipoId}` | Jugadores de un equipo |
| GET | `/api/jugadores/top-goleadores` | Top goleadores |
| POST | `/api/jugadores` | Crear jugador |
| PUT | `/api/jugadores/{id}` | Actualizar jugador |
| POST | `/api/jugadores/{id}/transferir?nuevoEquipoId={equipoId}` | Transferir jugador |
| DELETE | `/api/jugadores/{id}` | Eliminar jugador |
| GET | `/api/entrenadores` | Todos los entrenadores |
| GET | `/api/entrenadores/sin-equipo` | Entrenadores libres |
| GET | `/api/miembros` | Todos los miembros |
| GET | `/api/miembros/jugadores` | Solo jugadores |
| GET | `/api/miembros/entrenadores` | Solo entrenadores |

## 🎯 Próximos Pasos

1. ✅ Implementar autenticación completa con JWT
2. ✅ Crear servicio de usuarios y roles
3. ✅ Añadir filtro JWT para validar tokens
4. ⏳ Tests unitarios y de integración
5. ⏳ Documentación con Swagger/OpenAPI
6. ⏳ Docker y docker-compose
7. ⏳ CI/CD con GitHub Actions

## 📞 Soporte

Para problemas o preguntas, consulta la documentación en `ARCHITECTURE.md` o contacta al equipo de desarrollo.
