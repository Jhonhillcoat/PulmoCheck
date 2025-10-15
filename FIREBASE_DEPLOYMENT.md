# 🔥 Deployment de PulmoCheck en Firebase

Firebase es una plataforma de Google ideal para aplicaciones web con backend. ¡Es una excelente opción!

---

## 🎯 ¿Por qué Firebase?

### Ventajas ✅
- ✅ **Hosting ultrarrápido** (CDN global de Google)
- ✅ **Gratis** hasta cierto límite (muy generoso)
- ✅ **SSL automático** con dominio personalizado
- ✅ **No "duerme"** como Render
- ✅ **Escalable** automáticamente
- ✅ **Base de datos en tiempo real** (Firestore)
- ✅ **Autenticación integrada**
- ✅ **Storage para archivos** (imágenes DICOM)
- ✅ **Backed by Google**

### Desventajas ⚠️
- ⚠️ Requiere **tarjeta de crédito** para Cloud Functions (pero solo pagas lo que usas)
- ⚠️ Requiere adaptar backend Flask a Cloud Functions o usar hosting externo
- ⚠️ Curva de aprendizaje media

---

## 📊 Plan de Costos Firebase

### Spark Plan (GRATIS)
```
✅ Hosting: 10GB storage, 360MB/día transfer
✅ Firestore: 1GB storage, 50K lecturas/día, 20K escrituras/día
✅ Storage: 5GB, 1GB download/día
✅ Authentication: ilimitado
❌ Cloud Functions: NO disponible
```

### Blaze Plan (PAY-AS-YOU-GO)
```
✅ Todo del Spark Plan
✅ Cloud Functions: 2M invocations/mes GRATIS
✅ Luego: $0.40 por millón de invocaciones
💳 Requiere tarjeta (pero NO cobran hasta que excedas límites gratuitos)

Costo estimado para PulmoCheck:
- Demo/Bajo uso: $0-2/mes
- Uso moderado: $3-7/mes
- Alto uso: $10-20/mes
```

---

## 🚀 OPCIÓN 1: Frontend en Firebase + Backend en Render (HÍBRIDA)

**La más fácil y GRATIS**

### Ventajas:
- ✅ 100% gratis
- ✅ Frontend ultra rápido (CDN de Google)
- ✅ Backend en Render (gratis)
- ✅ No requiere adaptar código

### Pasos:

#### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

#### 2. Iniciar Firebase en el proyecto

```bash
cd C:\PulmoCheck

# Login a Firebase
firebase login

# Inicializar proyecto
firebase init

# Selecciona:
# - Hosting
# - Usa proyecto existente o crea uno nuevo en Firebase Console
# - Public directory: frontend/build
# - Single-page app: Yes
# - Set up automatic builds with GitHub: No (por ahora)
```

#### 3. Configurar Frontend

Edita `frontend/src/api.js`:

```javascript
const API_BASE_URL = 'https://tu-backend.onrender.com/api';
```

#### 4. Build y Deploy

```bash
cd frontend
npm run build

cd ..
firebase deploy --only hosting
```

#### 5. Resultado

Tu app estará en: `https://tu-proyecto.web.app`

Frontend en Firebase (rápido) + Backend en Render (gratis) = **¡Mejor de dos mundos!**

---

## 🚀 OPCIÓN 2: TODO en Firebase (Cloud Functions)

**Requiere adaptar backend pero es la solución más completa**

### Preparación

#### 1. Instalar dependencias

```bash
npm install -g firebase-tools
```

#### 2. Actualizar plan a Blaze

1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto
3. Settings → Usage and billing
4. Upgrade to Blaze
5. Agregar tarjeta (NO te cobran hasta exceder límites gratuitos)

#### 3. Inicializar Firebase

```bash
cd C:\PulmoCheck

firebase login
firebase init

# Selecciona:
# - Functions (Node.js)
# - Hosting
# - Firestore (opcional, para base de datos)
# - Storage (opcional, para imágenes)
```

### Adaptar Backend

#### Estructura:
```
functions/
├── index.js          # Cloud Functions
├── app.py           # Tu Flask app (adaptada)
└── package.json
```

#### Opción A: Usar Flask directamente

