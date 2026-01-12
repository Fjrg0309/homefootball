# 🔧 Configuración de Variables de Entorno en Digital Ocean

## ⚠️ IMPORTANTE - ANTES DE DESPLEGAR

Digital Ocean necesita las variables de entorno configuradas. El backend NO funcionará sin ellas.

## 📋 Variables Requeridas

### 1. Ir a Digital Ocean App Platform

1. Abre tu aplicación en Digital Ocean
2. Ve a **Settings** (Configuración)
3. Busca **App-Level Environment Variables** o **Component-Level Environment Variables**
4. Haz clic en **Edit**

### 2. Agregar estas Variables de Entorno

⚠️ **NOTA**: Reemplaza los valores de ejemplo con tus credenciales reales (disponibles en el archivo `.env` local)

```plaintext
DB_URL=jdbc:postgresql://your-db-host.ondigitalocean.com:25060/homefootballdb?sslmode=require
DB_USERNAME=tu-usuario-db
DB_PASSWORD=tu-password-db
API_FOOTBALL_KEY=tu-api-key-de-football
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
```

**Para el Frontend**, además necesitas:
```plaintext
BACKEND_URL=https://tu-backend-app.ondigitalocean.app
```
*(Obtén esta URL después de que el backend esté desplegado)*

### 3. Aplicar Cambios

1. Haz clic en **Save**
2. Digital Ocean te preguntará si quieres redesplegar
3. Haz clic en **Deploy** para aplicar los cambios

## 🔍 Verificar que las Variables Están Configuradas

En Digital Ocean, ve a:
- **Settings** → **Environment Variables**
- Deberías ver las 5 variables listadas

## 🐛 Solución de Problemas

### Error: "Failed to configure a DataSource"
**Causa**: Las variables de entorno de base de datos no están configuradas.  
**Solución**: Verifica que DB_URL, DB_USERNAME y DB_PASSWORD estén en Digital Ocean.

### Error: "Build failed - no such file or directory"
**Causa**: Dockerfile anticuado que esperaba JAR pre-compilado.  
**Solución**: Ya está solucionado con el nuevo Dockerfile multi-stage.

### Error: "Connection refused"
**Causa**: La base de datos no acepta conexiones desde Digital Ocean.  
**Solución**: Verifica que tu base de datos en Digital Ocean permite conexiones desde App Platform.

## 📝 Nota de Seguridad

⚠️ **RECUERDA**: Después del primer despliegue exitoso, debes rotar estas credenciales:
1. Cambia la contraseña de la base de datos
2. Genera una nueva API key de Football API
3. Actualiza las variables de entorno en Digital Ocean
