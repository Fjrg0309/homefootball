# Actuator y Swagger - Configuración

## ✅ Configuración Completada

Se han configurado correctamente **Spring Boot Actuator** y **Swagger (OpenAPI)** en tu aplicación.

## 📦 Dependencias Agregadas

### Spring Boot Actuator
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### SpringDoc OpenAPI (Swagger)
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

## 🔧 Configuración en application.properties

### Actuator Endpoints Expuestos:
- `health` - Estado de salud de la aplicación
- `info` - Información de la aplicación
- `metrics` - Métricas de rendimiento
- `env` - Variables de entorno
- `loggers` - Configuración de logs
- `httptrace` - Trazas HTTP
- `beans` - Beans de Spring
- `mappings` - Mapeo de endpoints

### Swagger/OpenAPI:
- Documentación API: `/api-docs`
- Interfaz Swagger UI: `/swagger-ui.html`
- Ordenamiento: Por método y tag alfabético
- Try It Out: Habilitado

## 🌐 Endpoints Disponibles

### Actuator
Accede a los endpoints de Actuator en:
```
http://localhost:8080/actuator
http://localhost:8080/actuator/health
http://localhost:8080/actuator/info
http://localhost:8080/actuator/metrics
http://localhost:8080/actuator/env
http://localhost:8080/actuator/loggers
http://localhost:8080/actuator/beans
http://localhost:8080/actuator/mappings
```

### Swagger UI
Accede a la documentación interactiva de tu API en:
```
http://localhost:8080/swagger-ui.html
```

### OpenAPI Docs (JSON)
Obtén la especificación OpenAPI en formato JSON:
```
http://localhost:8080/api-docs
```

## 🔐 Seguridad

- Todos los endpoints de Actuator están públicamente accesibles
- Swagger UI es público para facilitar el desarrollo
- La configuración incluye soporte para autenticación JWT Bearer

### ⚠️ Importante para Producción
En producción, debes restringir el acceso a Actuator:

```properties
# Solo exponer health y info en producción
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=never
```

## 🚀 Cómo Usar

### 1. Compilar el proyecto
```bash
mvn clean install
```

### 2. Iniciar la aplicación
```bash
mvn spring-boot:run
```

### 3. Verificar Actuator
Abre en tu navegador:
```
http://localhost:8080/actuator/health
```

Deberías ver:
```json
{
  "status": "UP"
}
```

### 4. Verificar Swagger
Abre en tu navegador:
```
http://localhost:8080/swagger-ui.html
```

Verás la documentación interactiva de tu API con:
- Lista de todos los endpoints
- Esquemas de datos
- Posibilidad de probar los endpoints directamente

## 📝 Características de Swagger

### Autenticación JWT
La configuración incluye soporte para JWT. Para usar endpoints protegidos:

1. Haz clic en el botón **"Authorize"** en la parte superior derecha
2. Ingresa tu token JWT en el formato: `Bearer <tu-token>`
3. Haz clic en **"Authorize"**
4. Ahora puedes probar endpoints protegidos

### Probar Endpoints
1. Expande cualquier endpoint
2. Haz clic en **"Try it out"**
3. Ingresa los parámetros necesarios
4. Haz clic en **"Execute"**
5. Verás la respuesta del servidor

## 🎨 Personalización

La configuración de Swagger se encuentra en:
```
backend/src/main/java/com/example/information/config/OpenApiConfig.java
```

Puedes personalizar:
- Título de la API
- Descripción
- Versión
- Información de contacto
- Servidores
- Esquemas de seguridad

## 📊 Monitoreo con Actuator

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

### Métricas de la aplicación
```bash
curl http://localhost:8080/actuator/metrics
```

### Ver una métrica específica
```bash
curl http://localhost:8080/actuator/metrics/jvm.memory.used
curl http://localhost:8080/actuator/metrics/http.server.requests
```

### Ver todos los beans
```bash
curl http://localhost:8080/actuator/beans
```

### Ver todos los mappings de endpoints
```bash
curl http://localhost:8080/actuator/mappings
```

## 🔍 Health Probes (Kubernetes Ready)

La configuración incluye health probes para Kubernetes:
- Liveness: `/actuator/health/liveness`
- Readiness: `/actuator/health/readiness`

## ✨ Siguiente Paso

Inicia tu aplicación y visita:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Actuator**: http://localhost:8080/actuator

¡Todo está listo para usar! 🎉
