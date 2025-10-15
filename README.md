# 🫁 PulmoCheck - Detección Temprana del Cáncer de Pulmón

**PulmoCheck** es una plataforma web centrada en el paciente fumador para la detección temprana del cáncer de pulmón mediante un cuestionario clínico basado en guías NCCN/USPSTF, análisis de imágenes médicas con IA y revisión médica profesional.

---

## ✨ Características Principales

### Para Pacientes
- 📋 **Cuestionario de Evaluación de Riesgo**: Basado en guías internacionales (NCCN/USPSTF)
- 📊 **Cálculo de Score de Riesgo**: Evaluación personalizada del riesgo de cáncer pulmonar
- 🏥 **Subida de Imágenes Médicas**: Soporta DICOM, JPG y PNG
- 🤖 **Análisis con IA**: Detección preliminar de nódulos pulmonares
- 📥 **Reporte en PDF**: Descarga de resultados y recomendaciones

### Para Médicos
- 👨‍⚕️ **Dashboard Médico**: Vista general de todas las evaluaciones
- 🔍 **Revisión Detallada**: Acceso completo a datos de pacientes y resultados de IA
- 💬 **Comentarios Médicos**: Capacidad de agregar observaciones profesionales
- 📊 **Estadísticas**: Visualización de casos por nivel de riesgo

---

## 🏗️ Arquitectura

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **API Client**: Axios
- **Estilos**: CSS puro con variables CSS
- **Características**:
  - Diseño responsive y mobile-first
  - Interfaz intuitiva y amigable
  - Animaciones suaves
  - Barra de progreso en evaluación

### Backend
- **Framework**: Flask (Python)
- **Base de Datos**: SQLite
- **CORS**: Flask-CORS
- **Generación PDF**: ReportLab
- **Endpoints REST**:
  - `/api/assessment` - Crear evaluación
  - `/api/upload/<id>` - Subir imagen médica
  - `/api/analyze/<id>` - Análisis con IA
  - `/api/doctor/*` - Endpoints para médicos

### Machine Learning
- **Implementación**: Placeholder para integración futura
- **Modelos sugeridos**: LUNA16, nnUNet
- **Funcionalidad actual**: Simulación de detección de nódulos con probabilidades aleatorias

---

## 🚀 Instalación y Ejecución

### Prerequisitos
- Python 3.8+
- Node.js 14+
- npm o yarn

### Backend

```bash
# Navegar a la carpeta del backend
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python app.py
```

El backend estará disponible en `http://localhost:5000`

### Frontend

```bash
# En una nueva terminal, navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar aplicación
npm start
```

El frontend estará disponible en `http://localhost:3000`

---

## 🔐 Credenciales de Demo

### Portal Médico
- **Usuario**: `doctor`
- **Contraseña**: `doctor123`

---

## 📊 Algoritmo de Evaluación de Riesgo

El score de riesgo se calcula en base a los siguientes factores (máximo 100 puntos):

| Factor | Puntos |
|--------|--------|
| **Edad** | |
| 50-54 años | +10 |
| 55-64 años | +15 |
| 65+ años | +20 |
| **Historial de Tabaquismo** | |
| 10-19 años fumando | +10 |
| 20-29 años fumando | +15 |
| 30+ años fumando | +25 |
| 10-19 cigarrillos/día | +10 |
| 20+ cigarrillos/día | +20 |
| **Síntomas** | |
| Tos persistente | +8 |
| Disnea | +8 |
| Hemoptisis | +15 |
| Múltiples síntomas | +5-10 |
| **Otros Factores** | |
| Antecedentes familiares | +10 |
| Exposición a asbestos | +10 |
| EPOC/Enfisema | +10 |

### Niveles de Riesgo
- **Bajo**: Score < 30
- **Moderado**: Score 30-59
- **Alto**: Score ≥ 60

---

## 🎨 Diseño UI

