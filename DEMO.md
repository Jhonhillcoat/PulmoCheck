# 🎬 Guía de Demo de PulmoCheck

Esta guía te ayudará a realizar una demostración completa de todas las funcionalidades de PulmoCheck.

---

## 📋 Preparación

1. Asegúrate de tener ambos servicios corriendo:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. Abre el navegador en `http://localhost:3000`

---

## 🎯 Demo Flujo del Paciente

### Paso 1: Página Principal
1. Muestra la página principal con el hero section
2. Explica las tres características principales:
   - 📋 Cuestionario Clínico
   - 🤖 Análisis con IA
   - 👨‍⚕️ Revisión Médica

3. Destaca las estadísticas:
   - 90% tasa de supervivencia con detección temprana
   - Reducción de 20% de mortalidad con LDCT

### Paso 2: Evaluación de Riesgo
1. Haz clic en **"Evaluá tu Riesgo Ahora"**
2. Completa el formulario paso a paso:

**Paso 1 - Información Personal:**
```
Nombre: Juan Pérez
Email: juan@email.com
Edad: 58
Género: Masculino
```

**Paso 2 - Historial de Tabaquismo:**
```
Años fumando: 25
Cigarrillos por día: 20
Última TC: Nunca
```

**Paso 3 - Síntomas:**
```
☑ Tos persistente
☐ Disnea
☐ Hemoptisis
```

**Paso 4 - Factores Adicionales:**
```
☑ Antecedentes familiares
☐ Exposición a asbestos
☑ EPOC/Enfisema
```

3. Haz clic en **"Obtener Resultados"**

### Paso 3: Resultados
1. Muestra el **Score de Riesgo** calculado
2. Explica el **Nivel de Riesgo** (Bajo/Moderado/Alto)
3. Lee la **Recomendación** automática
4. Muestra los **Factores de Riesgo Identificados**

### Paso 4: Subir Imagen (Opcional)
Si el riesgo es Moderado o Alto:

1. Haz clic en **"Seleccionar Archivo"**
2. Selecciona una imagen de prueba (JPG o PNG)
3. Haz clic en **"Subir Imagen"**
4. Espera confirmación
5. Haz clic en **"Analizar con IA"**
6. Muestra los resultados del análisis:
   - Nódulos detectados (Sí/No)
   - Tamaño del nódulo (si aplica)
   - Riesgo de malignidad
   - Confianza del modelo

### Paso 5: Descargar Reporte
1. Haz clic en **"Descargar Reporte PDF"**
2. Abre el PDF y muestra su contenido:
   - Datos del paciente
   - Score de riesgo
   - Recomendación
   - Análisis de IA (si aplica)

---

## 👨‍⚕️ Demo Flujo del Médico

### Paso 1: Login
1. Haz clic en **"Portal Médico"** en el menú
2. Ingresa credenciales:
   ```
   Usuario: doctor
   Contraseña: doctor123
   ```
3. Haz clic en **"Iniciar Sesión"**

### Paso 2: Dashboard
1. Muestra las **estadísticas** en las tarjetas superiores:
   - Total de evaluaciones
   - Casos de alto riesgo
   - Casos de riesgo moderado
   - Casos de bajo riesgo

2. Explica los **filtros** de la tabla:
   - Todas
   - Alto Riesgo
   - Moderado
   - Bajo

3. Muestra la **tabla de evaluaciones** con:
   - ID del assessment
   - Nombre del paciente
   - Edad
   - Score de riesgo
   - Nivel de riesgo
   - Indicador de imagen
   - Número de comentarios
   - Fecha

### Paso 3: Ver Detalle
1. Haz clic en **"Ver Detalle"** de una evaluación
2. Muestra las secciones:

**Información del Paciente:**
   - Datos personales completos
   - Fecha de evaluación

**Evaluación de Riesgo:**
   - Score visual grande
   - Nivel de riesgo
   - Barra de progreso

**Factores de Riesgo:**
   - Grid con todos los factores evaluados

**Recomendación Automática:**
   - Texto de la recomendación del sistema

**Imagen Médica (si aplica):**
   - Nombre del archivo
   - Resultados del análisis de IA

**Comentarios Previos:**
   - Lista de comentarios de otros médicos (si hay)

