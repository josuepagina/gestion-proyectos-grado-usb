# 📚 Guía de Gestión de Materias - Administrador

**Fecha de creación:** 17 de enero de 2026  
**Propósito:** Guía rápida para crear y gestionar materias y semestres en el sistema

---

## 📌 Resumen Rápido

La **Gestión de Materias** es un módulo administrativo que permite configurar las materias y semestres disponibles en el sistema, asociando etapas específicas a cada gestión.

### Materias Disponibles
| Semestre | Materia |
|----------|---------|
| **7mo** | Metodología de Investigación I |
| **8vo** | Metodología de Investigación II |
| **9no** | Taller de Grado I |
| **10mo** | Taller de Grado II |

---

## 🚀 Acceso

**URL:** `/gestiones`  
**Rol requerido:** Administrador  
**Ubicación en menú:** Administrador → Gestiones

---

## 📋 Funcionalidades Principales

### 1. **Crear Nueva Gestión**

#### Paso a paso:
1. Haz clic en el botón **"➕ Nueva Gestión"**
2. Completa el formulario con:
   - **Nombre Personalizado** (obligatorio)
     - Ejemplo: "Gestión 2025-I", "Proyectos Semestre 7"
   - **Semestre** (obligatorio)
     - Selecciona entre 7, 8, 9 o 10
   - **Materia** (automática)
     - Se asigna automáticamente según el semestre seleccionado
   - **Código de Materia** (opcional)
     - Ejemplo: "MET-101", "TAL-405"
   - **Descripción** (opcional)
     - Notas adicionales sobre la gestión

3. Haz clic en **"Crear Gestión"**

#### ℹ️ Nota Importante
La **materia se asigna automáticamente** según el semestre:
- Si seleccionas semestre 7 → Metodología de Investigación I
- Si seleccionas semestre 8 → Metodología de Investigación II
- Si seleccionas semestre 9 → Taller de Grado I
- Si seleccionas semestre 10 → Taller de Grado II

---

### 2. **Editar una Gestión**

#### Paso a paso:
1. Localiza la gestión que deseas editar en la lista
2. Haz clic en el botón **"✏️ Editar"** de esa tarjeta
3. El formulario se abrirá con los datos actuales
4. Realiza los cambios necesarios
5. Haz clic en **"Actualizar Gestión"**

#### ⚠️ Cambios permitidos:
- ✅ Nombre personalizado
- ✅ Semestre (y por tanto, materia asociada)
- ✅ Código de materia
- ✅ Descripción
- ✅ Estado (activa/inactiva)

---

### 3. **Archivar una Gestión**

#### Paso a paso:
1. Localiza la gestión que deseas archivar
2. Haz clic en el botón **"🗑️ Archivar"**
3. Confirma la acción en el diálogo de confirmación
4. La gestión se marcará como archivada y no aparecerá en la lista principal

#### ℹ️ Nota
- El archivo es **blando** (soft delete) - los datos se conservan en la base de datos
- Las gestiones archivadas se pueden consultar usando filtros

---

### 4. **Filtrar Gestiones**

#### Por Semestre:
1. Abre la sección de **Filtros**
2. En **"Filtrar por Semestre"**, selecciona el semestre deseado
3. La lista se actualiza automáticamente

#### Por Estado:
1. Abre la sección de **Filtros**
2. En **"Filtrar por Estado"**, selecciona:
   - **Activa** - Gestiones en uso
   - **Inactiva** - Gestiones deshabilitadas temporalmente
   - **Archivada** - Gestiones eliminadas

#### Limpiar Filtros:
- Haz clic en el botón **"Limpiar Filtros"** para resetear todos los filtros

---

## 🎨 Interfaz Visual

### Tarjeta de Gestión
Cada gestión se muestra como una tarjeta con:
- 📛 **Nombre personalizado**
- 📅 **Semestre** (7mo, 8vo, 9no, 10mo)
- 🏷️ **Estado** (badge de color)
  - Verde: Activa
  - Amarillo: Inactiva
  - Rojo: Archivada
- 📚 **Materia** (automática)
- 🔐 **Código de materia** (si existe)
- 📝 **Descripción** (si existe)
- 📆 **Fecha de creación**
- 🔧 **Botones de acción** (Editar, Archivar)

---

## 💡 Casos de Uso

### Caso 1: Preparar Sistema para nuevo semestre
```
1. Crea una nueva gestión con nombre "Gestión 2025-II"
2. Selecciona el semestre 7 (o el que corresponda)
3. La materia se asigna automáticamente
4. Agrega descripción: "Semestre febrero a junio 2025"
5. Configura las etapas asociadas (en otra sección)
```

### Caso 2: Gestionar múltiples semestres simultáneamente
```
1. Crea gestiones para cada semestre activo
2. Usa filtros para ver solo semestres específicos
3. Cada gestión mantiene su propia configuración
4. Los estudiantes verán la gestión según su semestre
```

### Caso 3: Reactivar una gestión anterior
```
1. Aplica filtro de estado "Archivada"
2. Edita la gestión que deseas reactivar
3. Cambia el estado de "Archivada" a "Activa"
4. Actualiza los cambios
```

