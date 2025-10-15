# 🏗️ Arquitectura de PulmoCheck

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                     PULMOCHECK PLATFORM                      │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────┐         ┌───────────────────────┐
│   PACIENTE (User)     │         │   MÉDICO (Doctor)     │
│                       │         │                       │
│  - Evaluación riesgo  │         │  - Dashboard          │
│  - Subir imágenes     │         │  - Ver casos          │
│  - Ver resultados     │         │  - Comentar           │
│  - Descargar reporte  │         │  - Reportes           │
└───────────┬───────────┘         └──────────┬────────────┘
            │                                 │
            │        HTTP/REST API            │
            └─────────────┬───────────────────┘
                          │
            ┌─────────────▼─────────────┐
            │   REACT FRONTEND          │
            │   Port: 3000              │
            │                           │
            │  - React Router           │
            │  - Axios API Client       │
            │  - Component Based        │
            │  - CSS Responsive         │
            └─────────────┬─────────────┘
                          │
                  HTTP Requests
                          │
            ┌─────────────▼─────────────┐
            │   FLASK BACKEND           │
            │   Port: 5000              │
            │                           │
            │  Endpoints:               │
            │  • POST /api/assessment   │
            │  • POST /api/upload/:id   │
            │  • POST /api/analyze/:id  │
            │  • POST /api/doctor/login │
            │  • GET  /api/doctor/*     │
            │  • GET  /api/report/:id   │
            └─────────────┬─────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
    ┌───────▼────────┐      ┌──────────▼────────┐
    │  SQLite DB     │      │  ML Analyzer      │
    │                │      │  (Placeholder)    │
    │  Tables:       │      │                   │
    │  - assessments │      │  - Simula LUNA16  │
    │  - doctors     │      │  - Detección      │
    │  - comments    │      │    de nódulos     │
    └────────────────┘      └───────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Flujo de Evaluación del Paciente

```
[Paciente completa formulario]
         ↓
[Frontend valida datos]
         ↓
[POST /api/assessment]
         ↓
[Backend calcula score]
         ↓
[Guarda en SQLite]
         ↓
[Retorna resultado + ID]
         ↓
[Frontend muestra resultados]
```

### 2. Flujo de Subida y Análisis de Imagen

```
[Paciente selecciona imagen]
         ↓
[POST /api/upload/:id]
         ↓
[Backend guarda archivo]
         ↓
[Actualiza DB con path]
         ↓
[POST /api/analyze/:id]
         ↓
[ML Analyzer procesa]
         ↓
[Guarda análisis en DB]
         ↓
[Retorna resultados]
         ↓
[Frontend muestra hallazgos]
```

### 3. Flujo del Portal Médico

```
[Médico ingresa credenciales]
         ↓
[POST /api/doctor/login]
         ↓
[Backend valida usuario]
         ↓
[Frontend guarda sesión]
         ↓
[GET /api/doctor/assessments]
         ↓
[Backend retorna lista]
         ↓
[Dashboard muestra casos]
         ↓
[Médico selecciona caso]
         ↓
[GET /api/doctor/assessment/:id]
         ↓
[Vista detallada con datos completos]
         ↓
[Médico agrega comentario]
         ↓
[POST /api/doctor/comment]
         ↓
[Actualiza DB]
```

---

## 🗄️ Modelo de Base de Datos

```sql
┌──────────────────────────────────────────┐
│            assessments                    │
├──────────────────────────────────────────┤
│ id                  INTEGER PK           │
│ patient_name        TEXT                 │
│ patient_email       TEXT                 │
│ age                 INTEGER              │
│ gender              TEXT                 │
│ years_smoking       INTEGER              │
│ cigarettes_per_day  INTEGER              │
│ family_history      BOOLEAN              │
│ persistent_cough    BOOLEAN              │
│ dyspnea            BOOLEAN              │
│ hemoptysis         BOOLEAN              │
│ last_ct            TEXT                 │
│ asbestos_exposure  BOOLEAN              │
│ copd_emphysema     BOOLEAN              │
│ risk_score         REAL                 │
│ risk_level         TEXT                 │
│ recommendation     TEXT                 │
│ image_path         TEXT                 │
│ ml_analysis        TEXT (JSON)          │
│ created_at         TIMESTAMP            │
└──────────────────────────────────────────┘
              │
              │ 1:N
              ▼
┌──────────────────────────────────────────┐
│         doctor_comments                   │
├──────────────────────────────────────────┤
│ id              INTEGER PK               │
│ assessment_id   INTEGER FK               │
│ doctor_name     TEXT                     │
│ comment         TEXT                     │
│ created_at      TIMESTAMP                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│              doctors                      │
├──────────────────────────────────────────┤
│ id              INTEGER PK               │
│ username        TEXT UNIQUE              │
│ password_hash   TEXT                     │
│ name            TEXT                     │
└──────────────────────────────────────────┘
```

---

## 📦 Estructura de Componentes React

```
App
├── Header (Logo + Navigation)
├── Router
│   ├── Home
│   │   ├── Hero
│   │   ├── Features (Grid 3x)
│   │   ├── InfoSection
│   │   └── CTA
│   │
│   ├── Assessment
│   │   ├── ProgressBar
│   │   ├── Step1 (Personal Info)
│   │   ├── Step2 (Smoking History)
│   │   ├── Step3 (Symptoms)
│   │   └── Step4 (Additional Factors)
│   │
│   ├── Results
│   │   ├── RiskCard
│   │   ├── Recommendation
│   │   ├── FactorsList
│   │   ├── ImageUpload
│   │   ├── MLAnalysis
│   │   ├── NextSteps
│   │   └── Disclaimer
│   │
│   ├── DoctorLogin
│   │   ├── LoginForm
│   │   └── DemoCredentials
│   │
│   ├── DoctorDashboard
│   │   ├── StatsGrid (4 cards)
│   │   ├── FilterButtons
│   │   └── AssessmentsTable
│   │
│   └── DoctorDetail
│       ├── PatientInfo
│       ├── RiskSummary
│       ├── FactorsGrid
│       ├── Recommendation
│       ├── ImageSection
│       ├── MLAnalysisSection
│       ├── CommentsList
│       └── AddCommentForm
│
└── Footer
```

---

## 🔐 Seguridad

### Implementado
- ✅ CORS habilitado
- ✅ Hash SHA-256 para passwords
- ✅ Validación de tipos de archivo
- ✅ Límite de tamaño de archivo (50MB)
- ✅ Sanitización básica de inputs

### Requerido para Producción
- ⚠️ HTTPS/SSL
- ⚠️ JWT tokens
- ⚠️ Rate limiting
- ⚠️ Input validation exhaustiva
- ⚠️ SQL injection prevention
- ⚠️ XSS protection
- ⚠️ CSRF tokens
- ⚠️ Audit logs
- ⚠️ Encriptación de datos sensibles
- ⚠️ HIPAA compliance

---

## 🚀 Deployment Options

### Opción 1: Servidor Único
```
[nginx]
   │
   ├─→ Frontend (static files)
   │
   └─→ Backend (Gunicorn + Flask)
        └─→ SQLite
```

### Opción 2: Containerizado
```
Docker Compose
├── frontend (nginx)
├── backend (gunicorn)
└── db (postgresql)
```

### Opción 3: Cloud
```
Frontend: Vercel/Netlify
Backend: Heroku/Railway
Database: PostgreSQL (Supabase/Railway)
Storage: AWS S3/Cloudinary
```

---

## 📊 Métricas y Monitoring

### KPIs Sugeridos
- Número de evaluaciones por día
- Distribución de niveles de riesgo
- Tasa de conversión (evaluación → imagen subida)
- Tiempo promedio de evaluación
- Tasa de comentarios médicos
- Reportes generados

### Herramientas
- Backend: Flask logging
- Frontend: Google Analytics / Mixpanel
- Errors: Sentry
- APM: New Relic / DataDog

---

## 🔄 Ciclo de Vida del Dato

```
1. [Creación]
   Paciente → Formulario → Backend → DB

2. [Procesamiento]
   DB → ML Analyzer → Análisis → DB

3. [Revisión]
   DB → Dashboard Médico → Comentarios → DB

4. [Reporte]
   DB → PDF Generator → Download

5. [Almacenamiento]
   - Datos estructurados: SQLite
   - Imágenes: File system (/uploads)
   - PDFs: File system (/uploads)
```

---

## 🎯 Escalabilidad

### Para 1-100 usuarios/día
- ✅ Setup actual (SQLite + Flask dev server)

### Para 100-1000 usuarios/día
- PostgreSQL en lugar de SQLite
- Gunicorn con workers
- Redis para cache
- CDN para assets estáticos

### Para 1000+ usuarios/día
- Load balancer
- Multiple backend instances
- Managed database (AWS RDS)
- Message queue (Celery + Redis)
- S3 para almacenamiento
- CloudFront CDN

---

## 🧪 Testing

### Frontend
```bash
npm test                    # Jest + React Testing Library
npm run test:coverage      # Coverage report
```

### Backend
```bash
pytest                     # Unit tests
pytest --cov              # Coverage
```

### E2E
```bash
npm run cypress           # Cypress tests
```

---

## 📝 API Documentation

### Endpoints Overview

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/assessment` | Crear evaluación |
| POST | `/api/upload/:id` | Subir imagen |
| POST | `/api/analyze/:id` | Analizar imagen |
| POST | `/api/doctor/login` | Login médico |
| GET | `/api/doctor/assessments` | Listar evaluaciones |
| GET | `/api/doctor/assessment/:id` | Detalle evaluación |
| POST | `/api/doctor/comment` | Agregar comentario |
| GET | `/api/report/:id` | Descargar reporte PDF |

---

## 🔧 Variables de Entorno

### Backend
```env
FLASK_ENV=development
FLASK_DEBUG=1
DATABASE_URL=sqlite:///pulmocheck.db
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=52428800
SECRET_KEY=your-secret-key-here
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📱 Responsive Breakpoints

```css
Mobile:     < 768px
Tablet:     768px - 1024px
Desktop:    > 1024px
```

---

**Última actualización:** 2025

