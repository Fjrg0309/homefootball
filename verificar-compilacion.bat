@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==================================
echo VERIFICACION DE COMPILACION
echo ==================================
echo.

REM Verificar Java
echo 1. Verificando Java...
java -version 2>&1
echo.

REM Verificar Maven
echo 2. Verificando Maven...
mvn --version 2>&1 | findstr /R "Apache Maven"
echo.

REM Compilar Backend
echo 3. Compilando Backend...
cd /d "%~dp0backend"
mvn clean compile
if errorlevel 1 (
    echo.
    echo [ERROR] La compilacion del backend fallo
    cd /d "%~dp0"
    pause
    exit /b 1
) else (
    echo.
    echo [OK] Backend compilado correctamente
)
cd /d "%~dp0"
echo.

REM Verificar Frontend config
echo 4. Verificando configuracion del Frontend...
if exist "frontend\src\assets\config.json" (
    echo [OK] Encontrado config.json
    type "frontend\src\assets\config.json"
) else (
    echo [ERROR] No se encontro config.json
)
echo.

REM Verificar Backend config
echo 5. Verificando configuracion de la BD...
if exist "backend\src\main\resources\application.properties" (
    echo [OK] Encontrado application.properties
    echo.
    findstr /I "datasource.*url.*port.*jpa" "backend\src\main\resources\application.properties"
) else (
    echo [ERROR] No se encontro application.properties
)
echo.

echo ==================================
echo VERIFICACION COMPLETADA
echo ==================================
pause
