@echo off
echo ================================================
echo  Iniciando Backend HomeFootball
echo  Temporada configurada: 2022-2023
echo ================================================
echo.

cd /d "%~dp0"

echo Compilando el proyecto...
call mvn clean package -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo Iniciando el servidor Spring Boot...
echo.
echo El backend estara disponible en: http://localhost:8080
echo Presiona Ctrl+C para detener el servidor
echo.

java -jar target\homefootball-0.0.1-SNAPSHOT.jar

pause
