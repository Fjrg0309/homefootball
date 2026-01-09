@echo off
echo ====================================
echo Probando conexión a PostgreSQL
echo ====================================
echo.
echo Base de datos: homefootballdb
echo Host: db-postgresql-lon1-93988-do-user-30736003-0.k.db.ondigitalocean.com
echo Puerto: 25060
echo Usuario: doadmin
echo.
echo Ejecutando: mvn spring-boot:run -Dspring-boot.run.profiles=prod
echo.
cd /d "%~dp0"
mvn spring-boot:run -Dspring-boot.run.profiles=prod
pause
