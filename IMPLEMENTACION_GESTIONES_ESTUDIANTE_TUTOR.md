# Implementación: Gestiones y Etapas en Dashboard de Estudiante y Tutor

## Descripción
Se ha implementado la funcionalidad para que estudiantes y tutores puedan visualizar en el panel principal (Dashboard) las gestiones activas y las etapas abiertas por materia de los proyectos en los que están incluidos.

## Cambios Realizados

### Backend

#### 1. Nuevo Endpoint en `backend/src/routes/gestiones.ts`

**Ruta:** `GET /api/gestiones/usuario/activas-por-proyectos`

**Descripción:** Obtiene las gestiones activas y etapas abiertas de los proyectos del usuario actual (estudiante o tutor).

**Características:**
- Está protegido con autenticación (`authenticate`)
- Filtra automáticamente según el rol del usuario:
  - **Estudiante:** Ve gestiones de sus proyectos (donde es estudiante_id)
  - **Tutor:** Ve gestiones de sus proyectos (donde es tutor_id)
- Retorna las gestiones agrupadas por materia y etapas abiertas
- Solo muestra etapas que NO están archivadas

**Respuesta:**
```json
{
  "success": true,
  "gestiones": [
    {
      "id": "uuid",
      "nombre": "Gestión 2026",
      "materias": [
        {
          "id": "uuid",
          "semestre": 9,
          "nombre": "Taller de Grado I",
          "codigo_materia": "TDG101",
          "etapas": [
            {
              "id": "uuid",
              "nombre": "Propuesta del Proyecto",
              "tipo": "documento",
              "estado": "abierta",
              "fecha_apertura": "2026-01-24",
              "fecha_cierre": "2026-02-24",
              "fecha_limite_entrega": "2026-02-23"
            }
          ]
        }
      ]
    }
  ],
  "total": 1
}
```

### Frontend

#### 1. Modificación de `frontend/src/pages/Dashboard.tsx`

**Cambios en la función `loadData()`:**
- Se agregó una llamada al nuevo endpoint `/gestiones/usuario/activas-por-proyectos` para estudiantes y tutores
- Los datos se almacenan en `gestionesConEtapasAbiertas` (reutilizando el estado existente)

**Cambios en el JSX:**
- Se agregó una nueva sección visible para estudiantes y tutores que muestra:
  - Nombre de la gestión activa
  - Materias con sus materias asociadas
  - Etapas abiertas para cada materia con:
    - Nombre de la etapa
    - Tipo de etapa (documento, revisión, sustentación, correcciones)
    - Estado
    - Fecha de cierre

**Orden de visualización:**
- Para estudiantes y tutores:
  1. Gestiones activas y etapas abiertas (si existen)
  2. Etapas abiertas de proyectos específicos (solo estudiante, si existen)
  3. Mis Proyectos / Proyectos Asignados
  4. Notificaciones

## Datos que Se Muestran

### Para Estudiante y Tutor:

1. **Gestiones Activas y Etapas por Materia**
   - Solo muestra gestiones en estado "activa"
   - Solo etapas que no estén archivadas
   - Información incluida:
     - Nombre de la gestión
     - Semestre de la materia
     - Código de la materia (si existe)
     - Etapas abiertas con sus detalles

2. **Filtrado por Proyecto:**
   - El endpoint automáticamente obtiene los proyectos del usuario y solo muestra las gestiones relacionadas
   - Estudiante: Ve sus proyectos (donde es estudiante_id)
   - Tutor: Ve sus proyectos asignados (donde es tutor_id)

## Flujo de Datos

```
Usuario (Estudiante/Tutor)
    ↓
GET /gestiones/usuario/activas-por-proyectos
    ↓
Backend obtiene:
  1. Proyectos del usuario (filtra por rol)
  2. Gestiones activas con sus materias
  3. Etapas asociadas a cada materia (estado != 'archivada')
    ↓
Agrupa datos por: Gestión → Materia → Etapas
    ↓
Frontend: Muestra en el Dashboard con cards visuales
```

## Estructura de Base de Datos Utilizada

- **Tabla `gestiones`:** Gestiones activas/inactivas/archivadas
- **Tabla `gestion_materias`:** Relación entre gestiones y materias
- **Tabla `materia_etapas`:** Etapas asociadas a cada materia
- **Tabla `etapas`:** Información detallada de cada etapa
- **Tabla `proyectos`:** Proyectos del usuario con student_id/tutor_id

## Estilos Aplicados

El dashboard utiliza:
- Grid CSS con columnas responsivas
- Cards con bordes y colores diferenciados
- Badges para estados
- Iconos Unicode (🎯, 📚) para mayor claridad
- Bordes izquierdos de color amarillo para etapas abiertas

## Testing Manual

Para verificar la funcionalidad:

1. Inicia sesión como **estudiante** o **tutor**
2. Ve al Dashboard (panel principal)
3. Debería ver la sección "📚 Etapas Abiertas por Materia" si hay:
   - Gestiones activas
   - Materias en esas gestiones
   - Etapas no archivadas en esas materias
4. Los datos mostrados corresponden solo a los proyectos del usuario

## Notas de Implementación

- El endpoint está protegido y solo accesible por usuarios autenticados
- Los estudiantes y tutores con el rol "revisor" o "administrador" no verán esta sección
- La información se obtiene dinámicamente en cada carga del dashboard
- Los datos se agrupan en el backend para mejor rendimiento
- No se incluyen etapas archivadas ni en estado "planificada"

## Próximos Pasos (Opcional)

Si se desea mejorar:
1. Agregar paginación si hay muchas gestiones
2. Agregar filtros por semestre
3. Agregar contador de etapas pendientes por material
4. Implementar una vista detallada de cada gestión
5. Agregar notificaciones cuando se abren nuevas etapas