### Paso 4: Agregar Comentario
1. Scroll hasta **"Agregar Comentario Médico"**
2. Escribe un comentario de ejemplo:
   ```
   Revisado el caso del paciente Juan Pérez. 
   
   Dada su historia de tabaquismo (25 años, 20 cig/día) 
   y la presencia de EPOC, recomiendo:
   
   1. LDCT urgente
   2. Espirometría de control
   3. Derivación a neumología
   4. Programa de cesación tabáquica
   
   Seguimiento en 3 meses.
   
   Dr. Demo
   ```
3. Haz clic en **"Guardar Comentario"**
4. El comentario aparece en la lista

### Paso 5: Descargar Reporte
1. Haz clic en **"Descargar Reporte"**
2. Muestra que el PDF incluye ahora el comentario médico

---

## 🎨 Puntos a Destacar en la Demo

### Diseño UI/UX
- ✅ Interfaz limpia y profesional
- ✅ Colores suaves (celeste/blanco)
- ✅ Responsive (muestra en móvil si es posible)
- ✅ Animaciones suaves
- ✅ Feedback visual constante
- ✅ Barra de progreso en evaluación

### Funcionalidades Técnicas
- ✅ Validación de formularios
- ✅ Cálculo de score basado en guías médicas
- ✅ Upload de archivos con validación
- ✅ Análisis ML placeholder
- ✅ Generación de PDF
- ✅ Autenticación de médicos
- ✅ Sistema de comentarios

### Aspectos Médicos
- ✅ Basado en guías NCCN/USPSTF
- ✅ Factores de riesgo validados científicamente
- ✅ Disclaimers claros
- ✅ Enfoque en prevención

---

## 💡 Casos de Uso Sugeridos

### Caso 1: Bajo Riesgo
```
Edad: 45 años
Años fumando: 5
Cigarrillos/día: 5
Sin síntomas
Sin factores adicionales
→ Score: ~20 (Bajo)
```

### Caso 2: Riesgo Moderado
```
Edad: 58 años
Años fumando: 25
Cigarrillos/día: 20
Tos persistente
Antecedentes familiares
→ Score: ~50 (Moderado)
```

### Caso 3: Alto Riesgo
```
Edad: 65 años
Años fumando: 35
Cigarrillos/día: 30
Tos persistente + Hemoptisis
EPOC + Exposición a asbestos
→ Score: ~85 (Alto)
```

---

## 🎤 Script de Presentación Sugerido

### Introducción (1 min)
> "PulmoCheck es una plataforma web para la detección temprana del cáncer de pulmón. 
> Combina un cuestionario clínico basado en guías internacionales, análisis de imágenes 
> con IA, y un portal para revisión médica profesional."

### Demo Paciente (5 min)
> "Veamos cómo un paciente usaría la plataforma. Juan tiene 58 años y ha fumado 
> durante 25 años. Completa el cuestionario en menos de 5 minutos..."

### Demo Médico (3 min)
> "Ahora veamos el portal médico. Los profesionales de la salud pueden revisar 
> todas las evaluaciones, ver resultados del análisis de IA, y dejar comentarios..."

### Conclusión (1 min)
> "PulmoCheck busca cerrar la brecha entre la población de riesgo y el screening 
> temprano. Es una herramienta de apoyo, no un reemplazo del diagnóstico médico, 
> diseñada para salvar vidas mediante la detección temprana."

---

## 📊 Preguntas Frecuentes en Demos

**P: ¿Cómo se calcula el score?**
R: Se basa en factores de riesgo validados por NCCN/USPSTF: edad, historial de tabaquismo, síntomas, comorbilidades. Cada factor tiene un peso específico.

**P: ¿El modelo de IA es real?**
R: Este MVP usa un placeholder. En producción se integraría un modelo como LUNA16 o nnUNet entrenado con datos reales.

**P: ¿Es seguro para uso clínico?**
R: Este es un MVP educativo. Para uso clínico requeriría validación médica, compliance HIPAA/GDPR, y auditoría de algoritmos.

**P: ¿Soporta DICOM?**
R: Actualmente acepta archivos .dcm pero no los procesa completamente. Requeriría biblioteca especializada (pydicom).

**P: ¿Puede integrarse con sistemas hospitalarios?**
R: En el roadmap está la integración con HL7/FHIR para conectar con EMR/EHR.

---

## 🎯 Checklist Pre-Demo

- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Base de datos inicializada
- [ ] Usuario doctor creado
- [ ] Imagen de prueba preparada
- [ ] Navegador abierto
- [ ] Pantalla compartida (si es virtual)
- [ ] Audio funcionando
- [ ] Script de presentación revisado

---

**¡Buena suerte con tu demo! 🫁**