Crea `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const {spawn} = require('child-process-promise');

exports.api = functions.https.onRequest(async (req, res) => {
  // Ejecutar Flask app
  const promise = spawn('python', ['app.py'], {capture: ['stdout', 'stderr']});
  
  promise.childProcess.stdout.on('data', data => {
    res.write(data.toString());
  });
  
  await promise;
  res.end();
});
```

#### Opción B: Migrar a Node.js (más nativo)

Reescribir endpoints en Node.js con Express:

```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PulmoCheck API is running' });
});

// Endpoint de assessment
app.post('/api/assessment', async (req, res) => {
  try {
    const data = req.body;
    
    // Calcular score (lógica de Python a JavaScript)
    const riskData = calculateRiskScore(data);
    
    // Guardar en Firestore
    const docRef = await db.collection('assessments').add({
      ...data,
      ...riskData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      assessment_id: docRef.id,
      ...riskData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Más endpoints...

exports.api = functions.https.onRequest(app);
```

#### functions/package.json:

```json
{
  "name": "pulmocheck-functions",
  "description": "PulmoCheck Cloud Functions",
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0",
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": "18"
  }
}
```

### Configurar Firestore

#### firebase.json:

```json
{
  "hosting": {
    "public": "frontend/build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

### Deploy

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Deploy todo
firebase deploy
```

---

## 🗄️ OPCIÓN 3: Firebase con Firestore (Migrar de SQLite)

### Ventajas de Firestore:
- Tiempo real (cambios se reflejan instantáneamente)
- Escalabilidad automática
- Offline support
- Queries poderosos

### Migrar datos

#### Estructura en Firestore:

```
assessments/
  {assessment_id}/
    patient_name: "Juan Pérez"
    age: 58
    risk_score: 65
    risk_level: "Moderado"
    created_at: timestamp
    
    comments/
      {comment_id}/
        doctor_name: "Dr. Demo"
        comment: "Revisar..."
        created_at: timestamp

doctors/
  {doctor_id}/
    username: "doctor"
    password_hash: "..."
    name: "Dr. Demo"
```

#### Código de ejemplo (frontend):

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  // ...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Crear assessment
const docRef = await addDoc(collection(db, 'assessments'), {
  patient_name: formData.patient_name,
  age: formData.age,
  risk_score: 65,
  created_at: new Date()
});
```

---

## 📦 OPCIÓN 4: Firebase Storage para Imágenes

### Configurar Storage

#### 1. Habilitar Storage en Firebase Console

#### 2. Reglas de seguridad (storage.rules):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{assessmentId}/{fileName} {
      allow write: if request.auth != null;
      allow read: if request.auth != null || true; // Ajustar según necesites
    }
  }
}
```

#### 3. Subir imágenes desde frontend:

```javascript
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const storage = getStorage();
const storageRef = ref(storage, `uploads/${assessmentId}/${file.name}`);

await uploadBytes(storageRef, file);
```

---

## 🔐 Firebase Authentication

### Para reemplazar login médico simple:

```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

// Login
const userCredential = await signInWithEmailAndPassword(
  auth, 
  email, 
  password
);

// El usuario está autenticado
const user = userCredential.user;
```

---

## 📋 Archivos de Configuración Firebase

### firebase.json (básico):

```json
{
  "hosting": {
    "public": "frontend/build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### .firebaserc:

```json
{
  "projects": {
    "default": "pulmocheck-12345"
  }
}
```

---

## 🚀 Comandos Útiles Firebase

```bash
# Login
firebase login

# Listar proyectos
firebase projects:list

# Seleccionar proyecto
firebase use nombre-proyecto

# Deploy solo hosting
firebase deploy --only hosting

# Deploy solo functions
firebase deploy --only functions

# Deploy todo
firebase deploy

# Ver logs de functions
firebase functions:log

# Abrir proyecto en consola
firebase open

# Servir localmente (testing)
firebase serve
```

---

## 💰 Estimación de Costos Real

### Para PulmoCheck con uso moderado:

```
Hosting: GRATIS (< 10GB, < 360MB/día)
Firestore: GRATIS (< 1GB, < 50K lecturas/día)
Storage: GRATIS (< 5GB)
Functions: 
  - 2M invocaciones/mes: GRATIS
  - Exceso: $0.40/millón
  
