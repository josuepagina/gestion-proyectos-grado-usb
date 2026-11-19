# 🎯 Happy Path - Flujo Completo del Estudiante

## 📋 Resumen del Flujo

Este documento describe el flujo completo (happy path) que debe seguir un estudiante desde que se registra hasta completar su proyecto de grado.

---

## 🔄 Flujo Paso a Paso

### **Paso 1: Registro e Inicio de Sesión** ✅
1. **Registrarse** en el sistema:
   - Ir a `/register`
   - Completar: nombre, apellidos, email, contraseña
   - Seleccionar rol: **"estudiante"**
   - El sistema redirige automáticamente al Dashboard

2. **O iniciar sesión** si ya tiene cuenta:
   - Ir a `/login`
   - Ingresar email y contraseña
   - Acceder al Dashboard del estudiante

**✅ Resultado esperado:** Dashboard visible con proyectos del estudiante (inicialmente vacío)

---

### **Paso 2: Crear un Nuevo Proyecto** ✅
1. **Ir a la sección "Proyectos"**
   - Click en "Proyectos" en el menú de navegación

2. **Crear nuevo proyecto:**
   - Click en botón **"Nuevo Proyecto"**
   - Completar formulario:
     - **Título** (requerido, mínimo 5 caracteres)
     - **Descripción** (opcional)
     - **Fecha de inicio** (opcional)
     - **Fecha de fin estimada** (opcional)
   - Click en **"Crear Proyecto"**

**✅ Resultado esperado:** 
- Proyecto creado con estado **"registrado"**
- Redirección automática a la página de detalle del proyecto
- Proyecto visible en la lista de "Mis Proyectos"
- Tutor aparece como **"Sin asignar"**

---

### **Paso 3: Esperar Asignación de Tutor** ⏳
**Nota:** Este paso lo realiza un **Administrador**, no el estudiante.

1. Un administrador debe:
   - Ver el proyecto en la lista de proyectos
   - Asignar un tutor disponible al proyecto

**✅ Resultado esperado:**
- El proyecto ahora muestra el nombre del tutor asignado
- El estudiante puede ver quién es su tutor en la página de detalle

**⚠️ IMPORTANTE:** El estudiante **NO puede** subir documentos hasta que tenga un tutor asignado (esto depende de la implementación del negocio, pero generalmente es así).

---

### **Paso 4: Subir Primera Entrega (Anteproyecto)** ✅
1. **Entrar al proyecto:**
   - Click en el proyecto desde la lista
   - O desde el Dashboard

2. **Subir documento:**
   - Click en botón **"Subir Entrega"** (visible solo para el dueño del proyecto)
   - Seleccionar **Etapa:** "Anteproyecto"
   - Seleccionar archivo (PDF o Word, máx. 10MB)
   - Click en **"Subir Archivo"**

**✅ Resultado esperado:**
- Documento subido como **versión 1**
- Aparece en la lista de entregas
- Estado: **"pendiente"** (pendiente de revisión)
- Se crea entrada en bitácora automáticamente
- El tutor recibe una notificación automática

---

### **Paso 5: Revisar Observaciones del Tutor** 👀
**Nota:** El tutor debe revisar primero y agregar observaciones.

1. **Ver observaciones:**
   - En la página de detalle del proyecto
   - Click en una entrega para expandirla
   - Ver sección de "Observaciones"

2. **Revisar cada observación:**
   - Ver comentario del tutor
   - Ver sección del documento mencionada
   - Ver fecha de la observación

**✅ Resultado esperado:**
- Observaciones visibles con toda la información
- Estado de observaciones: "pendiente" o "resuelta"
- Notificaciones recibidas cuando hay nuevas observaciones

---

### **Paso 6: Corregir y Subir Nueva Versión** ✅
1. **Subir versión corregida:**
   - Click en **"Subir Entrega"** nuevamente
   - Seleccionar la **misma etapa** (ej: "Anteproyecto")
   - Seleccionar archivo corregido
   - Click en **"Subir Archivo"**

**✅ Resultado esperado:**
- Nueva versión creada (versión 2, 3, etc.)
- Sistema detecta cambios automáticamente:
  - Cambios en nombre de archivo
  - Cambios en tamaño
  - Cambios en fecha
- Se crea nueva entrada en bitácora con cambios detectados
- El tutor recibe notificación de nueva versión

2. **Marcar observaciones como resueltas:**
   - En la sección de observaciones
   - Marcar las observaciones que ya fueron corregidas

**✅ Resultado esperado:**
- Observaciones marcadas como "resueltas"
- Cambio visual en la interfaz

