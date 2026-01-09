@echo off
cd /d "%~dp0"
echo Compilando con Maven...
mvn clean compile > compile-output.txt 2>&1
echo.
echo ====================================
echo Resultado de la compilacion:
echo ====================================
type compile-output.txt
echo.
pause
