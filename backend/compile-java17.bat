@echo off
echo ====================================
echo COMPILAR CON JAVA 17
echo ====================================
echo.
echo IMPORTANTE: Este script usa Java 17
echo Ajusta la ruta JAVA_HOME si es diferente
echo.

REM Ajusta esta ruta según donde instalaste Java 17
set JAVA17_HOME=C:\Program Files\Java\jdk-17

if not exist "%JAVA17_HOME%\bin\java.exe" (
    echo ERROR: No se encontró Java 17 en: %JAVA17_HOME%
    echo.
    echo Por favor, descarga e instala Java 17 desde:
    echo https://corretto.aws/downloads/latest/amazon-corretto-17-x64-windows-jdk.msi
    echo.
    echo Luego edita este archivo y ajusta JAVA17_HOME
    pause
    exit /b 1
)

set JAVA_HOME=%JAVA17_HOME%
set PATH=%JAVA_HOME%\bin;%PATH%

echo Usando Java:
java -version
echo.
echo ====================================
echo Compilando proyecto...
echo ====================================

cd /d "%~dp0"
mvn clean compile

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✓ COMPILACION EXITOSA
    echo ====================================
) else (
    echo.
    echo ====================================
    echo ✗ ERROR EN LA COMPILACION
    echo ====================================
)

pause
