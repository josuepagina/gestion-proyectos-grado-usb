# 🎯 Happy Path - Flujo Completo del Administrador

## 📋 Resumen del Flujo

Este documento describe el flujo completo (happy path) que debe seguir un administrador para gestionar el sistema completo, asignar tutores y revisores, y monitorear el progreso de todos los proyectos.

---

## 🔄 Flujo Paso a Paso

### **Paso 1: Inicio de Sesión** ✅
1. **Iniciar sesión** como administrador:
   - Ir a `/login`
   - Ingresar email y contraseña de administrador
   - Acceder al Dashboard del administrador

**✅ Resultado esperado:** Dashboard visible con estadísticas del sistema

---

### **Paso 2: Ver Dashboard con Estadísticas** 📊
1. **Ver métricas del sistema:**
   - Total de proyectos por estado
   - Total de entregas por estado y etapa
   - Observaciones totales y pendientes
   - Distribución de usuarios por rol
   - Proyectos sin tutor asignado
   - Proyectos en revisión

**✅ Resultado esperado:** 
- Dashboard con estadísticas completas
- Visión general del estado del sistema

---

### **Paso 3: Gestionar Usuarios** 👥
1. **Ver lista de usuarios:**
   - Ir a sección "Usuarios" (si existe)
   - Ver todos los usuarios del sistema
   - Ver información: nombre, email, rol, estado

2. **Crear nuevo usuario:**
   - Click en "Crear Usuario"
   - Completar formulario: nombre, apellidos, email, contraseña, rol
   - Seleccionar rol: estudiante, tutor, revisor, administrador
   - Click en "Guardar"

3. **Editar usuario:**
   - Seleccionar usuario de la lista
   - Modificar información si es necesario
   - Cambiar estado (activo/inactivo)

**✅ Resultado esperado:** 
- Usuarios gestionados correctamente
- Usuarios creados con roles apropiados

---

### **Paso 4: Ver Todos los Proyectos** 📋
1. **Ver lista completa:**
   - Ir a sección "Proyectos"
   - Ver todos los proyectos del sistema
   - Ver información: título, estudiante, tutor, estado, fechas

2. **Filtrar proyectos:**
   - Filtrar por estado (registrado, en_proceso, en_revision, etc.)
   - Filtrar por estudiante
   - Filtrar por tutor
   - Buscar por título o descripción

**✅ Resultado esperado:** 
- Lista completa de proyectos visible
- Filtros funcionando correctamente

---

### **Paso 5: Asignar Tutor a Proyecto** 👨‍🏫
1. **Identificar proyecto sin tutor:**
   - Ver proyectos con estado "registrado" y sin tutor asignado
   - O desde reporte de "Proyectos sin tutor"

2. **Asignar tutor:**
   - Seleccionar proyecto sin tutor
   - Click en "Asignar Tutor"
   - Seleccionar tutor disponible de la lista
   - Click en "Confirmar Asignación"

**✅ Resultado esperado:** 
- Tutor asignado correctamente
- Proyecto actualizado con tutor asignado
- Tutor recibe notificación automática
- Estudiante puede ver tutor asignado

---

### **Paso 6: Asignar Revisor a Proyecto** 👨‍💼
**Nota:** La asignación de revisor se realiza cuando el proyecto está en un estado que requiere revisión (por ejemplo, `en_revision` o según el flujo institucional). El estado `completado` es un estado final que indica que el proyecto ya cumplió con lo necesario y no requiere más acciones.

1. **Identificar proyecto que requiere revisión:**
   - Ver proyectos que requieren revisión según el flujo institucional
   - El estado `completado` es final y no requiere asignación de revisor

2. **Asignar revisor (si aplica):**
   - Seleccionar proyecto que requiere revisión
   - Click en "Asignar Revisor"
   - Seleccionar revisor disponible de la lista
   - Click en "Confirmar Asignación"

**✅ Resultado esperado:** 
- Revisor asignado correctamente (si aplica)
- Proyecto actualizado con revisor asignado
- Revisor recibe notificación automática

---

### **Paso 7: Monitorear Progreso de Proyectos** 📈
1. **Ver reportes de avance:**
   - Ir a sección "Reportes"
   - Ver reporte de avance por proyecto
   - Ver porcentaje de completitud de cada proyecto

2. **Ver reportes de tiempos:**
   - Ver reporte de tiempos y plazos
   - Identificar proyectos próximos a fecha de entrega
   - Identificar proyectos con retraso

**✅ Resultado esperado:** 
- Visibilidad completa del progreso
- Identificación de proyectos que requieren atención

---

### **Paso 8: Ver Estadísticas Detalladas** 📊
1. **Acceder a estadísticas:**
   - Ir a "Reportes" → "Estadísticas"
   - Ver métricas detalladas del sistema

2. **Analizar datos:**
   - Proyectos por estado
   - Entregas por etapa y estado
   - Observaciones totales y pendientes
   - Distribución de usuarios por rol
   - Proyectos sin tutor asignado
   - Proyectos en revisión