- **Colores principales**: Celeste (#5dade2), Blanco, Gris claro
- **Tipografía**: System fonts (San Francisco, Segoe UI, Roboto)
- **Iconos**: Emojis nativos
- **Diseño**: Clean, moderno y profesional
- **UX**: Flujo paso a paso con feedback visual constante

---

## 📁 Estructura del Proyecto

```
PulmoCheck/
├── backend/
│   ├── app.py                 # Aplicación Flask principal
│   ├── requirements.txt       # Dependencias Python
│   └── uploads/               # Carpeta para imágenes (se crea automáticamente)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── Home.js
│   │   │   ├── Assessment.js
│   │   │   ├── Results.js
│   │   │   ├── DoctorLogin.js
│   │   │   ├── DoctorDashboard.js
│   │   │   └── DoctorDetail.js
│   │   ├── App.js
│   │   ├── api.js            # Cliente API
│   │   └── index.js
│   └── package.json
├── pulmocheck.db             # Base de datos SQLite (se crea automáticamente)
└── README.md
```

---

## 🔮 Roadmap de Funcionalidades Futuras

### MVP Actual (v1.0)
- ✅ Cuestionario de evaluación de riesgo
- ✅ Cálculo de score basado en factores
- ✅ Subida de imágenes médicas
- ✅ Placeholder de análisis ML
- ✅ Dashboard médico
- ✅ Generación de reportes PDF

### Próximas Versiones

#### v1.1
- [ ] Integración con modelo ML real (LUNA16 o nnUNet)
- [ ] Soporte para procesamiento de archivos DICOM completos
- [ ] Visualización de imágenes médicas en el navegador
- [ ] Sistema de notificaciones por email

#### v1.2
- [ ] Autenticación completa con JWT
- [ ] Registro de usuarios pacientes
- [ ] Historial de evaluaciones del paciente
- [ ] Comparación de resultados a lo largo del tiempo

#### v1.3
- [ ] Integración con sistemas hospitalarios (HL7/FHIR)
- [ ] Exportación de datos en formatos estándar
- [ ] Dashboard con analytics y estadísticas avanzadas
- [ ] Internacionalización (i18n)

#### v2.0
- [ ] Aplicación móvil (React Native)
- [ ] Telemedicina integrada
- [ ] Seguimiento de tratamientos
- [ ] Integración con wearables

---

## 🔒 Consideraciones de Seguridad

### Para Producción
Este es un MVP y requiere las siguientes mejoras de seguridad antes de uso en producción:

1. **Autenticación robusta**: Implementar JWT o OAuth2
2. **Encriptación**: HTTPS obligatorio
3. **Sanitización**: Validación exhaustiva de inputs
4. **Rate limiting**: Prevención de ataques DDoS
5. **Logs de auditoría**: Registro completo de acciones
6. **HIPAA compliance**: Para manejo de datos médicos en EE.UU.
7. **GDPR compliance**: Para usuarios en Europa
8. **Almacenamiento seguro**: Encriptación de datos sensibles
9. **Backup**: Sistema de respaldo automático

---

## ⚕️ Disclaimer Legal

**IMPORTANTE**: PulmoCheck es una herramienta de carácter **educativo y orientativo**. 

- ❌ **NO** constituye un diagnóstico médico
- ❌ **NO** reemplaza la evaluación profesional de un médico especialista
- ❌ **NO** debe utilizarse como única herramienta de decisión clínica
- ✅ **SÍ** es una herramienta de apoyo para identificación de población en riesgo
- ✅ **SÍ** debe ser complementada con evaluación médica profesional

El análisis de imágenes por IA es preliminar y debe ser confirmado por un radiólogo certificado. Los resultados pueden tener falsos positivos o falsos negativos.

**Si experimentas síntomas graves como dificultad respiratoria severa, tos con sangre o dolor torácico intenso, busca atención médica de emergencia inmediatamente.**

---

## 📚 Referencias Científicas

- [NCCN Guidelines for Lung Cancer Screening](https://www.nccn.org/professionals/physician_gls/pdf/lung_screening.pdf)
- [USPSTF Lung Cancer Screening Recommendations](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening)
- [National Lung Screening Trial](https://www.nejm.org/doi/full/10.1056/NEJMoa1102873)
- [LUNA16 Dataset](https://luna16.grand-challenge.org/)

---

## 👥 Contribución

Este es un proyecto MVP educativo. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Contacto

Para preguntas, sugerencias o colaboraciones, por favor abre un issue en este repositorio.

---

## 🙏 Agradecimientos

- Guías NCCN y USPSTF por los estándares de screening
- Comunidad de ML en medicina
- Todos los profesionales de la salud en la lucha contra el cáncer

---

**¡La detección temprana salva vidas! 🫁**

