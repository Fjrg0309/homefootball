@echo off
echo ====================================
echo Iniciando backend en modo PRODUCCION
echo Conectando a PostgreSQL de DigitalOcean
echo ====================================
cd /d "%~dp0"
java -jar -Dspring.profiles.active=prod target\homefootball-0.0.1-SNAPSHOT.jar
pause
