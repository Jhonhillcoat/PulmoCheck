# 🐛 Cómo Ver el Error Exacto

## 🎯 Opción 1: Ver Error en el Navegador (MÁS FÁCIL)

### Paso a Paso:

1. **Abre tu app:**
   ```
   https://pulmocheck-96f8f.web.app
   ```

2. **Abre las Herramientas de Desarrollo:**
   - Presiona **F12** en tu teclado
   - O clic derecho → "Inspeccionar"

3. **Ve a la pestaña "Console"** (Consola)

4. **Intenta crear una evaluación:**
   - Completa el formulario
   - Clic en "Obtener Resultados"

5. **Busca líneas en ROJO** en la consola

6. **Copia TODO el mensaje de error** que aparece

**¿Qué error ves?** Por ejemplo:
- `Failed to fetch`
- `Network error`
- `500 Internal Server Error`
- `CORS policy`
- Otro mensaje

---

## 🎯 Opción 2: Ver Logs en Render

### Paso a Paso:

1. **Abre en tu navegador:**
   ```
   https://dashboard.render.com
   ```

2. **Inicia sesión** con tu cuenta

3. **Clic en tu servicio:** "pulmocheck" o similar

4. **Ve a la pestaña "Logs"** (en el menú izquierdo)

5. **Busca líneas en ROJO** (errores)

6. **Copia las últimas líneas de error**

**¿Qué ves en los logs?** Por ejemplo:
- Errores de Python
- Traceback
- Database errors
- Etc.

---

## 🔍 Errores Comunes y Soluciones

### Error 1: "Failed to fetch" o "Network Error"

**Causa:** El backend está dormido

**Solución:**
- Espera 30-60 segundos
- Intenta de nuevo
- El backend se despierta automáticamente

---

### Error 2: "CORS policy blocked"

**Síntoma:** Mensaje que menciona "CORS" en la consola

**Causa:** Configuración de CORS

**Solución:** Ya debería estar configurado. Si persiste:
1. Limpia caché del navegador (Ctrl+Shift+Del)
2. Recarga la página (Ctrl+F5)

---

### Error 3: "500 Internal Server Error"

**Causa:** Error en el código del backend

**Solución:**
1. Ve a los logs de Render (Opción 2 arriba)
2. Busca el traceback del error
3. Compárteme el error completo

---

### Error 4: "Cannot read property ... of undefined"

**Causa:** Falta un campo en el formulario

**Solución:**
- Asegúrate de completar TODOS los campos obligatorios
- Incluye edad, género, años fumando, cigarrillos/día

---

### Error 5: "Database locked" o "unable to open database"

**Causa:** Problema con SQLite en Render

**Solución:**
El backend necesita crear la base de datos. Verifica logs.

---

## 🧪 Prueba Rápida

### Datos de Prueba que SIEMPRE funcionan:

```
Nombre: Juan Pérez
Email: juan@test.com
Edad: 65
Género: Masculino

Años fumando: 35
Cigarrillos por día: 30
Última TC: Nunca

Síntomas:
✅ Tos persistente
☐ Disnea
☐ Hemoptisis

Factores:
✅ Antecedentes familiares
☐ Exposición a asbestos
✅ EPOC/Enfisema
```

---

## 📸 Capturas Útiles

Si puedes, toma capturas de:
1. El error en la consola (F12)
2. El mensaje de error en la pantalla
3. Los logs de Render

---

## ❓ Preguntas para Diagnosticar

Por favor responde:

1. **¿Qué mensaje exacto sale?**
   - ¿En la pantalla?
   - ¿En la consola (F12)?

2. **¿En qué paso falla?**
   - ¿Al llenar el formulario?
   - ¿Al hacer clic en "Obtener Resultados"?
   - ¿Después de esperar?

3. **¿Cuánto tiempo esperas?**
   - ¿Inmediato?
   - ¿Más de 1 minuto?

4. **¿Qué navegador usas?**
   - Chrome
   - Edge
   - Firefox
   - Otro

---

## 🔧 Soluciones Rápidas Generales

### Intenta esto PRIMERO:

1. **Espera 1 minuto completo** en la página de resultados
   (El backend puede estar despertando)

2. **Refresca la página** (Ctrl+F5 o Cmd+Shift+R)

3. **Prueba en modo incógnito:**
   - Chrome/Edge: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P

4. **Limpia caché:**
   - Ctrl+Shift+Del
   - Marca "Caché" e "Imágenes"
   - Borra

5. **Intenta desde otro dispositivo:**
   - Desde tu celular
   - Desde otra computadora

---

## 💬 Comparte el Error

Una vez que veas el error, comparte:

```
Error en la consola (F12):
[PEGA AQUÍ EL ERROR]

Error en pantalla:
[DESCRIBE QUÉ VES]

Logs de Render (si pudiste verlos):
[PEGA AQUÍ LOS LOGS]
```

Con esa información te puedo ayudar a solucionar el problema exacto.

