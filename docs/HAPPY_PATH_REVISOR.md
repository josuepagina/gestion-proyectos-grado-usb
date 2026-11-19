# 🎯 Happy Path - Flujo Completo del Revisor

## 📋 Resumen del Flujo

Este documento describe el flujo completo (happy path) que debe seguir un revisor desde que se le asigna un proyecto hasta completar su evaluación.

---

## 🔄 Flujo Paso a Paso

### **Paso 1: Inicio de Sesión** ✅
1. **Iniciar sesión** como revisor:
   - Ir a `/login`
   - Ingresar email y contraseña de revisor
   - Acceder al Dashboard del revisor

**✅ Resultado esperado:** Dashboard visible con proyectos asignados para revisar

---

### **Paso 2: Recibir Asignación de Proyecto** 🔔
**Nota:** Este paso lo realiza un **Administrador**, no el revisor.

1. **Ver notificación:**
   - Administrador asigna revisor a un proyecto
   - Revisor recibe notificación: "Has sido asignado como revisor de un proyecto"

2. **Ver proyecto asignado:**
   - Proyecto aparece en lista de proyectos asignados
   - Ver información: título, estudiante, tutor, estado

**✅ Resultado esperado:** 
- Notificación recibida
- Proyecto visible en lista de proyectos asignados

---

### **Paso 3: Ver Proyectos Asignados** 📋
1. **Ver lista de proyectos:**
   - El Dashboard muestra proyectos donde el revisor está asignado
   - Ver información: título, estudiante, tutor, estado del proyecto

2. **Filtrar proyectos:**
   - Ver proyectos en estado "en_revision" o "correcciones"
   - Ver proyectos que requieren revisión

**✅ Resultado esperado:** 
- Lista de proyectos asignados visible
- Información completa del proyecto accesible

---

### **Paso 4: Acceder a Proyecto para Revisar** 🔍
1. **Seleccionar proyecto:**
   - Click en un proyecto de la lista
   - Ver página de detalle del proyecto

2. **Ver información del proyecto:**
   - Ver título y descripción
   - Ver estudiante y tutor asignado
   - Ver estado actual del proyecto
   - Ver entregas del proyecto

**✅ Resultado esperado:** 
- Información completa del proyecto visible
- Entregas del proyecto listadas

---

### **Paso 5: Revisar Entregas Aprobadas por Tutor** 📄
1. **Ver entregas aprobadas:**
   - Ver lista de entregas del proyecto
   - Identificar entregas con estado "aprobado" por tutor
   - Ver información: etapa, versión, fecha de aprobación

2. **Descargar documentos:**
   - Descargar entregas aprobadas para revisión
   - Revisar cada documento descargado

**✅ Resultado esperado:** 
- Documentos descargados correctamente
- Información de entregas visible

---

### **Paso 6: Comparar Versiones (si aplica)** 🔍
1. **Ver historial de versiones:**
   - Si hay múltiples versiones de una entrega
   - Click en "Comparar Versiones"

2. **Seleccionar versiones:**
   - Seleccionar versiones a comparar
   - Ver diferencias detectadas

**✅ Resultado esperado:** 
- Visualización de diferencias entre versiones
- Información de cambios visible

---

### **Paso 7: Ver Observaciones del Tutor** 👀
1. **Revisar observaciones previas:**
   - Ver observaciones que el tutor agregó
   - Ver cómo el estudiante las resolvió
   - Verificar que las correcciones fueron adecuadas

**✅ Resultado esperado:** 
- Historial de observaciones visible
- Contexto completo del proceso de revisión

---

### **Paso 8: Agregar Observaciones Propias** 📝
1. **Crear observación:**
   - Seleccionar entrega a revisar
   - Click en "Agregar Observación"
   - Completar formulario:
     - **Comentario** (requerido)
     - **Sección del documento** (opcional)
     - **Tipo:** Observación (por defecto)
   - Click en "Guardar Observación"

2. **Cambiar estado de entrega:**
   - Cambiar estado a "observado" si requiere correcciones
   - O mantener "en_revision" si está revisando

**✅ Resultado esperado:** 
- Observación guardada correctamente
- Estudiante recibe notificación automática
- Tutor recibe notificación (opcional)
- Estado de entrega actualizado
- Entrada creada en bitácora

---

