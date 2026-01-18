@echo off
echo ==========================================
echo    INICIANDO BACKEND EN PUERTO 8081
echo ==========================================
echo.

cd /d "%~dp0backend"

echo Iniciando con perfil 'local'...
echo El servidor estara disponible en: http://localhost:8081
echo.
echo Presiona Ctrl+C para detener el servidor.
echo ==========================================
echo.

mvn spring-boot:run -Dspring-boot.run.profiles=local

pause
