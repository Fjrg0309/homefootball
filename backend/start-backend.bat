@echo off
echo ==========================================
echo       INICIANDO BACKEND SPRING BOOT
echo ==========================================
echo.

REM Configurar Java 21
set JAVA_HOME=C:\Users\usuario\.jdk\jdk-21.0.8
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d "%~dp0"

echo Java version:
java -version
echo.

echo Limpiando y compilando...
call mvn clean compile -DskipTests -q

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: La compilacion ha fallado.
    echo Revisa los errores anteriores.
    pause
    exit /b 1
)

echo.
echo Compilacion exitosa. Iniciando servidor...
echo.
echo El servidor estara disponible en: http://localhost:8080
echo Endpoints de prueba:
echo   - http://localhost:8080/api/football/ping
echo   - http://localhost:8080/api/football/status
echo   - http://localhost:8080/api/football/leagues?id=140 (La Liga)
echo   - http://localhost:8080/api/football/standings?league=140
echo.
echo Presiona Ctrl+C para detener el servidor.
echo ==========================================
echo.

call mvn spring-boot:run

pause
