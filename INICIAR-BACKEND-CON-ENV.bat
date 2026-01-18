@echo off
echo ========================================
echo    INICIANDO BACKEND - API FOOTBALL
echo ========================================
echo.

REM Cargar variables de entorno desde .env
if exist .env (
    echo Cargando variables de entorno desde .env...
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        set "line=%%a"
        REM Ignorar líneas que empiezan con # o están vacías
        if not "!line:~0,1!"=="#" if not "%%a"=="" (
            set "%%a=%%b"
            echo   ✓ %%a cargada
        )
    )
    echo.
) else (
    echo [ERROR] No se encontró el archivo .env
    echo Por favor crea un archivo .env con las variables necesarias
    pause
    exit /b 1
)

echo Verificando variables...
if "%DB_URL%"=="" (
    echo [ERROR] Variable DB_URL no definida
    pause
    exit /b 1
)
echo   ✓ DB_URL: %DB_URL%
echo   ✓ DB_USERNAME: %DB_USERNAME%
echo.

cd backend

echo Compilando y ejecutando con Maven...
call mvn spring-boot:run

pause
