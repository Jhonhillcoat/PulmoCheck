# 🎉 Frontend Desplegado en Firebase

## ✅ Lo que ya hiciste:

- ✅ Frontend desplegado en Firebase
- ✅ URL: https://pulmocheck-96f8f.web.app
- ✅ CDN de Google activo
- ✅ SSL/HTTPS funcionando

---

## 🔧 Próximo Paso: Desplegar el Backend

### Opción Recomendada: Render.com (GRATIS)

#### 1. Subir código a GitHub

Si aún no lo hiciste:

```bash
cd C:\PulmoCheck

git init
git add .
git commit -m "PulmoCheck - Frontend en Firebase"

# Crear repo en: https://github.com/new
# Nombre: pulmocheck

git remote add origin https://github.com/TU-USUARIO/pulmocheck.git
git branch -M main
git push -u origin main
```

#### 2. Desplegar Backend en Render

1. Ve a: https://render.com
2. Sign up con GitHub
3. New + → Web Service
4. Selecciona repo: pulmocheck
5. Configuración:
   ```
   Name: pulmocheck-api
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn --bind 0.0.0.0:$PORT app:app
   ```
6. Variables de entorno:
   - `FLASK_ENV` = `production`
7. Create Web Service
8. **COPIA la URL** (ej: https://pulmocheck-api.onrender.com)

#### 3. Conectar Frontend con Backend

En tu computadora:

```bash
cd C:\PulmoCheck\frontend

# Editar src/api.js
# Cambiar:
const API_BASE_URL = 'http://localhost:5000/api';

# Por:
const API_BASE_URL = 'https://pulmocheck-api.onrender.com/api';
```

#### 4. Actualizar CORS en Backend

Editar `backend/app.py`:

```python
# Buscar:
CORS(app)

# Cambiar por:
CORS(app, origins=["https://pulmocheck-96f8f.web.app"])
```

Subir cambios:
```bash
git add .
git commit -m "Update API URL and CORS"
git push
```

Render redesplegará automáticamente.

#### 5. Redeploy Frontend

```bash
cd C:\PulmoCheck\frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## ✅ Resultado Final

Después de completar estos pasos:

```
Frontend: https://pulmocheck-96f8f.web.app (Firebase)
Backend: https://pulmocheck-api.onrender.com (Render)
Costo: $0/mes
Performance: ⚡⚡⚡⚡⚡
```

---

## 🔄 Actualizar en el Futuro

### Frontend:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Backend:
```bash
git add .
git commit -m "Cambios"
git push
# Render redespliega automático
```

---

## 📱 Compartir tu App

Una vez completado todo:
- Comparte: https://pulmocheck-96f8f.web.app
- Login médico: doctor / doctor123
- ¡Funciona en cualquier dispositivo!

---

## 🆘 Ayuda

Si necesitas ayuda:
- Backend en Render: Ver `SUBIR_A_INTERNET.md`
- Más sobre Firebase: Ver `FIREBASE_DEPLOYMENT.md`
- Comparar opciones: Ver `CUAL_ELEGIR.md`

