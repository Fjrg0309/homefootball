# 🚀 Guía de Inicio del Backend - HomeFootball

## ✅ Soluciones Aplicadas

### 1. **Puerto 8080 Configurado**
- El servidor ahora inicia en el puerto 8080 (puerto por defecto)
- Si tienes conflictos, puedes cambiarlo en `application-dev.properties`

### 2. **Sistema de Caché Implementado** 🎯
- **Caché de 24 horas** para todas las peticiones a la API de Football
- **Ahorra peticiones** a la API (límite: 100 peticiones/día en plan free)
- Los datos se guardan automáticamente en memoria
- Configuración en: `CacheConfig.java`

#### Métodos con caché activado:
- ✅ `getLeagueById()` - Caché por ID de liga
- ✅ `getTeamsByLeague()` - Caché por liga y temporada
- ✅ `getTeamById()` - Caché por ID de equipo
- ✅ `getPlayersByTeam()` - Caché por equipo y temporada
- ✅ `getStandings()` - Caché de clasificaciones
- ✅ `getFixturesByLeague()` - Caché de partidos

### 3. **Gestión de Credenciales Segura** 🔒
Las credenciales NO están en el código, están en archivos locales:
- `src/main/resources/.env` - Variables de entorno (gitignored)
- `src/main/resources/application-dev.properties` - Perfil de desarrollo (gitignored)

---

## 🏃 Cómo Iniciar el Backend

### **Opción 1: Script Automático (Recomendado)**

Ejecuta desde la raíz del proyecto:

```batch
INICIAR-BACKEND-DEV.bat
```

Este script:
1. ✅ Compila el proyecto
2. ✅ Inicia el servidor con el perfil `dev`
3. ✅ Carga las credenciales automáticamente

###  **Opción 2: Maven Manual**

Desde el directorio `backend/`:

```bash
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```

### **Opción 3: Con Variables de Entorno**

Si prefieres usar el perfil por defecto con variables de entorno:

```powershell
.\INICIAR-BACKEND-CON-ENV.ps1
```

---

## 🔍 Verificar que funciona

1. **Espera 1-2 minutos** (compilación + inicio)
2. Abre tu navegador en: http://localhost:8080
3. Prueba el endpoint de salud: http://localhost:8080/actuator/health

---

## 📊 Beneficios del Sistema de Caché

### Antes (Sin caché):
```
Petición 1: GET /api/teams/league/140/season/2024 → API-Football ❌ (1 petición gastada)
Petición 2: GET /api/teams/league/140/season/2024 → API-Football ❌ (2 peticiones gastadas)
Petición 3: GET /api/teams/league/140/season/2024 → API-Football ❌ (3 peticiones gastadas)
```

### Ahora (Con caché):
```
Petición 1: GET /api/teams/league/140/season/2024 → API-Football ❌ (1 petición gastada) → Guardado en caché
Petición 2: GET /api/teams/league/140/season/2024 → Caché ✅ (0 peticiones gastadas)
Petición 3: GET /api/teams/league/140/season/2024 → Caché ✅ (0 peticiones gastadas)
...
(válido por 24 horas)
```

**Resultado:** De 100 peticiones → Usas solo 5-10 al día! 🎉

---

## 🛠️ Solución de Problemas

### Error: "Port 8080 already in use"
```powershell
# Detener proceso que usa el puerto 8080
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
```

### Error: "Driver claims to not accept jdbcUrl"
✅ **Solucionado** - Ahora usa `application-dev.properties` con credenciales directas

### Error de compilación
```bash
cd backend
mvn clean install
```

---

## 📝 Configuración de Caché

Ubicación: `backend/src/main/java/com/example/information/config/CacheConfig.java`

```java
// Configuración actual:
- Tamaño máximo: 1000 entradas
- Expiración: 24 horas
- Cachés: leagues, teams, players, fixtures, standings, teamStats
```

Para cambiar la duración del caché:
```java
.expireAfterWrite(24, TimeUnit.HOURS) // Cambia el número
```

---

## 🔐 Seguridad

Los siguientes archivos **NO se suben a Git** (están en `.gitignore`):
- ✅ `application-dev.properties`
- ✅ `application-local.properties`
- ✅ `application-prod.properties`
- ✅ `.env`

**NUNCA** subas estos archivos a GitHub!

---

## 📞 Soporte

Si el servidor no inicia:
1. Verifica que tienes Java 17
2. Verifica que Maven está instalado
3. Revisa los logs en la consola
4. Verifica que el puerto 8080 esté libre

---

**¡Listo para desarrollar!** 🎉
