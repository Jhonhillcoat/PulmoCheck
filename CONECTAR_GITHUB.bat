@echo off
echo ========================================
echo   Conectar PulmoCheck con GitHub
echo ========================================
echo.

echo ANTES DE EJECUTAR ESTE SCRIPT:
echo 1. Crea el repo en: https://github.com/new
echo 2. Nombre: pulmocheck
echo 3. Publico (no marques nada mas)
echo.
echo.

set /p usuario="Ingresa tu USUARIO de GitHub: "

echo.
echo Conectando con GitHub...
echo.

git remote add origin https://github.com/%usuario%/pulmocheck.git
git branch -M main

echo.
echo Listo! Ahora subiendo el codigo...
echo.

git push -u origin main

echo.
echo ========================================
echo   EXITO! Codigo subido a GitHub
echo ========================================
echo.
echo Tu repositorio esta en:
echo https://github.com/%usuario%/pulmocheck
echo.
pause

