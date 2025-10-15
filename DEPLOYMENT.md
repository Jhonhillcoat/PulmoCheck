# 🚀 Guía de Deployment de PulmoCheck

Esta guía te ayudará a desplegar PulmoCheck en un servidor accesible desde internet.

---

## 🎯 Opciones de Deployment

### Opción 1: Render.com (RECOMENDADA - GRATIS) ⭐
✅ Gratis para proyectos personales  
✅ Muy fácil de configurar  
✅ SSL/HTTPS automático  
✅ No requiere tarjeta de crédito  

### Opción 2: Railway.app (FÁCIL - GRATIS)
✅ $5 de crédito gratis mensual  
✅ Deploy con un clic  
✅ Base de datos incluida  

### Opción 3: Vercel + Render (SEPARADO)
✅ Frontend en Vercel (gratis)  
✅ Backend en Render (gratis)  
✅ Muy rápido  

### Opción 4: VPS (DigitalOcean, AWS, etc.)
💰 Desde $5/mes  
⚙️ Control total  
🔧 Requiere configuración  

---

# 📦 OPCIÓN 1: RENDER.COM (LA MÁS FÁCIL)

## Preparación

### 1. Crear cuenta en GitHub (si no tienes)
Ve a https://github.com y crea una cuenta gratuita.

### 2. Subir el proyecto a GitHub

En PowerShell (en la carpeta C:\PulmoCheck):

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - PulmoCheck MVP"

# Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre: pulmocheck
# Público o Privado
# NO inicialices con README

# Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/pulmocheck.git

# Subir el código
git branch -M main
git push -u origin main
```

### 3. Crear cuenta en Render
Ve a https://render.com y regístrate con tu cuenta de GitHub.

---

## Desplegar Backend en Render

### 1. Crear Web Service

1. En Render Dashboard, clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub `pulmocheck`
3. Configuración:
   - **Name:** `pulmocheck-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
   - **Plan:** Free

### 2. Variables de Entorno

En la sección "Environment", agrega:

```
FLASK_ENV=production
FLASK_DEBUG=0
```

### 3. Deploy

- Clic en **"Create Web Service"**
- Espera 3-5 minutos
- Tu backend estará en: `https://pulmocheck-backend.onrender.com`

---

## Desplegar Frontend en Render

### 1. Crear Static Site

1. En Render Dashboard, clic en **"New +"** → **"Static Site"**
2. Selecciona el mismo repositorio
3. Configuración:
   - **Name:** `pulmocheck-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

### 2. Variables de Entorno

Agrega:
```
REACT_APP_API_URL=https://pulmocheck-backend.onrender.com/api
```

### 3. Deploy

- Clic en **"Create Static Site"**
- Espera 3-5 minutos
- Tu frontend estará en: `https://pulmocheck-frontend.onrender.com`

---

## Configuración Final

### Actualizar CORS en el Backend

En `backend/app.py`, cambia la línea de CORS:

```python
CORS(app, origins=["https://pulmocheck-frontend.onrender.com"])
```

Y haz commit:

```bash
git add backend/app.py
git commit -m "Update CORS for production"
git push
```

Render redesplegará automáticamente.

---

# 📦 OPCIÓN 2: RAILWAY.APP

## Pasos

### 1. Crear cuenta en Railway
Ve a https://railway.app y regístrate con GitHub.

### 2. Deploy desde GitHub

1. Clic en **"New Project"**
2. **"Deploy from GitHub repo"**
3. Selecciona tu repositorio `pulmocheck`

### 3. Configurar Servicios

Railway detectará automáticamente Python y Node.js.

**Backend:**
- Variables de entorno:
  ```
  FLASK_ENV=production
  ```
- Puerto: 5000

**Frontend:**
- Variables de entorno:
  ```
  REACT_APP_API_URL=https://tu-backend.railway.app/api
  ```

### 4. Obtener URLs

Railway te dará URLs automáticas como:
- Backend: `pulmocheck-backend.up.railway.app`
- Frontend: `pulmocheck-frontend.up.railway.app`

---

# 📦 OPCIÓN 3: VERCEL (FRONTEND) + RENDER (BACKEND)

## Frontend en Vercel

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
cd frontend
vercel

# Sigue las instrucciones:
# - Link to existing project? No
# - Project name: pulmocheck
# - Directory: ./
# - Override settings? No
```

### 3. Configurar Variable de Entorno

En el dashboard de Vercel:
1. Ve a tu proyecto
2. Settings → Environment Variables
3. Agrega:
   - Name: `REACT_APP_API_URL`
   - Value: `https://tu-backend.onrender.com/api`

