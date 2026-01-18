@echo off
REM Script para cargar variables de entorno y ejecutar Spring Boot
REM Uso: run-with-env.bat

echo [96m🔧 Cargando variables de entorno desde src\main\resources\.env...[0m
echo.

REM Verificar que existe .env
if not exist src\main\resources\.env (
    echo [91m❌ ERROR: No se encontró el archivo src\main\resources\.env[0m
    echo [93m📋 Copia .env.example a src\main\resources\.env y configura tus credenciales:[0m
    echo    copy .env.example src\main\resources\.env
    exit /b 1
)

REM Cargar variables desde .env
setlocal enabledelayedexpansion
for /f "usebackq tokens=* delims=" %%a in ("src\main\resources\.env") do (
    set line=%%a
    REM Ignorar líneas vacías y comentarios
    if not "!line!"=="" (
        echo !line! | findstr /r /c:"^#" >nul
        if errorlevel 1 (
            echo !line! | findstr /r /c:"=" >nul
            if not errorlevel 1 (
                set %%a
                for /f "tokens=1 delims==" %%b in ("%%a") do (
                    echo [92m✓ %%b configurada[0m
                )
            )
        )
    )
)

echo.
echo [96m🚀 Iniciando Spring Boot...[0m
echo.

REM Ejecutar Maven
mvn spring-boot:run
