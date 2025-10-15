# 🔍 Estado de Conexión PulmoCheck

## ✅ Backend Funcionando

**URL:** https://pulmocheck.onrender.com/api/health

**Estado:** ✅ ONLINE y respondiendo correctamente

```json
{
  "status": "ok",
  "message": "PulmoCheck API is running"
}
```

---

## 🧪 Pruebas Rápidas

### 1. Verificar Backend (en navegador)

Abre en tu navegador:
```
https://pulmocheck.onrender.com/api/health
```

Deberías ver:
```json
{"status":"ok","message":"PulmoCheck API is running"}
```

---

### 2. Probar Frontend Completo

Abre:
```
https://pulmocheck-96f8f.web.app
```

**Prueba crear una evaluación:**
1. Clic en "Evaluá tu Riesgo Ahora"
2. Completa el formulario con datos de prueba
3. Clic en "Obtener Resultados"

**Si aparece un error:**
- Abre las DevTools (F12)
- Ve a la pestaña "Console"
- Busca errores en rojo
- Copia el error aquí para ayudarte

---

### 3. Probar Portal Médico

1. Clic en "Portal Médico"
2. Login: `doctor` / `doctor123`
3. Debería cargar el dashboard

---

## 🐛 Problemas Comunes

### Problema 1: "Network Error" o "Failed to fetch"

**Causa:** Backend está "dormido" (Render free tier)

**Solución:** 
- Espera 30-50 segundos
- Refresca la página
- El backend se "despierta" automáticamente

---

### Problema 2: "CORS Error"

**Síntoma:** Error en consola que menciona "CORS policy"

**Solución:**
Ya está configurado correctamente. Si persiste:
1. Verifica que la URL en `frontend/src/api.js` sea exactamente:
   `https://pulmocheck.onrender.com/api`
2. Limpia caché del navegador (Ctrl+Shift+Del)

---

### Problema 3: "404 Not Found"

**Causa:** URL incorrecta

**Verificar:**
- Frontend: https://pulmocheck-96f8f.web.app
- Backend: https://pulmocheck.onrender.com/api
- (con /api al final)

---

### Problema 4: Backend tarda mucho en responder

**Causa:** Plan gratuito de Render

**Explicación:**
- Después de 15 minutos sin uso, el backend "duerme"
- Primera petición: 30-50 segundos (lo despierta)
- Siguientes peticiones: normal (~200ms)

**Solución:**
- Paciencia en la primera carga
- O upgrade a Render Pro ($7/mes, sin sleep)

---

## 📊 Estado Actual

| Componente | URL | Estado | Notas |
|------------|-----|--------|-------|
| Frontend | https://pulmocheck-96f8f.web.app | ✅ Online | CDN Google |
| Backend | https://pulmocheck.onrender.com | ✅ Online | Puede dormir 15 min |
| API Health | /api/health | ✅ Respondiendo | 200 OK |
| GitHub | https://github.com/Jhonhillcoat/PulmoCheck | ✅ Actualizado | Auto-deploy |

---

## 🔧 Comandos de Diagnóstico

### Verificar Backend desde terminal:

```bash
# Health check
curl https://pulmocheck.onrender.com/api/health

# Ver CORS headers
curl -I https://pulmocheck.onrender.com/api/health
```

### Ver logs de Render:

1. Ve a: https://dashboard.render.com
2. Clic en tu servicio "pulmocheck"
3. Pestaña "Logs"
4. Busca errores en rojo

---

## 🎯 Prueba Completa del Flujo

### Evaluación de Paciente:

1. Ir a: https://pulmocheck-96f8f.web.app
2. Clic "Evaluá tu Riesgo"
3. Datos de prueba:
   ```
   Nombre: Juan Pérez
   Edad: 65
   Género: Masculino
   Años fumando: 35
   Cigarrillos/día: 30
   ✅ Tos persistente
   ✅ Antecedentes familiares
   ```
4. Completar y ver resultados

### Si todo funciona:
- ✅ Verás el score de riesgo
- ✅ Podrás subir una imagen
- ✅ Podrás descargar PDF

### Si no funciona:
1. Abre DevTools (F12)
2. Ve a Console
3. Captura el error
4. Compártelo para ayudarte

---

## 💡 ¿Sigue sin funcionar?

**Revisa:**
1. ¿El backend está "despierto"? (espera 1 minuto)
2. ¿Hay errores en la consola del navegador? (F12)
3. ¿Los logs de Render muestran errores?

**Si necesitas ayuda:**
- Comparte el error exacto de la consola
- O captura de pantalla del problema

