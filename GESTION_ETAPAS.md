# Gestión de Etapas - Documentación Técnica

## Resumen General

Se ha implementado un sistema completo de **gestión de etapas** que permite al administrador:

1. **Crear y configurar etapas** del proyecto
2. **Controlar cuándo se abren y cierran** las etapas
3. **Delimitar tiempos de entrega** de documentos por cada etapa
4. **Hacer seguimiento** de cambios en etapas mediante historial

---

## 🗄️ Estructura de Base de Datos

### Tablas Nuevas

#### 1. **etapas** (Configuración Global)
```sql
CREATE TABLE etapas (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    numero_orden INTEGER UNIQUE,
    tipo: 'documento' | 'revision' | 'sustentacion' | 'correcciones',
    estado: 'planificada' | 'abierta' | 'cerrada' | 'archivada',
    fecha_apertura TIMESTAMP,      -- Cuándo se abre la etapa
    fecha_cierre TIMESTAMP,        -- Cuándo se cierra la etapa
    fecha_limite_entrega TIMESTAMP, -- Límite para subir documentos
    permitir_entregas_fuera_tiempo BOOLEAN,
    descripcion_entrega TEXT,       -- Qué debe entregarse
    criterios_evaluacion JSONB,    -- Criterios de evaluación
    archivos_plantilla JSONB,      -- URLs de plantillas
    requerimientos JSONB,          -- Requerimientos específicos
    created_by UUID REFERENCES usuarios(id)
)
```

#### 2. **etapa_proyecto** (Personalización por Proyecto)
Permite tener calendarios personalizados por proyecto si es necesario:
```sql
CREATE TABLE etapa_proyecto (
    id UUID PRIMARY KEY,
    etapa_id UUID REFERENCES etapas(id),
    proyecto_id UUID REFERENCES proyectos(id),
    fecha_apertura_proyecto TIMESTAMP,  -- Sobrescribe fecha global
    fecha_cierre_proyecto TIMESTAMP,    -- Sobrescribe fecha global
    fecha_limite_entrega_proyecto TIMESTAMP, -- Sobrescribe fecha global
    activa BOOLEAN
)
```

#### 3. **etapas_historial** (Auditoría)
Registra todos los cambios realizados en las etapas:
```sql
CREATE TABLE etapas_historial (
    id UUID PRIMARY KEY,
    etapa_id UUID REFERENCES etapas(id),
    accion VARCHAR(50): 'creacion' | 'cambio_estado' | 'cambio_fechas' | 'cambio_criterios',
    datos_antiguos JSONB,
    datos_nuevos JSONB,
    razon_cambio TEXT,
    realizado_por UUID REFERENCES usuarios(id),
    fecha TIMESTAMP
)
```

---

## 🔌 Endpoints Backend

### URL Base: `/api/etapas`

#### 1. **GET /etapas**
Obtener todas las etapas activas
```json
{
  "success": true,
  "etapas": [
    {
      "id": "uuid",
      "nombre": "Anteproyecto",
      "numero_orden": 1,
      "estado": "abierta",
      "fecha_apertura": "2026-01-15T00:00:00Z",
      "fecha_cierre": "2026-02-15T23:59:59Z",
      "fecha_limite_entrega": "2026-02-10T23:59:59Z"
    }
  ]
}
```

#### 2. **POST /etapas** (Admin Only)
Crear una nueva etapa
```json
{
  "nombre": "Entrega Parcial 1",
  "descripcion": "Primera entrega de avance",
  "numero_orden": 2,
  "tipo": "documento",
  "fecha_apertura": "2026-02-20T00:00:00Z",
  "fecha_cierre": "2026-03-20T23:59:59Z",
  "fecha_limite_entrega": "2026-03-15T23:59:59Z",
  "permitir_entregas_fuera_tiempo": false,
  "descripcion_entrega": "Avance del 30% del proyecto"
}
```

#### 3. **PUT /etapas/{id}** (Admin Only)
Actualizar una etapa existente
```json
{
  "estado": "abierta",  // Cambiar estado
  "fecha_cierre": "2026-03-25T23:59:59Z",
  "razon_cambio": "Extensión solicitada por estudiantes"
}
```

