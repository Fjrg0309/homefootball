@echo off
REM ======================================================
REM Verificar compilación de Backend y Frontend
REM ======================================================

echo.
echo ==========================================
echo   VERIFICACION DE COMPILACION
echo ==========================================
echo.

REM ========== BACKEND ==========
echo [1/2] Verificando Backend...
echo.
cd backend

echo Compilando con Maven...
call mvn clean compile -DskipTests

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Backend fallo en compilacion
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Backend compila correctamente
echo.

cd ..

REM ========== FRONTEND ==========
echo [2/2] Verificando Frontend...
echo.
cd frontend

echo Instalando dependencias (si es necesario)...
if not exist "node_modules\" (
    call npm install
)

echo.
echo Verificando compilacion TypeScript...
call npm run build -- --configuration production

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Frontend fallo en compilacion
    echo.
    cd ..
    pause
    exit /b 1
)

echo.
echo [OK] Frontend compila correctamente
echo.

cd ..

echo.
echo ==========================================
echo   VERIFICACION COMPLETADA EXITOSAMENTE
echo ==========================================
echo.
echo Backend: OK
echo Frontend: OK
echo.
pause
