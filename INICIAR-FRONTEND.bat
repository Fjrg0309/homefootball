@echo off
echo ========================================
echo    INICIANDO FRONTEND - ANGULAR
echo ========================================
echo.
echo Asegurate de tener Node.js y npm instalados
echo El frontend se ejecutara en: http://localhost:4200
echo.

cd frontend

echo Instalando dependencias (si es necesario)...
call npm install

echo.
echo Iniciando servidor de desarrollo...
call npm start

pause