**Transiciones de Estado Válidas:**
- `planificada` → `abierta`, `archivada`
- `abierta` → `cerrada`, `archivada`
- `cerrada` → `archivada`
- `archivada` → (no hay transiciones)

#### 4. **DELETE /etapas/{id}** (Admin Only)
Archivar una etapa (soft delete)

#### 5. **GET /etapas/proyecto/{proyectoId}**
Obtener etapas activas de un proyecto con fechas efectivas
```json
{
  "success": true,
  "etapas": [
    {
      "id": "uuid",
      "nombre": "Anteproyecto",
      "fecha_apertura_efectiva": "2026-01-15T00:00:00Z",
      "fecha_cierre_efectiva": "2026-02-15T23:59:59Z",
      "fecha_limite_efectiva": "2026-02-10T23:59:59Z"
    }
  ]
}
```

#### 6. **POST /etapas/proyecto/{proyectoId}/asignar** (Admin Only)
Asignar una etapa a un proyecto con fechas personalizadas
```json
{
  "etapa_id": "uuid",
  "fecha_apertura_proyecto": "2026-02-01T00:00:00Z",
  "fecha_cierre_proyecto": "2026-03-01T23:59:59Z",
  "fecha_limite_entrega_proyecto": "2026-02-28T23:59:59Z"
}
```

#### 7. **GET /etapas/{id}/historial**
Obtener historial de cambios de una etapa
```json
{
  "success": true,
  "historial": [
    {
      "id": "uuid",
      "accion": "cambio_estado",
      "datos_antiguos": { "estado": "planificada" },
      "datos_nuevos": { "estado": "abierta" },
      "razon_cambio": "Inicio del período de entregas",
      "realizado_por_nombre": "Admin Usuario",
      "fecha": "2026-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🎨 Interfaz Frontend

### Componente: `GestionEtapas.tsx`

**Ubicación:** `/frontend/src/pages/GestionEtapas.tsx`

**Ruta:** `/etapas` (Solo accesible para administradores)

**Funcionalidades:**

1. **Listar todas las etapas**
   - Tarjetas con información completa
   - Badge de estado color-coded
   - Información de fechas y límites

2. **Crear nueva etapa**
   - Formulario con validación
   - Campo para número de orden único
   - Selección de tipo de etapa
   - Configuración de fechas

3. **Editar etapa**
   - Modificar cualquier campo
   - Cambiar estado (con validaciones)
   - Registrar razón del cambio

4. **Cambiar estado**
   - Botones contextuales
   - "Abrir" (planificada → abierta)
   - "Cerrar" (abierta → cerrada)
   - Validación de transiciones

5. **Archivar etapa**
   - Confirmación antes de archivar

**Estilos:**
- Responsivo (Mobile, Tablet, Desktop)
- Animaciones suaves
- Color-coded badges por estado
- Grid layout adaptable

---

## ✅ Validaciones en Entregas

### Sistema de Control de Entregas por Etapa

Cuando un estudiante intenta subir un documento, el sistema valida:

```typescript
// 1. La etapa debe estar ABIERTA
if (etapa.estado !== 'abierta') {
  error: "La etapa no está abierta para entregas"
}

// 2. La fecha actual debe estar DENTRO del período de apertura/cierre
if (fecha_actual < fecha_apertura) {
  error: "La etapa aún no se ha abierto"
}
if (fecha_actual > fecha_cierre) {
  error: "La etapa ha sido cerrada"
}

// 3. Validar límite de entrega
if (fecha_actual > fecha_limite_entrega) {
  if (!permitir_entregas_fuera_tiempo) {
    error: "Se ha excedido el límite de entrega"
  }
  // Si permite entregas fuera de tiempo, continuar pero registrar
}
```

**Respuestas de Error:**
```json
{
  "error": "La etapa 'Anteproyecto' no está abierta para entregas (estado actual: cerrada)",
  "etapa_estado": "cerrada"
}
```

---

## 🔄 Flujo Típico de Administración

### 1. Planificación (Antes del semestre)
```
Admin crea etapas:
  - Etapa 1: Anteproyecto (planificada)
  - Etapa 2: Entrega Parcial 1 (planificada)
  - Etapa 3: Entrega Parcial 2 (planificada)
  - Etapa 4: Versión Final (planificada)
