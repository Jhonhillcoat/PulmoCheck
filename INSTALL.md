# 📦 Guía de Instalación de PulmoCheck

Esta guía te ayudará a instalar y configurar PulmoCheck en tu sistema.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

### Windows
- **Python 3.8 o superior**: [Descargar aquí](https://www.python.org/downloads/)
- **Node.js 14 o superior**: [Descargar aquí](https://nodejs.org/)
- **Git** (opcional): [Descargar aquí](https://git-scm.com/)

### Linux/Mac
```bash
# Verificar versiones instaladas
python3 --version
node --version
npm --version
```

---

## 🔧 Instalación Paso a Paso

### 1. Clonar o Descargar el Proyecto

#### Opción A: Con Git
```bash
git clone <url-del-repositorio>
cd PulmoCheck
```

#### Opción B: Descarga Manual
1. Descargar el ZIP del proyecto
2. Extraer en una carpeta
3. Abrir terminal en esa carpeta

---

### 2. Configurar el Backend

#### Windows
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### Linux/Mac
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

### 3. Configurar el Frontend

Abrir una **nueva terminal** y ejecutar:

```bash
cd frontend
npm install
```

⏱️ Este proceso puede tomar varios minutos dependiendo de tu conexión a internet.

---

### 4. Verificar la Instalación

#### Backend
```bash
cd backend
python app.py
```

Deberías ver:
```
🫁 PulmoCheck API iniciada
📊 Base de datos inicializada
🔐 Usuario demo: doctor / doctor123
 * Running on http://0.0.0.0:5000
```

#### Frontend
En otra terminal:
```bash
cd frontend
npm start
```

El navegador debería abrirse automáticamente en `http://localhost:3000`

---

## 🚀 Ejecución Rápida

### Opción 1: Script Automático (Windows)
```cmd
start.bat
```

### Opción 2: Script Automático (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### Opción 3: Manual (Dos Terminales)

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🔍 Verificar que Todo Funciona

1. **Abrir navegador** en `http://localhost:3000`
2. **Ver página principal** de PulmoCheck
3. **Hacer clic** en "Evaluá tu Riesgo"
4. **Completar el formulario** de prueba
5. **Ver resultados**

### Probar Portal Médico
1. Ir a "Portal Médico" en el menú
2. Iniciar sesión:
   - Usuario: `doctor`
   - Contraseña: `doctor123`
3. Ver dashboard con evaluaciones

---

## ❌ Solución de Problemas

### Error: "python no se reconoce como comando"

**Windows:**
1. Reinstalar Python marcando "Add to PATH"
2. O usar `py` en lugar de `python`

**Linux/Mac:**
```bash
# Usar python3 en lugar de python
python3 app.py
```

### Error: "npm no se reconoce como comando"

Reinstalar Node.js desde [nodejs.org](https://nodejs.org/)

### Error: "Puerto 5000 ya está en uso"

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMERO> /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Error: "Puerto 3000 ya está en uso"

Cuando npm start pregunte, responder `Y` para usar otro puerto.

### Error al instalar dependencias Python

```bash
# Actualizar pip primero
python -m pip install --upgrade pip

# Instalar de nuevo
pip install -r requirements.txt
```

### Error al instalar dependencias npm

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules
rm -rf node_modules
rm package-lock.json

# Instalar de nuevo
npm install
```

---

## 🔄 Actualizar el Proyecto

Si hay una nueva versión:

```bash
# Actualizar código
git pull

# Actualizar backend
cd backend
pip install -r requirements.txt

# Actualizar frontend
cd frontend
npm install
```

---

## 🛑 Detener los Servicios

### Opción 1: Ctrl + C
En cada terminal donde corre un servicio, presionar `Ctrl + C`

### Opción 2: Cerrar Terminales
Simplemente cerrar las ventanas de terminal

---

## 📊 Verificar Base de Datos

La base de datos SQLite se crea automáticamente en:
```
backend/pulmocheck.db
```

Puedes abrirla con herramientas como:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLite Viewer (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite)

---

## 🔐 Datos de Prueba

Al iniciar por primera vez, se crea automáticamente:

**Usuario médico:**
- Usuario: `doctor`
- Contraseña: `doctor123`

Puedes crear evaluaciones de prueba desde la interfaz de paciente.

---

## 📁 Estructura de Archivos Creados

Después de la instalación:
```
PulmoCheck/
├── backend/
│   ├── venv/              # Entorno virtual Python
│   └── uploads/           # Imágenes subidas (se crea al subir)
├── frontend/
│   ├── node_modules/      # Dependencias npm
│   └── build/             # (después de npm build)
└── pulmocheck.db          # Base de datos SQLite
```

---

## 🎯 Próximos Pasos

1. ✅ Instalación completa
2. 📖 Leer el [README.md](README.md) para entender las funcionalidades
3. 🧪 Probar creando evaluaciones de prueba
4. 👨‍⚕️ Explorar el dashboard médico
5. 📥 Generar reportes PDF

---

## 💡 Consejos

- **Desarrollo**: Mantén ambas terminales abiertas mientras trabajas
- **Producción**: Considera usar Gunicorn (backend) y nginx (frontend)
- **Datos**: La base de datos se mantiene entre reinicios
- **Logs**: Revisa la consola para debug

---

## 📞 ¿Necesitas Ayuda?

Si encuentras problemas:
1. Revisar esta guía nuevamente
2. Verificar que todos los prerequisitos estén instalados
3. Revisar la sección de solución de problemas
4. Abrir un issue en el repositorio

---

**¡Bienvenido a PulmoCheck! 🫁**

