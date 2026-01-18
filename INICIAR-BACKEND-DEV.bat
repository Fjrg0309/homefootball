@echo off
echo ========================================
echo    INICIANDO BACKEND - HOMEFOOTBALL
echo ========================================
echo.

cd backend

echo Compilando proyecto...
call mvn clean compile
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Compilacion exitosa!
echo   Iniciando servidor en puerto 8080...
echo   Presiona Ctrl+C para detener
echo ========================================
echo.

call mvn spring-boot:run -Dspring-boot.run.profiles=dev

pause
