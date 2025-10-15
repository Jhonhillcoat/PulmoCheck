@echo off
echo ========================================
echo   PulmoCheck - Iniciando Aplicacion
echo ========================================
echo.

echo [1/3] Iniciando Backend Flask...
start cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak >nul

echo [2/3] Iniciando Frontend React...
start cmd /k "cd frontend && npm start"

echo.
echo [3/3] Listo!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

