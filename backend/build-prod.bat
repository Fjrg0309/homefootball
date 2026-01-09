@echo off
echo ====================================
echo Compilando backend con PostgreSQL
echo ====================================
cd /d "%~dp0"
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error al compilar
    pause
    exit /b 1
)
echo.
echo ====================================
echo Compilacion exitosa
echo ====================================
pause
