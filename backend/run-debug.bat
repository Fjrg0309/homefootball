@echo off
cd /d "%~dp0"
echo Ejecutando backend con logs detallados...
mvn spring-boot:run > backend-output.log 2>&1
type backend-output.log
pause
