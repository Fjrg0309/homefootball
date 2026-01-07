# 🔧 Solución de Problemas - API Football

## ⚠️ IMPORTANTE: Sin Datos Actuales

La API de Football **NO contiene información actual** para 2024-2026. Debes usar temporadas anteriores que tengan datos completos.

## ✅ Configuración Correcta

### Temporadas Recomendadas
- ✅ **2023** - Datos completos
- ✅ **2022** - Datos completos  
- ✅ **2021** - Datos completos
- ✅ **2020** - Datos completos
- ❌ **2024** - Sin datos o incompletos
- ❌ **2025** - Sin datos
- ❌ **2026** - Sin datos

### Valores por Defecto Actualizados

El código ahora usa **temporada 2023** por defecto en lugar de 2024.

## 🚫 Errores Comunes y Soluciones

### Error: "No se puede conectar con el servidor"

**Causa:** El backend no está ejecutándose.

**Solución:**
```bash
cd backend
./mvnw spring-boot:run
# o en Windows
mvnw.cmd spring-boot:run
```

Verifica que el backend esté en `http://localhost:8080`

### Error: "No se encontraron partidos para esta liga y temporada"

**Causa:** La temporada seleccionada no tiene datos disponibles.

**Solución:**
1. Cambia a temporada 2023, 2022 o 2021
2. Verifica que el ID de la liga sea correcto
3. Algunas ligas solo tienen datos en ciertas temporadas

### Error: "Error interno del servidor (500)"

**Causa:** La API de Football no tiene datos para esa combinación liga/temporada.

**Solución:**
1. Usa temporada 2023 o anterior
2. Verifica que la liga exista en esa temporada
3. Revisa los logs del backend para más detalles

### Error: "API Key no configurada"

**Causa:** Falta la API key en la configuración.

**Solución:**

Edita `backend/src/main/resources/application.properties`:

```properties
api.football.key=TU_API_KEY_AQUI
api.football.base-url=https://v3.football.api-sports.io
```

Obtén tu API key en: https://dashboard.api-football.com/

### Error: "429 Too Many Requests"

**Causa:** Excediste el límite de 100 peticiones/día del plan gratuito.

**Solución:**
1. Espera 24 horas para que se reinicie el contador
2. Cachea los datos en el frontend
3. Considera actualizar a un plan de pago si necesitas más peticiones

## 📊 Verificar que Todo Funciona

### 1. Verificar Backend

Abre en tu navegador:
```
http://localhost:8080/api/football/status
```

Deberías ver:
```json
{
  "configured": true,
  "message": "API-Football está configurado correctamente"
}
```

### 2. Probar Endpoint de Última Jornada

```
http://localhost:8080/api/football/fixtures/latest-round?league=140&season=2023
```

Deberías ver partidos de La Liga temporada 2023.

### 3. Verificar Frontend

1. Abre el componente de ejemplo en el navegador
2. Selecciona "La Liga (España)"
3. Selecciona temporada "2023"
4. Haz clic en "Cargar Última Jornada"
5. Deberías ver los partidos

## 🔍 Debugging

### Ver Logs del Backend

Los logs te mostrarán exactamente qué está pasando:

```
Ejecutando petición a API-Football: https://v3.football.api-sports.io/fixtures?league=140&season=2023
Petición exitosa a: https://...
Última jornada encontrada: Regular Season - 38
Se encontraron 10 partidos en la última jornada: Regular Season - 38
```

### Verificar Consola del Navegador

En DevTools (F12) → Console, deberías ver:

```
Cargando última jornada de la liga 140 temporada 2023
Respuesta recibida: {results: 10, response: Array(10)}
✅ Se cargaron 10 partidos
```

## 💡 Mejores Prácticas

### 1. Usar Temporadas con Datos

```typescript
// ✅ CORRECTO
this.footballApi.getLatestRound(140, 2023).subscribe(...)

// ❌ INCORRECTO (no hay datos)
this.footballApi.getLatestRound(140, 2024).subscribe(...)
```

### 2. Manejar Errores

```typescript
this.footballApi.getLatestRound(140, 2023).subscribe({
  next: (response) => {
    if (response.response.length === 0) {
      console.warn('No hay datos');
    } else {
      console.log('Datos recibidos:', response);
    }
  },
  error: (err) => {
    console.error('Error:', err.message);
    // Mostrar mensaje al usuario
  }
});
```

### 3. Cachear Datos

```typescript
private cachedFixtures = new Map<string, any>();

loadLatestRound(league: number, season: number) {
  const cacheKey = `${league}-${season}`;
  
  if (this.cachedFixtures.has(cacheKey)) {
    return of(this.cachedFixtures.get(cacheKey));
  }
  
  return this.footballApi.getLatestRound(league, season).pipe(
    tap(data => this.cachedFixtures.set(cacheKey, data))
  );
}
```

## 📋 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] El backend está ejecutándose en http://localhost:8080
- [ ] La API key está configurada en application.properties
- [ ] Estás usando temporada 2023 o anterior
- [ ] El ID de la liga es correcto (La Liga = 140)
- [ ] No has excedido el límite de peticiones (100/día)
- [ ] Tienes conexión a internet
- [ ] Los logs del backend no muestran errores

## 🆘 Obtener Ayuda

Si después de verificar todo sigue sin funcionar:

1. Revisa los logs del backend
2. Abre DevTools en el navegador (F12)
3. Ve a la pestaña Network
4. Intenta hacer la petición
5. Revisa la respuesta HTTP completa
6. Copia el mensaje de error exacto

## 📞 Contacto API Football

- Dashboard: https://dashboard.api-football.com/
- Documentación: https://www.api-football.com/documentation-v3
- Support: info@api-football.com

## 🎯 Resumen Rápido

**Problema:** Error de conexión  
**Solución:** Verifica que el backend esté corriendo

**Problema:** No hay datos  
**Solución:** Usa temporada 2023 o anterior

**Problema:** Demasiadas peticiones  
**Solución:** Espera 24h o implementa cache

**Problema:** API key inválida  
**Solución:** Verifica tu API key en application.properties
