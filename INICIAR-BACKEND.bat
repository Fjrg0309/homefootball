@echo off
echo ========================================
echo    INICIANDO BACKEND - API FOOTBALL
echo ========================================
echo.
echo Asegurate de tener Java instalado (JDK 17 o superior)
echo El backend se ejecutara en: http://localhost:8080
echo.

cd backend

echo Compilando y ejecutando con Maven...
call mvn spring-boot:run

pause
