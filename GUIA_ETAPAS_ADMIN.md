# Guía Rápida: Sistema de Gestión de Etapas

## 🎯 ¿Qué es?

El **Sistema de Gestión de Etapas** permite al administrador:
- Crear y configurar las etapas del proyecto (Anteproyecto, Entregas Parciales, Versión Final, etc.)
- Controlar **cuándo se abren y cierran** las etapas
- **Delimitar tiempos de entrega** de documentos por cada etapa
- Hacer seguimiento de todos los cambios mediante auditoría

---

## 🚀 Inicio Rápido para Administradores

### 1. Acceder al Panel de Gestión
1. Inicia sesión como **Administrador**
2. En el menú superior, haz clic en **"Etapas"**
3. Verás la página de gestión de etapas

### 2. Crear una Nueva Etapa
1. Haz clic en **"+ Nueva Etapa"**
2. Completa el formulario:
   - **Nombre:** Ej: "Anteproyecto", "Entrega Parcial 1", "Versión Final"
   - **Número de Orden:** 1, 2, 3, 4... (debe ser único)
   - **Tipo:** Selecciona el tipo de etapa
   - **Descripción:** Información general sobre la etapa
   - **Descripción de Entrega:** ¿Qué deben entregar los estudiantes?
   - **Fecha de Apertura:** Cuándo se abre para entregas
   - **Fecha de Cierre:** Cuándo se cierra (deja de aceptar entregas)
   - **Fecha Límite de Entrega:** Límite para subir documentos
   - **Permitir entregas fuera de tiempo:** Sí/No
3. Haz clic en **"Crear"**

### 3. Abrir una Etapa
1. Encuentra la etapa con estado "planificada"
2. Haz clic en el botón **"Abrir"**
3. La etapa pasará a estado "abierta"
4. ✅ Los estudiantes pueden ver y subir documentos

### 4. Cerrar una Etapa
1. Encuentra la etapa con estado "abierta"
2. Haz clic en el botón **"Cerrar"**
3. La etapa pasará a estado "cerrada"
4. ❌ Ya no se aceptarán nuevas entregas (a menos que se permita)

### 5. Extender Fechas
1. Haz clic en **"Editar"** en la etapa
2. Modifica las fechas que necesites
3. Opcionalmente, añade una razón de cambio
4. Haz clic en **"Actualizar"**

---

## 📊 Estados de las Etapas

| Estado | Significa | Qué sucede |
|--------|-----------|-----------|
| **Planificada** | Etapa configurada pero no abierta | Los estudiantes no ven la etapa |
| **Abierta** | Los estudiantes pueden entregar | Aceptan entregas dentro de fechas |
| **Cerrada** | Ya no acepta entregas | Inicia período de revisión |
| **Archivada** | Etapa finalizada | Se mantiene en historial pero oculta |

---

## 🔄 Ciclo de Vida Típico

```
Planificación (Admin crea etapas)
    ↓
Planificada (Etapa existe pero aún no abierta)
    ↓
Abierta (Admin abre la etapa)
    ├→ Estudiantes ven y pueden entregar
    ├→ Admin puede extender fechas si es necesario
    │
Cerrada (Admin cierra la etapa en la fecha)
    ├→ Ya no aceptan entregas normales
    ├→ Inicia revisión por tutor/revisor
    │
Archivada (Fin del semestre)
    └→ Etapa completada, se guarda en historial
```

---

## ⏰ Ejemplo Práctico: Semestre Completo

```
ENERO 2026
├─ 15 ene: Admin crea 4 etapas (planificadas)
│
└─ 20 ene: Admin abre "Anteproyecto"
   - Estudiantes pueden subir desde hoy
   - Límite: 10 febrero
   - Se cierra: 15 febrero

FEBRERO 2026
├─ 10 feb: Algunos estudiantes empiezan a entregar
│
├─ 15 feb: Admin cierra "Anteproyecto"
│  └─ Inicia revisión por tutores
│
├─ 25 feb: Admin abre "Entrega Parcial 1"
│  - Estudiantes pueden subir desde hoy
│  - Límite: 20 marzo
│
└─ (Admin puede extender si estudiantes lo solicitan)

MARZO 2026
└─ 20 mar: Admin cierra "Entrega Parcial 1"

ABRIL-MAYO 2026
└─ ... Se repite para cada etapa

JUNIO 2026
└─ Admin archiva todas las etapas
   └─ Semestre completado
```

