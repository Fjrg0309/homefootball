@echo off
echo =============================================
echo   REINICIAR BACKEND CON CAMBIOS
echo =============================================
echo.

REM Ir al directorio del backend
cd /d "%~dp0\backend"

echo [1/3] Deteniendo backend anterior...
taskkill /F /IM java.exe 2>nul
timeout /t 2 >nul

echo.
echo [2/3] Compilando cambios...
call mvn clean package -DskipTests

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando backend...
start "HomeFootball Backend" mvn spring-boot:run -Dspring-boot.run.profiles=local

echo.
echo =============================================
echo   BACKEND REINICIADO
echo =============================================
echo.
echo Backend iniciando en http://localhost:8080
echo Espera 30-60 segundos para que el backend este listo
echo.
echo Prueba: http://localhost:8080/api/football/ping
echo.
pause
