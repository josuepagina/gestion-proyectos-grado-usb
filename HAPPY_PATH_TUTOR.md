# 🎯 Happy Path - Flujo Completo del Tutor

## 📋 Resumen del Flujo

Este documento describe el flujo completo (happy path) que debe seguir un tutor desde que se le asigna un proyecto hasta completar su revisión y cierre del proyecto.

---

## 🔄 Flujo Paso a Paso

### **Paso 1: Inicio de Sesión** ✅
1. **Iniciar sesión** como tutor:
   - Ir a `/login`
   - Ingresar email y contraseña de tutor
   - Acceder al Dashboard del tutor

**✅ Resultado esperado:** Dashboard visible con proyectos asignados al tutor

---

### **Paso 2: Ver Proyectos Asignados** ✅
1. **Ver lista de proyectos:**
   - El Dashboard muestra proyectos donde el tutor está asignado
   - Ver información: título, estudiante, estado del proyecto

2. **Acceder a un proyecto:**
   - Click en un proyecto de la lista
   - Ver página de detalle del proyecto

**✅ Resultado esperado:** 
- Lista de proyectos asignados visible
- Información completa del proyecto accesible

---

### **Paso 3: Recibir Notificación de Nueva Entrega** 🔔
**Nota:** Este paso es automático cuando el estudiante sube una entrega.

1. **Ver notificación:**
   - El sistema envía notificación automática cuando hay nueva entrega
   - Ver notificación en Dashboard o panel de notificaciones

**✅ Resultado esperado:** 
- Notificación recibida: "Nueva entrega en el proyecto: [Título]"
- Proyecto aparece en lista de proyectos con entrega pendiente

---

### **Paso 4: Revisar Entrega del Estudiante** 📄
1. **Entrar al proyecto:**
   - Click en el proyecto con entrega pendiente
   - O desde la notificación recibida

2. **Ver entregas:**
   - Ver lista de entregas del proyecto
   - Identificar entrega pendiente de revisión
   - Ver información: etapa, versión, fecha de subida, estado

3. **Descargar documento:**
   - Click en botón "Descargar" de la entrega
   - Revisar el documento descargado

**✅ Resultado esperado:** 
- Documento descargado correctamente
- Información de la entrega visible

---

### **Paso 5: Comparar Versiones (si aplica)** 🔍
1. **Ver historial de versiones:**
   - Si hay múltiples versiones de la misma etapa
   - Click en "Comparar Versiones"

2. **Seleccionar versiones:**
   - Seleccionar versión anterior y versión actual
   - Ver diferencias detectadas

**✅ Resultado esperado:** 
- Visualización de diferencias entre versiones
- Información de cambios: nombre, tamaño, fecha

---

### **Paso 6: Agregar Observaciones** 📝
1. **Crear observación:**
   - Seleccionar entrega a revisar
   - Click en "Agregar Observación"
   - Completar formulario:
     - **Comentario** (requerido)
     - **Sección del documento** (opcional, ej: "Capítulo 2, página 15")
     - **Tipo:** Observación (por defecto)
   - Click en "Guardar Observación"

2. **Cambiar estado de entrega:**
   - Cambiar estado a "observado" o "en_revision"
   - Esto indica que la entrega está siendo revisada

**✅ Resultado esperado:** 
- Observación guardada correctamente
- Estudiante recibe notificación automática
- Estado de entrega actualizado
- Entrada creada en bitácora

---

### **Paso 7: Revisar Correcciones del Estudiante** 🔄
**Nota:** El estudiante debe corregir y subir nueva versión primero.

1. **Ver nueva versión:**
   - El estudiante sube versión corregida
   - Tutor recibe notificación de nueva versión
   - Ver nueva versión en el historial

2. **Comparar con versión anterior:**
   - Comparar versión anterior vs. nueva versión
   - Verificar que se aplicaron las correcciones

3. **Revisar observaciones resueltas:**
   - Ver si el estudiante marcó observaciones como resueltas
   - Verificar que las correcciones son adecuadas

**✅ Resultado esperado:** 
- Nueva versión visible en el historial
- Cambios detectados automáticamente
- Observaciones resueltas identificables

---

### **Paso 8: Aprobar o Rechazar Entrega** ✅❌
1. **Evaluar entrega:**
   - Revisar que todas las observaciones fueron atendidas
   - Verificar calidad del documento

2. **Aprobar entrega:**
   - Si la entrega cumple con los requisitos:
     - Click en "Aprobar Entrega"
     - Cambiar estado a "aprobado"
   - Si requiere más correcciones:
     - Agregar nuevas observaciones
     - Cambiar estado a "observado" o "rechazado"