## Backend en Render

Sigue los pasos de la Opción 1 para el backend.

---

# 📦 OPCIÓN 4: VPS PROPIO (DigitalOcean, AWS, etc.)

## Requisitos
- Servidor Linux (Ubuntu 22.04 recomendado)
- IP pública
- Dominio (opcional pero recomendado)

## Pasos

### 1. Conectarse al servidor

```bash
ssh root@tu-servidor-ip
```

### 2. Instalar dependencias

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Python, Node.js, Nginx
apt install -y python3-pip python3-venv nodejs npm nginx certbot python3-certbot-nginx

# Instalar PM2 para Node.js
npm install -g pm2
```

### 3. Clonar el proyecto

```bash
cd /var/www
git clone https://github.com/TU-USUARIO/pulmocheck.git
cd pulmocheck
```

### 4. Configurar Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Crear servicio systemd
nano /etc/systemd/system/pulmocheck-backend.service
```

Contenido del archivo:

```ini
[Unit]
Description=PulmoCheck Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/pulmocheck/backend
Environment="PATH=/var/www/pulmocheck/backend/venv/bin"
ExecStart=/var/www/pulmocheck/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app

[Install]
WantedBy=multi-user.target
```

```bash
# Iniciar servicio
systemctl enable pulmocheck-backend
systemctl start pulmocheck-backend
```

### 5. Configurar Frontend

```bash
cd /var/www/pulmocheck/frontend

# Crear archivo .env
echo "REACT_APP_API_URL=https://tu-dominio.com/api" > .env

# Build
npm install
npm run build
```

### 6. Configurar Nginx

```bash
nano /etc/nginx/sites-available/pulmocheck
```

Contenido:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /var/www/pulmocheck/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Habilitar sitio
ln -s /etc/nginx/sites-available/pulmocheck /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 7. Configurar SSL (HTTPS)

```bash
certbot --nginx -d tu-dominio.com
```

---

# 🔧 Archivos Necesarios para Deployment

## Procfile (para Heroku/Railway)

Crear `backend/Procfile`:

```
web: gunicorn app:app
```

## render.yaml (para Render)

Crear en la raíz:

```yaml
services:
  - type: web
    name: pulmocheck-backend
    env: python
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && python app.py
    envVars:
      - key: FLASK_ENV
        value: production

  - type: web
    name: pulmocheck-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
```

---

# ✅ Checklist Post-Deployment

- [ ] Backend responde en /api/health
- [ ] Frontend carga correctamente
- [ ] Se pueden crear evaluaciones
- [ ] Se pueden subir imágenes
- [ ] Login médico funciona
- [ ] Se generan PDFs
- [ ] HTTPS está habilitado
- [ ] CORS configurado correctamente

---

# 🔒 Seguridad en Producción

**IMPORTANTE:** Antes de usar en producción real:

1. Cambiar credenciales médicas por defecto
2. Implementar autenticación JWT
3. Habilitar rate limiting
4. Configurar backups de base de datos
5. Implementar logging y monitoring
6. Revisar compliance HIPAA/GDPR
7. Contratar penetration testing

---

# 📊 Costos Aproximados

| Opción | Costo Mensual | Recursos |
|--------|---------------|----------|
| Render Free | $0 | 512MB RAM, sleep after 15min |
| Railway Free | $0 | $5 crédito/mes |
| Vercel + Render | $0 | Ilimitado para hobby |
| DigitalOcean | $6 | 1GB RAM, 25GB SSD |
| AWS Lightsail | $5 | 512MB RAM, 20GB SSD |
| Heroku | $7 | 512MB RAM (ya no free tier) |

---

# 🆘 Problemas Comunes

### Backend no inicia
- Revisa logs: `render dashboard → logs`
- Verifica que requirements.txt esté completo
- Asegúrate que app.py use port binding correcto

### Frontend no conecta al backend
- Verifica REACT_APP_API_URL
- Revisa CORS en backend
- Asegúrate que el backend esté corriendo

### Imágenes no se suben
- Verifica permisos de escritura
- Usa almacenamiento externo (AWS S3, Cloudinary)
- Aumenta límite de tamaño en nginx

---

**Recomendación Final:** Comienza con **Render.com** (Opción 1) por su facilidad y porque es completamente gratis para empezar.