---

### **Paso 7: Comparar Versiones** 🔍
1. **Ver historial de versiones:**
   - En la página de detalle del proyecto
   - Ver todas las versiones de una misma etapa

2. **Comparar versiones:**
   - Si hay múltiples versiones, aparece botón **"Comparar Versiones"**
   - Click en el botón
   - Seleccionar dos versiones diferentes

**✅ Resultado esperado:**
- Visualización de diferencias entre versiones
- Información de cambios detectados:
  - Nombre de archivo
  - Tamaño
  - Fecha
- Vista comparativa clara

---

### **Paso 8: Ver Bitácoras** 📝
1. **Acceder a bitácoras:**
   - Click en una entrega específica
   - Click en botón **"Mostrar Bitácoras"**

**✅ Resultado esperado:**
- Historial completo de acciones realizadas
- Información de cada acción:
  - Usuario que realizó la acción
  - Tipo de acción (subida, revisión, aprobación, etc.)
  - Fecha y hora
  - Cambios detectados (si aplica)
  - Versiones anteriores y actuales

---

### **Paso 9: Ver Reportes** 📊
1. **Ir a sección "Reportes"**
   - Click en "Reportes" en el menú

2. **Ver Tareas Pendientes:**
   - Pestaña "Tareas Pendientes"
   - Ver lista de:
     - Observaciones no resueltas
     - Entregas pendientes de revisión

3. **Ver Tareas Cumplidas:**
   - Pestaña "Tareas Cumplidas"
   - Historial de tareas completadas

**✅ Resultado esperado:**
- Lista personalizada según el estudiante
- Información clara de qué necesita atención
- Historial de trabajo realizado

---

## 🔁 Ciclo Iterativo

El proceso se repite para cada etapa del proyecto:

1. **Anteproyecto** → Subir → Revisar → Corregir → Aprobar
2. **Entrega Parcial 1** → Subir → Revisar → Corregir → Aprobar
3. **Entrega Parcial 2** → Subir → Revisar → Corregir → Aprobar
4. **Entrega Parcial 3** → Subir → Revisar → Corregir → Aprobar
5. **Versión Final** → Subir → Revisar → Corregir → Aprobar

---

## ✅ Checklist del Happy Path Completo

- [ ] **Registro/Login** como estudiante
- [ ] **Crear proyecto** nuevo
- [ ] **Ver proyecto** en estado "registrado"
- [ ] **Esperar asignación** de tutor (por admin)
- [ ] **Subir anteproyecto** (versión 1)
- [ ] **Ver notificación** de entrega subida
- [ ] **Ver observaciones** del tutor (cuando las agregue)
- [ ] **Subir versión corregida** (versión 2)
- [ ] **Comparar versiones** (v1 vs v2)
- [ ] **Ver bitácoras** de cambios
- [ ] **Marcar observaciones** como resueltas
- [ ] **Ver reportes** de tareas pendientes
- [ ] **Repetir proceso** para siguientes etapas

---

## ⚠️ Puntos Importantes

1. **Orden lógico:**
   - Primero crear proyecto
   - Luego esperar tutor (o el sistema puede permitir subir sin tutor, depende del negocio)
   - Después subir documentos

2. **Control de versiones:**
   - Cada vez que subes un archivo de la misma etapa, se crea una nueva versión
   - Las versiones se numeran automáticamente (1, 2, 3...)

3. **Estados del proyecto:**
   - `registrado` → Proyecto recién creado
   - `en_desarrollo` → Proyecto en proceso
   - `en_revision` → Proyecto siendo revisado
   - `correcciones` → Necesita correcciones
   - `aprobado` → Proyecto aprobado
   - `sustentado` → Proyecto sustentado
   - `rechazado` → Proyecto rechazado

4. **Estados de entregas:**
   - `pendiente` → Pendiente de revisión
   - `en_revision` → Siendo revisado
   - `observado` → Tiene observaciones
   - `aprobado` → Aprobado por tutor/revisor
   - `rechazado` → Rechazado

---

## 🎯 ¿Estás siguiendo el flujo correcto?

**Sí, el flujo que estás siguiendo es correcto:**

1. ✅ Login como estudiante
2. ✅ Crear proyecto nuevo
3. ✅ Entrar al proyecto
4. ✅ Subir entrega (documento)

**Lo que sigue:**
- Esperar que el tutor revise y agregue observaciones
- Corregir y subir nueva versión
- Comparar versiones
- Ver bitácoras
- Ver reportes

---

**Última actualización:** 2025