### **Paso 9: Evaluar y Aprobar Proyecto** ✅
1. **Revisar todas las entregas:**
   - Verificar que todas las entregas requeridas están aprobadas
   - Verificar calidad general del proyecto

2. **Aprobar proyecto:**
   - Si el proyecto cumple con los requisitos:
     - Cambiar estado del proyecto a "aprobado"
     - O agregar observaciones finales si es necesario

3. **Rechazar proyecto (si aplica):**
   - Si el proyecto no cumple requisitos:
     - Agregar observaciones detalladas
     - Cambiar estado a "correcciones" o "rechazado"

**✅ Resultado esperado:** 
- Estado del proyecto actualizado
- Estudiante recibe notificación
- Tutor recibe notificación
- Administrador recibe notificación
- Entrada creada en bitácora

---

### **Paso 10: Ver Bitácoras** 📋
1. **Acceder a bitácoras:**
   - Click en una entrega específica
   - Click en "Mostrar Bitácoras"

2. **Revisar historial:**
   - Ver todas las acciones realizadas en el proyecto
   - Ver cambios detectados entre versiones
   - Ver quién realizó cada acción y cuándo

**✅ Resultado esperado:** 
- Historial completo de acciones visible
- Información detallada de cambios

---

### **Paso 11: Ver Reportes** 📊
1. **Ir a sección "Reportes"**
   - Click en "Reportes" en el menú

2. **Ver Tareas Pendientes:**
   - Pestaña "Tareas Pendientes"
   - Ver lista de proyectos asignados sin revisar
   - Ver proyectos con entregas pendientes de revisión

3. **Ver Tareas Cumplidas:**
   - Pestaña "Tareas Cumplidas"
   - Historial de proyectos revisados
   - Historial de proyectos aprobados

**✅ Resultado esperado:** 
- Lista personalizada de tareas pendientes
- Historial de trabajo realizado

---

## 🔁 Ciclo Iterativo

El proceso se repite para cada proyecto asignado:

1. **Recibir asignación** de proyecto (por admin)
2. **Revisar entregas** aprobadas por tutor
3. **Agregar observaciones** si es necesario
4. **Evaluar proyecto** completo
5. **Aprobar o rechazar** proyecto
6. **Repetir** para siguiente proyecto asignado

---

## ✅ Checklist del Happy Path Completo

- [ ] **Login** como revisor
- [ ] **Recibir notificación** de asignación de proyecto
- [ ] **Ver proyectos asignados** en Dashboard
- [ ] **Acceder a proyecto** para revisar
- [ ] **Revisar entregas** aprobadas por tutor
- [ ] **Descargar documentos** para revisión
- [ ] **Comparar versiones** (si aplica)
- [ ] **Ver observaciones** del tutor
- [ ] **Agregar observaciones** propias
- [ ] **Evaluar proyecto** completo
- [ ] **Aprobar proyecto** cuando cumple requisitos
- [ ] **Ver bitácoras** de cambios
- [ ] **Ver reportes** de tareas pendientes y cumplidas

---

## ⚠️ Puntos Importantes

1. **Rol del revisor:**
   - Revisor evalúa el proyecto después de que el tutor lo ha aprobado
   - Revisor puede agregar observaciones adicionales
   - Revisor tiene la autoridad final para aprobar o rechazar el proyecto

2. **Estados del proyecto relevantes para revisor:**
   - `completado` → Proyecto cerrado por tutor, listo para revisión
   - `en_revision` → Proyecto siendo revisado por revisor
   - `correcciones` → Tiene observaciones del revisor pendientes
   - `aprobado` → Aprobado por revisor, listo para sustentación
   - `rechazado` → Rechazado por revisor

3. **Flujo de revisión:**
   - Revisor revisa entregas que ya fueron aprobadas por tutor
   - Revisor puede agregar observaciones adicionales
   - Revisor puede aprobar o rechazar el proyecto completo
   - Al aprobar, el proyecto pasa a estado "aprobado" y está listo para sustentación

4. **Notificaciones automáticas:**
   - Revisor recibe notificación cuando es asignado a proyecto
   - Estudiante recibe notificación cuando revisor agrega observación
   - Estudiante recibe notificación cuando revisor aprueba/rechaza proyecto
   - Tutor recibe notificación cuando revisor aprueba/rechaza proyecto

---

**Última actualización:** 2025