---

## 🎨 Interfaz de Gestión

### Vista de Etapas (Cards)

Cada tarjeta muestra:
```
┌─────────────────────────────────┐
│ Anteproyecto          [ABIERTA]  │
├─────────────────────────────────┤
│ Número: 1                       │
│ Tipo: Documento                 │
│                                 │
│ Descripción de la etapa...      │
│                                 │
│ 📅 Apertura: 15 ene 2026, 00:00 │
│ 📅 Cierre: 15 feb 2026, 23:59   │
│ ⏰ Límite: 10 feb 2026, 23:59    │
│                                 │
│ ¿Qué entregar?                  │
│ Documento inicial del proyecto  │
├─────────────────────────────────┤
│ [Editar] [Cerrar] [Archivar]    │
└─────────────────────────────────┘
```

---

## ⚠️ Validaciones Importantes

### No puedes crear una etapa si:
- ❌ Ya existe una etapa con el mismo número de orden
- ❌ La fecha de cierre es antes que la de apertura

### Los estudiantes NO pueden entregar si:
- ❌ La etapa está en estado "planificada"
- ❌ La etapa está en estado "cerrada"
- ❌ Hoy es ANTES de la fecha de apertura
- ❌ Hoy es DESPUÉS de la fecha de cierre
- ❌ Hoy es DESPUÉS del límite de entrega (a menos que lo permitas)

### Ejemplo de error:
```
Error: La etapa 'Anteproyecto' no está abierta para entregas (estado actual: cerrada)
```

---

## 📋 Checklist Semanal para Admin

- [ ] Revisar etapas abiertas
- [ ] Verificar que hay estudiantes entregando
- [ ] Revisar que tutores estén revisando entregas
- [ ] Si hay solicitudes de extensión, editar la fecha límite
- [ ] Cerrar etapas cuando llegue la fecha

---

## 🔍 Ver Historial de Cambios

¿Alguien modificó una etapa? Puedes ver quién y cuándo:

1. Abre GestionEtapas
2. En la tarjeta de la etapa, haz clic en **"Editar"**
3. En el formulario verás el historial
4. Alternativamente, API: `GET /api/etapas/{id}/historial`

---

## 💡 Preguntas Frecuentes

### P: ¿Qué pasa si cierro la etapa pero todavía hay estudiantes entregando?
**R:** Una vez cerrada, no se aceptan nuevas entregas. Los estudiantes verán el error. Puedes reabrir (cambiar a "abierta") si es necesario.

### P: ¿Puedo cambiar las fechas después de crear la etapa?
**R:** Sí, haz clic en "Editar" y cambia lo que necesites. Se registra en el historial.

### P: ¿Qué pasa con las fechas si tengo un proyecto especial?
**R:** Puedes personalizar fechas por proyecto usando el endpoint `/api/etapas/proyecto/{id}/asignar`

### P: ¿Puedo tener entregas fuera del tiempo límite?
**R:** Sí, si marcas "Permitir entregas fuera de tiempo" al crear/editar la etapa.

### P: ¿Se notifica a los estudiantes cuando abro una etapa?
**R:** Actualmente no, pero en futuras versiones se pueden agregar notificaciones automáticas.

---

## 🔗 Integración con Otras Funciones

### Entregas
- Los estudiantes ven qué etapas están abiertas
- Solo pueden subir si la etapa está "abierta" y dentro de fechas
- El sistema valida automáticamente

### Reportes
- Próxima versión: Estadísticas de entregas por etapa
- Próxima versión: Tasa de cumplimiento de plazos

### Notificaciones
- Próxima versión: Recordatorios de límite de entrega
- Próxima versión: Alertas cuando se abren/cierran etapas

---

## 📞 Soporte

Si encuentras problemas o tienes sugerencias:
1. Revisa [GESTION_ETAPAS.md](GESTION_ETAPAS.md) para documentación técnica completa
2. Contacta al equipo de desarrollo
3. Reporta bugs en el sistema de issues

---

**Última actualización:** 7 de enero de 2026
**Versión:** 1.0
