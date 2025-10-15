#!/bin/bash

echo "========================================"
echo "  PulmoCheck - Iniciando Aplicación"
echo "========================================"
echo ""

echo "[1/3] Iniciando Backend Flask..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

sleep 3

echo "[2/3] Iniciando Frontend React..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "[3/3] ¡Listo!"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Para detener los servicios, presiona Ctrl+C"
echo ""

# Esperar a que se termine
wait $BACKEND_PID $FRONTEND_PID

