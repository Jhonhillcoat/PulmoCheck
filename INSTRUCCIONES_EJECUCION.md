# 🎉 ¡PulmoCheck está corriendo!

## ✅ Estado de los Servicios

Ambos servicios deberían estar activos ahora:

### 🔥 Backend (Flask)
- **URL:** http://localhost:5000
- **API:** http://localhost:5000/api/health
- **Estado:** ✅ Corriendo

### ⚛️ Frontend (React)
- **URL:** http://localhost:3000
- **Estado:** ✅ Corriendo (puede tardar 30-60 segundos en compilar)

---

## 🌐 Cómo Acceder

1. **Abre tu navegador** (Chrome, Edge, Firefox)
2. **Ve a:** http://localhost:3000
3. El navegador **podría abrirse automáticamente**

---

## 🎮 Guía Rápida de Uso

### Como Paciente:

1. **Página Principal** → Clic en **"Evaluá tu Riesgo Ahora"**
2. **Completa el formulario** en 4 pasos (usa datos de prueba)
3. **Ver resultados** con tu score de riesgo
4. **Opcional:** Subir una imagen (cualquier JPG/PNG)
5. **Descargar** tu reporte en PDF

### Como Médico:

1. En el menú superior, clic en **"Portal Médico"**
2. **Login:**
   - Usuario: `doctor`
   - Contraseña: `doctor123`
3. **Ver dashboard** con todos los casos
4. **Clic en "Ver Detalle"** de cualquier caso
5. **Agregar comentarios** médicos

---

## 📝 Datos de Prueba Sugeridos

### Ejemplo de Paciente de Alto Riesgo:
```
Nombre: Juan Pérez
Edad: 65 años
Género: Masculino
Años fumando: 35
Cigarrillos por día: 30
✅ Tos persistente
✅ Antecedentes familiares
✅ EPOC/Enfisema
```

### Ejemplo de Paciente de Bajo Riesgo:
```
Nombre: María García
Edad: 45 años
Género: Femenino
Años fumando: 5
Cigarrillos por día: 5
❌ Sin síntomas
❌ Sin factores adicionales
```

---

## 🛑 Cómo Detener los Servicios

### Opción 1: Desde las Ventanas de Comandos
- Presiona **Ctrl + C** en cada ventana que tiene los servidores

### Opción 2: Cerrar las Ventanas
- Simplemente cierra las ventanas de PowerShell/CMD

---

## ❌ Si Algo No Funciona

### El navegador no se abre automáticamente:
- Abre manualmente: http://localhost:3000

### Error "Puerto ocupado":
- Alguien más está usando los puertos 3000 o 5000
- Cierra otras aplicaciones que puedan usarlos

### Página en blanco:
- Espera 30-60 segundos más (React se está compilando)
- Refresca la página (F5)

### Error de conexión al backend:
- Verifica que el backend esté corriendo en: http://localhost:5000/api/health
- Si no responde, reinicia el backend

---

## 📚 Documentación Adicional

- **README.md** - Documentación completa
- **DEMO.md** - Guía paso a paso para demostración
- **FEATURES.md** - Lista completa de funcionalidades

---

## 💡 Tips

- **Crea varios casos** diferentes para ver el dashboard poblado
- **Prueba ambos flujos** (paciente y médico)
- **Los datos se guardan** en una base de datos local (pulmocheck.db)
- **Usa Chrome/Edge** para mejor compatibilidad

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Verifica que ambos servidores estén corriendo
2. Revisa las ventanas de comando por errores
3. Lee la sección "Si Algo No Funciona"
4. Reinicia ambos servicios

---

**¡Disfruta usando PulmoCheck! 🫁**

La detección temprana salva vidas.

