@echo off
REM ============================================
REM Script optimizado para iniciar backend
REM con PostgreSQL de DigitalOcean
REM ============================================

cd /d "%~dp0\backend"

echo.
echo [1/3] Compilando backend...
echo.
call mvn clean package -DskipTests -q

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo [2/3] Iniciando Spring Boot...
echo.
echo Configuracion:
echo - Base de datos: PostgreSQL DigitalOcean
echo - Puerto: 8080
echo - Perfil: local
echo.

call mvn spring-boot:run -Dspring-boot.run.profiles=local -q

pause
