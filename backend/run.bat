@echo off
echo ========================================
echo   Home Football - Spring Boot Backend
echo ========================================
echo.

:menu
echo Selecciona una opcion:
echo 1. Compilar proyecto (mvn clean install)
echo 2. Ejecutar aplicacion (mvn spring-boot:run)
echo 3. Limpiar y ejecutar (clean + run)
echo 4. Ver errores de compilacion (mvn compile)
echo 5. Acceder a H2 Console
echo 6. Salir
echo.

set /p option="Opcion: "

if "%option%"=="1" goto compile
if "%option%"=="2" goto run
if "%option%"=="3" goto cleanrun
if "%option%"=="4" goto check
if "%option%"=="5" goto h2
if "%option%"=="6" goto end

:compile
echo.
echo Compilando proyecto...
call mvn clean install
echo.
pause
goto menu

:run
echo.
echo Ejecutando aplicacion...
echo La aplicacion estara disponible en: http://localhost:8080
echo Presiona Ctrl+C para detener
call mvn spring-boot:run
pause
goto menu

:cleanrun
echo.
echo Limpiando y ejecutando...
call mvn clean install
echo.
echo Iniciando aplicacion...
call mvn spring-boot:run
pause
goto menu

:check
echo.
echo Verificando compilacion...
call mvn compile
echo.
pause
goto menu

:h2
echo.
echo Abriendo H2 Console en el navegador...
echo URL: http://localhost:8080/h2-console
echo.
echo Credenciales:
echo   JDBC URL: jdbc:h2:mem:testdb
echo   Usuario: sa
echo   Password: sa
echo.
start http://localhost:8080/h2-console
pause
goto menu

:end
echo.
echo Hasta luego!
exit
