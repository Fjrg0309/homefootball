@echo off
echo ====================================
echo TEST DE CONEXION A POSTGRESQL
echo ====================================
cd /d "%~dp0"
echo.
echo Compilando proyecto de prueba...
call mvn clean test-compile -q
if %ERRORLEVEL% NEQ 0 (
    echo Error al compilar
    pause
    exit /b 1
)
echo.
echo Probando conexión a PostgreSQL en DigitalOcean...
echo.
mvn exec:java -Dexec.mainClass="com.example.information.DatabaseTestApplication" -Dspring.profiles.active=prod -Dexec.classpathScope=test
pause