**✅ Resultado esperado:** 
- Estadísticas completas visibles
- Datos útiles para toma de decisiones

---

### **Paso 9: Ver Reportes de Tareas Pendientes** 📋
1. **Ver tareas pendientes del sistema:**
   - Ir a "Reportes" → "Tareas Pendientes"
   - Ver proyectos sin tutor asignado
   - Ver proyectos en revisión
   - Ver proyectos que requieren atención

**✅ Resultado esperado:** 
- Lista completa de tareas pendientes
- Identificación de acciones requeridas

---

### **Paso 10: Ver Reportes de Tareas Cumplidas** ✅
1. **Ver historial de tareas completadas:**
   - Ir a "Reportes" → "Tareas Cumplidas"
   - Ver proyectos completados
   - Ver proyectos aprobados
   - Ver proyectos sustentados

**✅ Resultado esperado:** 
- Historial de trabajo realizado
- Visibilidad de proyectos exitosos

---

### **Paso 11: Gestionar Estados de Proyectos (si es necesario)** 🔄
1. **Cambiar estado manualmente (si aplica):**
   - En casos especiales, cambiar estado de proyecto
   - Por ejemplo: marcar proyecto como "sustentado" después de sustentación

**✅ Resultado esperado:** 
- Estados actualizados correctamente
- Notificaciones enviadas a usuarios relevantes

---

## 🔁 Ciclo Iterativo

El proceso administrativo es continuo:

1. **Monitorear** estado del sistema mediante dashboard
2. **Asignar tutores** a proyectos nuevos
3. **Asignar revisores** a proyectos que requieren revisión (si aplica según flujo institucional)
4. **Monitorear progreso** mediante reportes
5. **Identificar problemas** y tomar acciones correctivas
6. **Repetir** ciclo continuamente

---

## ✅ Checklist del Happy Path Completo

- [ ] **Login** como administrador
- [ ] **Ver dashboard** con estadísticas del sistema
- [ ] **Gestionar usuarios** (crear, editar, activar/desactivar)
- [ ] **Ver todos los proyectos** del sistema
- [ ] **Filtrar proyectos** por estado, estudiante, tutor
- [ ] **Asignar tutor** a proyecto sin tutor
- [ ] **Asignar revisor** a proyectos que requieren revisión (si aplica según flujo institucional)
- [ ] **Monitorear progreso** mediante reportes de avance
- [ ] **Ver reportes de tiempos** y plazos
- [ ] **Ver estadísticas detalladas** del sistema
- [ ] **Ver reportes** de tareas pendientes y cumplidas
- [ ] **Gestionar estados** de proyectos cuando sea necesario

---

## ⚠️ Puntos Importantes

1. **Responsabilidades del administrador:**
   - Gestionar usuarios del sistema
   - Asignar tutores a proyectos nuevos
   - Asignar revisores a proyectos completados
   - Monitorear el progreso general del sistema
   - Tomar decisiones administrativas basadas en reportes

2. **Flujo de asignaciones:**
   - **Tutor:** Se asigna cuando proyecto está en estado "registrado"
   - **Revisor:** Se asigna según el flujo institucional (el estado `completado` es final y no requiere asignación)

3. **Estados del proyecto relevantes para admin:**
   - `registrado` → Requiere asignación de tutor
   - `en_proceso` → Proyecto en desarrollo
   - `completado` → Proyecto cerrado por tutor, estado final (ya cumplió con lo necesario)
   - `aprobado` → Proyecto aprobado, listo para sustentación
   - `sustentado` → Proyecto sustentado exitosamente

4. **Reportes importantes:**
   - **Avance por proyecto:** Porcentaje de completitud
   - **Tiempos y plazos:** Proyectos con retraso o próximos a fecha límite
   - **Estadísticas:** Métricas generales del sistema
   - **Tareas pendientes:** Proyectos que requieren atención

5. **Notificaciones automáticas:**
   - Admin puede recibir notificaciones de eventos importantes
   - Admin recibe notificación cuando tutor cierra proyecto
   - Admin puede configurar alertas para proyectos con retraso

---

## 🎯 Flujo Completo del Sistema

**Vista desde el administrador:**

1. **Estudiante crea proyecto** → Estado: `registrado`
2. **Admin asigna tutor** → Proyecto tiene tutor asignado
3. **Estudiante sube entregas** → Estado: `en_proceso`
4. **Tutor revisa y aprueba entregas** → Entregas aprobadas
5. **Tutor cierra proyecto** → Estado: `completado` (estado final, ya cumplió con lo necesario)

**Nota:** El estado `completado` es un estado final que indica que el proyecto ya cumplió con lo necesario y no requiere más acciones. Si el proyecto necesita pasar por revisión, esto se manejaría antes de que el tutor lo cierre, o mediante un flujo separado según el reglamento institucional.

---

**Última actualización:** 2025