```

### 2. Apertura (Durante el semestre)
```
Admin abre cada etapa en su momento:
  - Cambia estado: planificada → abierta
  - Los estudiantes pueden ver la etapa como "disponible"
  - Los estudiantes pueden subir documentos
```

### 3. Cierre (Cuando llega el límite)
```
Admin cierra la etapa:
  - Cambia estado: abierta → cerrada
  - Ya no se aceptan entregas (a menos que se permita)
  - Tutor/Revisor inician revisiones
```

### 4. Archivado (Fin del semestre)
```
Admin archiva la etapa:
  - Cambia estado: * → archivada
  - La etapa ya no aparece en listas
  - Se mantiene en historial para auditoría
```

---

## 📊 Casos de Uso

### Caso 1: Extensión de Plazo
```
Admin quiere extender el plazo del Anteproyecto 2 semanas

1. Abre GestionEtapas
2. Busca "Anteproyecto"
3. Hace click en "Editar"
4. Cambia fecha_limite_entrega a 2 semanas después
5. Añade razon_cambio: "Solicitud de estudiantes"
6. Guarda - Se registra en historial
```

### Caso 2: Abrir Nueva Etapa
```
Admin quiere abrir "Entrega Parcial 1"

1. Abre GestionEtapas
2. Encuentra la tarjeta de "Entrega Parcial 1" (estado: planificada)
3. Hace click en botón "Abrir"
4. Se cambia estado a "abierta"
5. Los estudiantes pueden ver y entregar documentos
```

### Caso 3: Personalizar Fechas por Proyecto
```
Admin quiere diferentes fechas para un proyecto especial

1. Va a /api/etapas/proyecto/{proyectoId}/asignar
2. POST con etapa_id y fechas_proyecto personalizadas
3. El sistema usa esas fechas en lugar de las globales
```

---

## 🔐 Seguridad y Permisos

| Operación | Estudiante | Tutor | Revisor | Admin |
|-----------|-----------|--------|---------|-------|
| Ver etapas | ✅ | ✅ | ✅ | ✅ |
| Crear etapa | ❌ | ❌ | ❌ | ✅ |
| Editar etapa | ❌ | ❌ | ❌ | ✅ |
| Cambiar estado | ❌ | ❌ | ❌ | ✅ |
| Archivar etapa | ❌ | ❌ | ❌ | ✅ |
| Ver historial | ❌ | ❌ | ❌ | ✅ |
| Subir entrega | ✅ (si etapa abierta) | ❌ | ❌ | ❌ |

---

## 📈 Próximos Pasos Recomendados

1. **Integración con Reportes**
   - Dashboard de etapas activas/cerradas
   - Estadísticas de entregas por etapa
   - Tasa de cumplimiento de plazos

2. **Notificaciones Automáticas**
   - Notificar a estudiantes cuando se abre una etapa
   - Recordatorios de límite de entrega
   - Alertas cuando se cierran etapas

3. **Plantillas Descargables**
   - Permite que admin cargue plantillas por etapa
   - Los estudiantes descargan la plantilla de la etapa

4. **Criterios de Evaluación**
   - Mostrar criterios específicos de cada etapa
   - Los tutores evalúan según los criterios

---

## 🐛 Testing

### Casos de Test Recomendados

```bash
# Backend - Jest tests
npm test -- etapas.test.ts

# Frontend - React Testing Library
npm test -- GestionEtapas.test.tsx
```

### Validaciones a Probar
- [ ] No se puede crear dos etapas con mismo número
- [ ] Las transiciones de estado son válidas
- [ ] Las fechas de cierre > apertura
- [ ] Un estudiante no puede subir si etapa está cerrada
- [ ] Historial registra todos los cambios
- [ ] Las fechas por proyecto sobrescriben las globales