---

## 🔍 Búsqueda y Filtros

### Filtros Disponibles:
- **Por Semestre:** 7mo, 8vo, 9no, 10mo
- **Por Estado:** Activa, Inactiva, Archivada
- **Combinados:** Puedes usar ambos filtros simultáneamente

### Ordenamiento:
- Las gestiones se muestran ordenadas por semestre (ascendente)
- Dentro del mismo semestre, se ordenan alfabéticamente por nombre

---

## ✅ Estados de Gestión

### Activa (Verde)
- Gestión en uso actual
- Los proyectos pueden asociarse a esta gestión
- Se muestra en listas principales

### Inactiva (Amarillo)
- Gestión temporalmente deshabilitada
- No se asignan nuevos proyectos
- Disponible para reactivar

### Archivada (Rojo)
- Gestión eliminada lógicamente
- Datos conservados para auditoría
- No aparece en lista principal sin filtro

---

## 🛡️ Validaciones

El sistema realiza las siguientes validaciones:

### Al Crear:
- ✓ El nombre es obligatorio
- ✓ El semestre es obligatorio (7, 8, 9 o 10)
- ✓ La materia se asigna automáticamente
- ✓ El código de materia es opcional
- ✓ La descripción es opcional

### Al Editar:
- ✓ El semestre no puede ser inválido
- ✓ Si cambias el semestre, la materia se actualiza automáticamente
- ✓ Los cambios se registran en historial (para auditoría)

---

## 📊 Datos Asociados

### Etapas
Cada gestión puede asociar etapas específicas:
- **Etapa 1:** Primera fase (ej: Propuesta)
- **Etapa 2:** Segunda fase (ej: Desarrollo)
- **Etapa 3+:** Fases adicionales

### Proyectos
Los proyectos de estudiantes se asociarán a una gestión específica según su semestre.

---

## 🚨 Mensajes Comunes

| Mensaje | Significado | Acción |
|---------|------------|--------|
| "Gestión creada exitosamente" | ✅ Creación OK | Nada - gestión disponible |
| "Gestión actualizada exitosamente" | ✅ Edición OK | Nada - cambios aplicados |
| "Gestión archivada exitosamente" | ✅ Archivo OK | Nada - archivada |
| "El nombre es requerido" | ❌ Falta nombre | Completa el campo nombre |
| "El semestre es requerido" | ❌ Falta semestre | Selecciona un semestre |
| "Ya existe una gestión con este nombre" | ❌ Nombre duplicado | Usa otro nombre |
| "Error al obtener gestiones" | ❌ Conexión | Recarga la página |

---

## 📱 Dispositivos

### Desktop / Laptop
- Vista completa con todos los filtros
- Grilla de gestiones de 3 columnas
- Interfaz óptima

### Tablet
- Vista adaptada
- Grilla de gestiones de 2 columnas
- Filtros visibles

### Móvil
- Vista simple
- Una gestión por fila
- Filtros apilados verticalmente

---

## 🔐 Permisos

Solo los usuarios con rol **Administrador** pueden:
- ✓ Ver el menú de Gestiones
- ✓ Crear nuevas gestiones
- ✓ Editar gestiones
- ✓ Archivar gestiones
- ✓ Ver historial de cambios (en estadísticas)

---

## 📝 Notas Importantes

1. **Materias automáticas:** No puedes cambiar la materia directamente. Se asigna según el semestre.

2. **Nombres únicos:** Aunque el sistema permite nombres duplicados, se recomienda usar nombres descriptivos y únicos (ej: "Gestión 2025-I", "Gestión 2025-II").

3. **Historial:** Todos los cambios se registran automáticamente para auditoría.

4. **Soft Delete:** Al archivar una gestión, los datos se conservan y pueden recuperarse si es necesario.

5. **Etapas:** Las etapas se asocian a gestiones en configuración separada (módulo de Etapas).

---

## 🆘 Troubleshooting

### Problema: No puedo crear una gestión
**Solución:** 
- Verifica que hayas completado el nombre
- Verifica que hayas seleccionado un semestre válido (7, 8, 9, 10)
- Recarga la página e intenta nuevamente

### Problema: La materia no se actualiza al cambiar de semestre
**Solución:**
- Esto es normal - debes guardar los cambios primero
- Haz clic en "Actualizar Gestión" para que se aplique el cambio

### Problema: No veo mi gestión archivada
**Solución:**
- Las gestiones archivadas están ocultas por defecto
- Usa el filtro de estado para seleccionar "Archivada"

### Problema: Error de conexión
**Solución:**
- Verifica tu conexión a internet
- Recarga la página
- Si persiste, contacta al equipo técnico

---

## 📞 Soporte

Si tienes preguntas o problemas:
1. Revisa esta guía completamente
2. Consulta la sección de FAQ en RESUMEN_EJECUTIVO.md
3. Contacta al equipo de desarrollo

---

**Última actualización:** 17 de enero de 2026  
**Versión:** 1.0  
**Estado:** Publicado
