# 🚀 Guía para Iniciar el Proyecto HomeFootball

## ✅ Estado Actual

### Configuración Verificada
- ✓ Backend compilado exitosamente
- ✓ Base de datos PostgreSQL configurada (DigitalOcean)
- ✓ API Football configurada para temporada 2022-2023
- ✓ Frontend configurado para conectarse a `http://localhost:8080/api`

---

## 📋 Pasos para Iniciar

### **1️⃣ Iniciar el Backend (OBLIGATORIO)**

El backend **DEBE** estar corriendo para que el frontend funcione.

#### Opción A: Usando el JAR compilado (MÁS RÁPIDO) ⚡

Abre una terminal **PowerShell** y ejecuta:

```powershell
cd C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend
java -jar target\homefootball-0.0.1-SNAPSHOT.jar
```

**O simplemente haz doble clic en:**
```
START-BACKEND-SIMPLE.bat
```

#### Opción B: Usando Maven

```powershell
cd C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend
mvn spring-boot:run
```

#### ✅ Verificar que el Backend Está Corriendo

En otra terminal PowerShell ejecuta:

```powershell
netstat -ano | findstr :8080
```

Deberías ver algo como:
```
TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       12345
```

O prueba directamente:

```powershell
Invoke-RestMethod -Uri 'http://localhost:8080/api/football/status'
```

Respuesta esperada:
```json
{
  "configured": true,
  "message": "API Football configurada correctamente"
}
```

---

### **2️⃣ Iniciar el Frontend**

Una vez el backend esté corriendo, en otra terminal:

```powershell
cd C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\frontend
npm start
```

**O haz doble clic en:**
```
INICIAR-FRONTEND.bat
```

El frontend se abrirá en: `http://localhost:4200`

---

## 🏆 Probar la Página de Partidos de LaLiga

Una vez ambos servicios estén activos:

1. Abre tu navegador en: `http://localhost:4200`
2. Navega a: **Partidos → LaLiga**
3. O ve directamente a: `http://localhost:4200/partidos/laliga`

Deberías ver los partidos de la **Jornada 38** de la temporada **2022-2023** de LaLiga.

---

## 🔧 Solución de Problemas

### Error: "Sin conexión. Verifica tu red"

**Causa:** El backend no está corriendo o no está en el puerto 8080.

**Solución:**
1. Verifica que el backend esté corriendo (ver paso 1️⃣)
2. Confirma que no haya errores en la ventana del backend
3. Verifica que el puerto 8080 esté libre

### Error al compilar el backend

Si el JAR no existe o hay errores:

```powershell
cd C:\Users\usuario\Desktop\proyectoindividual\frontend\homefootball\backend
mvn clean package -DskipTests
```

### Error: "Error al cargar los partidos"

**Posibles causas:**

1. **La API Football alcanzó el límite diario (100 peticiones)**
   - Espera hasta mañana
   - La API se resetea a medianoche UTC

2. **Error de conexión a la base de datos**
   - Verifica que las credenciales en `.env` sean correctas
   - Confirma que tienes acceso a Internet

3. **La temporada 2022-2023 ya finalizó**
   - Esto es normal, verás los partidos históricos de la jornada 38

---

## 📝 Información Importante

### Configuración de la API

- **Liga:** LaLiga (ID: 140)
- **Temporada:** 2022-2023 (2022)
- **Última Jornada:** 38
- **Límite API:** 100 peticiones/día

### Puertos Utilizados

- **Backend:** `http://localhost:8080`
- **Frontend:** `http://localhost:4200`
- **Base de Datos:** PostgreSQL en DigitalOcean (puerto 25060)

---

## 🎯 Comandos Rápidos

### Verificar Estado de Puertos
```powershell
netstat -ano | findstr "8080 4200"
```

### Detener Backend (si está en proceso)
Presiona `Ctrl + C` en la terminal donde se ejecuta

### Ver Logs del Backend
Los logs aparecen en la terminal donde se ejecuta el backend

### Limpiar y Recompilar
```powershell
cd backend
mvn clean package -DskipTests
```

---

## 📞 Soporte

Si sigues teniendo problemas:

1. Revisa los logs en la terminal del backend
2. Verifica que Java 17 esté instalado: `java -version`
3. Verifica que Maven esté instalado: `mvn -version`
4. Verifica que Node.js esté instalado: `node -version`

---

✨ **¡Listo! Tu aplicación debería estar funcionando ahora.**