Estimado: $0-3/mes para 1000-5000 usuarios/mes
```

---

## 🎯 Recomendación para PulmoCheck

### Mejor Estrategia:

**FASE 1: Empezar Rápido (HOY)**
```
Frontend: Firebase Hosting ⚡
Backend: Render (Flask existente) 🐍
Costo: $0/mes
Tiempo setup: 20 minutos
```

**FASE 2: Optimizar (DESPUÉS)**
```
Frontend: Firebase Hosting ⚡
Backend: Firebase Cloud Functions (migrar a Node.js) ☁️
Base de datos: Firestore 🗄️
Storage: Firebase Storage 📦
Costo: $0-5/mes
Tiempo migración: 2-3 días
```

---

## 🛠️ Implementación Práctica Paso a Paso

### AHORA MISMO (Opción 1 - Híbrida):

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Crear proyecto en Firebase Console
# Ve a: https://console.firebase.google.com
# Clic en "Add project"
# Nombre: pulmocheck

# 4. Inicializar en tu carpeta
cd C:\PulmoCheck
firebase init hosting

# Responde:
# - Use existing project: pulmocheck
# - Public directory: frontend/build
# - Single-page app: Yes
# - Set up automatic builds: No

# 5. Build frontend
cd frontend
npm run build
cd ..

# 6. Deploy
firebase deploy --only hosting

# 7. ¡Listo! Tu URL será:
# https://pulmocheck.web.app
# o
# https://pulmocheck.firebaseapp.com
```

### Configurar API URL:

En `frontend/src/api.js`, cambia:

```javascript
const API_BASE_URL = 'https://tu-backend.onrender.com/api';
```

Rebuild y redeploy:

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## 🌐 Dominio Personalizado

### Gratis con Firebase:

1. Firebase Console → Hosting
2. Add custom domain
3. Ingresa tu dominio (ej: pulmocheck.com)
4. Verifica propiedad (DNS records)
5. Firebase configura SSL automáticamente

---

## 📊 Comparación Final

| Característica | Firebase Only | Firebase + Render | Render Only |
|----------------|---------------|-------------------|-------------|
| **Costo** | $3-7/mes | $0/mes | $0/mes |
| **Speed Frontend** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ⚡⚡⚡ |
| **Backend Sleep** | Nunca | 15 min | 15 min |
| **Facilidad** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Escalabilidad** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡ | ⚡⚡⚡ |
| **Setup Time** | 2-3 días | 20 min | 15 min |

---

## ✅ Checklist de Deployment Firebase

- [ ] Cuenta de Google/Firebase
- [ ] Firebase CLI instalado
- [ ] Proyecto creado en Firebase Console
- [ ] `firebase init` ejecutado
- [ ] Frontend compilado (`npm run build`)
- [ ] Backend desplegado (Render o Cloud Functions)
- [ ] `firebase deploy` ejecutado
- [ ] URL funcionando
- [ ] API conectada correctamente
- [ ] CORS configurado
- [ ] Dominio personalizado (opcional)

---

## 🆘 Troubleshooting Firebase

### Error: "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### Error: "Not authorized"
```bash
firebase logout
firebase login
```

### Error: "Build folder not found"
```bash
cd frontend
npm run build
cd ..
firebase deploy
```

### Error: "CORS"
Asegúrate que tu backend permite el origen de Firebase:
```python
CORS(app, origins=["https://pulmocheck.web.app"])
```

---

## 🎉 Conclusión

**Firebase es una EXCELENTE opción para PulmoCheck:**

✅ **Mejor performance** (CDN de Google)  
✅ **Gratis o muy barato** ($0-7/mes)  
✅ **Escalable** automáticamente  
✅ **Profesional** (respaldado por Google)  

**Recomendación:**
1. **Empieza con:** Firebase Hosting + Render Backend (gratis, 20 min)
2. **Luego migra a:** Firebase completo si necesitas más performance

---

**¿Listo para empezar con Firebase?** 

Es tan simple como:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

¡Tu app estará en `https://pulmocheck.web.app` en minutos!

