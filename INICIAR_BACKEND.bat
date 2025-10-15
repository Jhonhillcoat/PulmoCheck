@echo off
echo ========================================
echo   Iniciando Backend de PulmoCheck
echo ========================================
echo.
cd backend
call venv\Scripts\activate.bat
python app.py
pause

