@echo off
echo ========================================
echo  COMPILAR Y VERIFICAR CAMBIOS
echo ========================================
echo.

cd backend

echo [1/2] Compilando backend...
call mvn clean compile -DskipTests -q

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Fallo en compilacion
    pause
    exit /b 1
)

echo [2/2] Probando endpoint...
timeout /t 2 >nul
curl "http://localhost:8080/api/football/fixtures/round?league=140&season=2022&round=Regular%%20Season%%20-%%2038" 2>nul | findstr /C:"results"

echo.
echo ========================================
echo  COMPILACION COMPLETADA
echo ========================================
echo.
echo Refresca el navegador (Ctrl+F5) para ver los cambios
pause
