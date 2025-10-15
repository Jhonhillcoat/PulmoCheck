# 🌐 Cómo Subir PulmoCheck a Internet (FÁCIL)

Esta es la forma **MÁS SIMPLE** de tener tu aplicación online y accesible desde cualquier computadora.

---

## 🎯 Opción Recomendada: Render.com

✅ **100% GRATIS**  
✅ No requiere tarjeta de crédito  
✅ HTTPS automático  
✅ 15 minutos de configuración  

---

## 📋 PASO 1: Crear Cuenta en GitHub

### 1.1 Ir a GitHub
- Abre: https://github.com
- Clic en **"Sign up"**
- Crea tu cuenta (es gratis)

### 1.2 Descargar Git (si no lo tienes)
- Windows: https://git-scm.com/download/win
- Instalar con opciones por defecto

---

## 📤 PASO 2: Subir tu Código a GitHub

### 2.1 Abrir PowerShell en C:\PulmoCheck

```powershell
# Navegar a la carpeta
cd C:\PulmoCheck

# Configurar Git (usa tu info)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "PulmoCheck MVP - Initial commit"
```

### 2.2 Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre del repositorio: **pulmocheck**
3. Descripción: **Plataforma de detección temprana de cáncer de pulmón**
4. **Público** (para usar Render gratis)
5. **NO** marques "Initialize with README"
6. Clic en **"Create repository"**

### 2.3 Conectar y Subir

GitHub te mostrará comandos, usa estos (reemplaza TU-USUARIO):

```powershell
git remote add origin https://github.com/TU-USUARIO/pulmocheck.git
git branch -M main
git push -u origin main
```

Te pedirá usuario y contraseña de GitHub.

✅ ¡Tu código ya está en GitHub!

---

## 🚀 PASO 3: Desplegar en Render.com

### 3.1 Crear Cuenta en Render

1. Ve a: https://render.com
2. Clic en **"Get Started"**
3. Selecciona **"Sign up with GitHub"**
4. Autoriza Render a acceder a tu GitHub

### 3.2 Desplegar el BACKEND

1. En el Dashboard de Render, clic en **"New +"**
2. Selecciona **"Web Service"**
3. Busca y selecciona tu repositorio **"pulmocheck"**
4. Configuración:

```
Name: pulmocheck-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn --bind 0.0.0.0:$PORT app:app
Instance Type: Free
```

5. En **"Advanced"**, agrega Variables de Entorno:
   - Click "Add Environment Variable"
   - `FLASK_ENV` = `production`
   - `FLASK_DEBUG` = `0`

6. Clic en **"Create Web Service"**

7. **Espera 3-5 minutos** mientras se despliega

8. **COPIA LA URL** que te da (algo como: `https://pulmocheck-api.onrender.com`)

### 3.3 Desplegar el FRONTEND

1. De nuevo en Dashboard, clic en **"New +"**
2. Selecciona **"Static Site"**
3. Selecciona tu repositorio **"pulmocheck"**
4. Configuración:

```
Name: pulmocheck
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

5. En **"Advanced"**, agrega Variable de Entorno:
   - `REACT_APP_API_URL` = `https://pulmocheck-api.onrender.com/api`
   - (Usa la URL del backend que copiaste antes)

6. Clic en **"Create Static Site"**

7. **Espera 3-5 minutos**

8. **¡LISTO!** Tu frontend estará en: `https://pulmocheck.onrender.com`

---

## 🔧 PASO 4: Configurar CORS

### 4.1 Actualizar Backend

En tu computadora, edita `backend/app.py`:

Busca la línea:
```python
CORS(app)
```

Cámbiala por (usa TU URL del frontend):
```python
CORS(app, origins=["https://pulmocheck.onrender.com"])
```

### 4.2 Subir Cambios

```powershell
cd C:\PulmoCheck
git add backend/app.py
git commit -m "Update CORS for production"
git push
```

Render **redesplegará automáticamente** en 2-3 minutos.

---

## ✅ PASO 5: ¡Probar tu App Online!

1. Abre en tu navegador: `https://pulmocheck.onrender.com`
2. Prueba crear una evaluación
3. Intenta el login médico: `doctor` / `doctor123`

---

## 📱 Compartir con Otros

Ahora puedes compartir la URL con cualquier persona:

```
https://pulmocheck.onrender.com
```

**¡Funciona desde cualquier dispositivo con internet!**

---

## ⚠️ Limitaciones del Plan Gratuito

- El backend **"duerme"** después de 15 minutos sin uso
- La primera carga después de dormir tarda **30-50 segundos**
- Suficiente para demos y proyectos personales
- Para uso productivo, considera el plan de pago ($7/mes)

---

## 🔄 Actualizar tu App

Cada vez que hagas cambios:

```powershell
cd C:\PulmoCheck

# Editar tus archivos...

git add .
git commit -m "Descripción de cambios"
git push
```

Render detecta el push y **redespliega automáticamente**.

---

## 🎨 Personalizar el Dominio (Opcional)

### Con tu Propio Dominio

Si tienes un dominio (ej: miapp.com):

1. En Render, ve a tu frontend → Settings
2. En "Custom Domain", clic en "Add"
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS
5. Render configurará SSL automáticamente

---

## 🐛 Solución de Problemas

### Backend no inicia

1. Ve a Render Dashboard
2. Clic en tu backend service
3. Ve a la pestaña **"Logs"**
4. Busca errores rojos

Errores comunes:
- Falta `gunicorn` en requirements.txt ✅ (ya incluido)
- Error en app.py → revisa el código
- Timeout → aumenta timeout en Settings

### Frontend no conecta al backend

1. Verifica que la URL del backend esté correcta
2. En Render → Frontend → Environment
3. Verifica: `REACT_APP_API_URL`
4. Debe terminar en `/api`

### Error 503

El backend está "dormido":
- Espera 30-50 segundos
- Refresca la página
- Es normal en el plan gratuito

---

## 💰 Actualizar a Plan de Pago (Opcional)

Si necesitas que nunca "duerma":

1. Render: $7/mes por servicio
2. Railway: $5 de crédito mensual (gratis)
3. DigitalOcean: $6/mes VPS

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

1. Render Dashboard
2. Clic en tu servicio
3. Pestaña **"Logs"**
4. Activa "Auto-scroll"

### Ver Requests

En los logs verás cada request que llega:
```
GET /api/health - 200
POST /api/assessment - 201
```

---

## 🔒 Seguridad

**IMPORTANTE antes de uso productivo:**

1. Cambiar credenciales del médico demo
2. Implementar autenticación real (JWT)
3. Habilitar rate limiting
4. Configurar backups de base de datos
5. Añadir monitoring (Sentry, New Relic)
6. Revisar compliance HIPAA/GDPR

---

## 📞 URLs de Ejemplo

Después del deployment tendrás:

```
Frontend: https://pulmocheck.onrender.com
Backend: https://pulmocheck-api.onrender.com
API Docs: https://pulmocheck-api.onrender.com/api/health
```

---

## 🎉 ¡Felicitaciones!

Tu aplicación ya está en internet y accesible desde cualquier lugar del mundo.

Puedes:
- Compartir el link con colegas
- Probarla desde tu celular
- Hacer demos en presentaciones
- Usarla como portfolio

---

**¿Preguntas? Revisa DEPLOYMENT.md para opciones avanzadas.**

