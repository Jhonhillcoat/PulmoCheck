# ⚡ Quick Start - PulmoCheck

Guía rápida para poner en marcha PulmoCheck en 5 minutos.

---

## 🎯 Lo Esencial

**PulmoCheck** es una plataforma web para detección temprana del cáncer de pulmón con:
- Cuestionario de evaluación de riesgo
- Análisis de imágenes con IA (placeholder)
- Portal médico para revisión de casos

---

## 🚀 Instalación Rápida

### 1️⃣ Backend (Terminal 1)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

✅ Verás: `🫁 PulmoCheck API iniciada`

### 2️⃣ Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

✅ Se abrirá: `http://localhost:3000`

---

## 🎮 Uso Básico

### Como Paciente

1. **Ir a** `http://localhost:3000`
2. **Clic** en "Evaluá tu Riesgo"
3. **Completar** formulario (4 pasos)
4. **Ver** resultados con score de riesgo
5. **Subir** imagen médica (opcional)
6. **Descargar** reporte en PDF

### Como Médico

1. **Ir a** "Portal Médico"
2. **Login:**
   - Usuario: `doctor`
   - Contraseña: `doctor123`
3. **Ver** dashboard con todos los casos
4. **Revisar** casos individuales
5. **Agregar** comentarios médicos
6. **Descargar** reportes

---

## 📁 Archivos Importantes

```
PulmoCheck/
├── backend/app.py          # 🔥 Servidor Flask
├── frontend/src/App.js     # ⚛️ Componente principal React
├── README.md               # 📖 Documentación completa
├── INSTALL.md              # 💾 Guía de instalación
├── DEMO.md                 # 🎬 Guía de demostración
├── start.bat              # 🪟 Script inicio Windows
└── start.sh               # 🐧 Script inicio Linux/Mac
```

---

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "python no se reconoce" | Usar `py` o reinstalar Python |
| "npm no se reconoce" | Reinstalar Node.js |
| Puerto 5000 ocupado | Matar proceso o cambiar puerto en app.py |
| Error de dependencias | `pip install --upgrade pip` |

---

## 📚 Más Información

- **Documentación completa:** [README.md](README.md)
- **Guía de instalación:** [INSTALL.md](INSTALL.md)
- **Cómo hacer una demo:** [DEMO.md](DEMO.md)
- **Arquitectura:** [ARQUITECTURA.md](ARQUITECTURA.md)

---

## 🎯 Siguientes Pasos

1. ✅ Instalación completa
2. 🧪 Crear evaluación de prueba
3. 👨‍⚕️ Probar portal médico
4. 📥 Generar reporte PDF
5. 📖 Leer documentación completa
6. 🚀 Personalizar para tu caso de uso

---

## 💡 Tips

- **Datos de prueba:** Usa valores realistas para ver cálculos precisos
- **Múltiples casos:** Crea varios para ver el dashboard poblado
- **Imágenes:** Cualquier JPG/PNG funciona para la demo
- **Comentarios:** Escribe comentarios médicos detallados para ver en reportes

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa [INSTALL.md](INSTALL.md)
2. Lee sección de troubleshooting
3. Verifica que ambos servicios estén corriendo
4. Revisa la consola en busca de errores

---

**¡Listo para empezar! 🫁**