**✅ Resultado esperado:** 
- Estado de entrega actualizado
- Estudiante recibe notificación automática
- Entrada creada en bitácora
- Si se aprueba, el proyecto puede avanzar a siguiente etapa

---

### **Paso 9: Ver Bitácoras** 📋
1. **Acceder a bitácoras:**
   - Click en una entrega específica
   - Click en "Mostrar Bitácoras"

2. **Revisar historial:**
   - Ver todas las acciones realizadas
   - Ver cambios detectados entre versiones
   - Ver quién realizó cada acción y cuándo

**✅ Resultado esperado:** 
- Historial completo de acciones visible
- Información detallada de cambios

---

### **Paso 10: Cerrar Proyecto (cuando todas las entregas están aprobadas)** 🎯
1. **Verificar estado del proyecto:**
   - Verificar que todas las entregas requeridas están aprobadas
   - Revisar que no hay observaciones pendientes

2. **Cerrar proyecto:**
   - Click en botón "Cerrar Proyecto" o "Marcar como Completado"
   - El sistema valida que todas las entregas están aprobadas
   - Confirmar acción

**✅ Resultado esperado:** 
- Proyecto cambia de estado a "completado"
- Estudiante recibe notificación
- Administrador recibe notificación
- Proyecto marcado como completado (estado final, no requiere más acciones)
- Entrada creada en bitácora

---

### **Paso 11: Ver Reportes** 📊
1. **Ir a sección "Reportes"**
   - Click en "Reportes" en el menú

2. **Ver Tareas Pendientes:**
   - Pestaña "Tareas Pendientes"
   - Ver lista de entregas sin revisar
   - Ver proyectos con entregas pendientes

3. **Ver Tareas Cumplidas:**
   - Pestaña "Tareas Cumplidas"
   - Historial de entregas revisadas
   - Historial de proyectos cerrados

**✅ Resultado esperado:** 
- Lista personalizada de tareas pendientes
- Historial de trabajo realizado

---

## 🔁 Ciclo Iterativo

El proceso se repite para cada entrega del proyecto:

1. **Recibir notificación** de nueva entrega
2. **Revisar entrega** y descargar documento
3. **Agregar observaciones** si es necesario
4. **Esperar correcciones** del estudiante
5. **Revisar nueva versión** y comparar cambios
6. **Aprobar o rechazar** entrega
7. **Repetir** hasta que todas las entregas estén aprobadas
8. **Cerrar proyecto** cuando esté completo

---

## ✅ Checklist del Happy Path Completo

- [ ] **Login** como tutor
- [ ] **Ver proyectos asignados** en Dashboard
- [ ] **Recibir notificación** de nueva entrega
- [ ] **Revisar entrega** del estudiante
- [ ] **Descargar documento** para revisión
- [ ] **Comparar versiones** (si aplica)
- [ ] **Agregar observaciones** sobre la entrega
- [ ] **Cambiar estado** de entrega a "observado" o "en_revision"
- [ ] **Revisar correcciones** del estudiante
- [ ] **Aprobar entrega** cuando cumple requisitos
- [ ] **Ver bitácoras** de cambios
- [ ] **Cerrar proyecto** cuando todas las entregas están aprobadas
- [ ] **Ver reportes** de tareas pendientes y cumplidas

---

## ⚠️ Puntos Importantes

1. **Estados de entrega:**
   - `pendiente` → Pendiente de revisión (recién subida)
   - `en_revision` → Tutor está revisando activamente
   - `observado` → Tiene observaciones que deben ser corregidas
   - `aprobado` → Aprobado por tutor, puede avanzar
   - `rechazado` → Rechazado, requiere correcciones mayores

2. **Estados del proyecto:**
   - `registrado` → Proyecto recién creado, sin entregas
   - `en_proceso` → Proyecto con entregas subidas
   - `en_revision` → Proyecto siendo revisado activamente
   - `correcciones` → Tiene observaciones pendientes
   - `completado` → Proyecto cerrado por tutor, ya cumplió con lo necesario (estado final)
   - `aprobado` → Aprobado por revisor
   - `sustentado` → Proyecto sustentado
   - `rechazado` → Proyecto rechazado

3. **Flujo de revisión:**
   - Tutor puede agregar múltiples observaciones por entrega
   - Tutor puede cambiar estado de entrega en cualquier momento
   - Tutor debe aprobar todas las entregas antes de cerrar proyecto
   - Al cerrar proyecto, se valida que todas las entregas estén aprobadas

4. **Notificaciones automáticas:**
   - Tutor recibe notificación cuando estudiante sube entrega
   - Estudiante recibe notificación cuando tutor agrega observación
   - Estudiante recibe notificación cuando tutor aprueba/rechaza entrega
   - Administrador recibe notificación cuando tutor cierra proyecto

---

**Última actualización:** 2025

