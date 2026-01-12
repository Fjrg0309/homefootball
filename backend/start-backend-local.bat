@echo off
echo ====================================
echo Iniciando backend DESARROLLO LOCAL
echo Conectando a PostgreSQL de DigitalOcean
echo ====================================
cd /d "%~dp0"

echo Limpiando y compilando...
call mvn clean compile -DskipTests -q

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: La compilacion ha fallado.
    pause
    exit /b 1
)

echo.
echo Iniciando con perfil local...
call mvn spring-boot:run -Dspring-boot.run.profiles=local

pause
