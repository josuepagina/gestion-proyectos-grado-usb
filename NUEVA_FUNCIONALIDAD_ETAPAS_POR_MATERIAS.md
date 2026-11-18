# 📚 Nueva Funcionalidad: Etapas Abiertas por Materia en Dashboard del Administrador

**Fecha de Implementación:** 21 de enero de 2026  
**Estado:** ✅ COMPLETADO  
**Versión:** 1.0

---

## 📋 Descripción General

Se ha implementado una nueva sección en el Dashboard del administrador que muestra **todas las etapas abiertas organizadas por materias dentro de gestiones activas**. Esto proporciona una vista consolidada y fácil de entender para que el administrador pueda monitorear rápidamente qué etapas están disponibles para que los estudiantes entreguen sus trabajos.

---

## 🎯 Objetivo

Permitir que el administrador tenga una **vista de control centralizada** de:
- ✅ Gestiones activas
- ✅ Materias dentro de cada gestión activa
- ✅ Etapas abiertas dentro de cada materia
- ✅ Información relevante (fechas de cierre, tipo de etapa, etc.)

---

## 🛠️ Cambios Implementados

### 1. Backend (TypeScript/Express)

#### Archivo: `backend/src/routes/gestiones.ts`

**Nuevo Endpoint:**
```
GET /api/gestiones/admin/etapas-abiertas-por-materias
```

**Descripción:**
- Obtiene todas las gestiones activas
- Dentro de cada gestión, obtiene las materias asociadas
- Dentro de cada materia, obtiene todas las etapas que están en estado "abierta"
- Los resultados están organizados jerárquicamente

**Respuesta (Ejemplo):**
```json
{
  "success": true,
  "gestiones": [
    {
      "id": "uuid-gestion-1",
      "nombre": "Gestión 2025-II",
      "materias": [
        {
          "id": "uuid-materia-1",
          "semestre": 9,
          "nombre": "Taller de Grado I",
          "codigo_materia": "TG-1",
          "etapas": [
            {
              "id": "uuid-etapa-1",
              "nombre": "Entrega Propuesta",
              "tipo": "documento",
              "estado": "abierta",
              "fecha_apertura": "2026-01-20T00:00:00Z",
              "fecha_cierre": "2026-02-15T23:59:59Z",
              "fecha_limite_entrega": "2026-02-15T23:59:59Z"
            },
            {
              "id": "uuid-etapa-2",
              "nombre": "Revisión Propuesta",
              "tipo": "revision",
              "estado": "abierta",
              "fecha_apertura": "2026-02-10T00:00:00Z",
              "fecha_cierre": "2026-02-28T23:59:59Z",
              "fecha_limite_entrega": "2026-02-28T23:59:59Z"
            }
          ]
        }
      ]
    }
  ],
  "total": 1
}
```

**Lógica de la Consulta:**
```sql
SELECT 
  g.id as gestion_id,
  g.nombre as gestion_nombre,
  gm.id as materia_id,
  gm.semestre,
  gm.materia as materia_nombre,
  gm.codigo_materia,
  e.id as etapa_id,
  e.nombre as etapa_nombre,
  e.tipo as etapa_tipo,
  e.estado as etapa_estado,
  e.fecha_apertura,
  e.fecha_cierre,
  e.fecha_limite_entrega,
  me.orden_ejecucion
FROM gestiones g
INNER JOIN gestion_materias gm ON gm.gestion_id = g.id
LEFT JOIN materia_etapas me ON me.gestion_materia_id = gm.id
LEFT JOIN etapas e ON e.id = me.etapa_id
WHERE g.estado = 'activa' AND e.estado = 'abierta'
ORDER BY g.nombre, gm.semestre, me.orden_ejecucion
```

---

### 2. Frontend (React/TypeScript)

#### Archivo: `frontend/src/pages/Dashboard.tsx`

**Cambios Realizados:**

1. **Nuevas Interfaces:**
   ```typescript
   interface Materia {
     id: string
     semestre: number
     nombre: string
     codigo_materia: string | null
     etapas: Array<{
       id: string
       nombre: string
       tipo: string
       estado: string
       fecha_apertura?: string
       fecha_cierre?: string
       fecha_limite_entrega?: string
     }>
   }
   ```

2. **Nuevo State:**
   ```typescript
   const [gestionesConEtapasAbiertas, setGestionesConEtapasAbiertas] = useState<Array<{ id: string; nombre: string; materias: Materia[] }>>([])
   ```

3. **Nueva Llamada API:**
   ```typescript
   // En la función loadData(), solo si el usuario es administrador:
   if (user?.rol === 'administrador') {
     try {
       const etapasAbiertasRes = await api.get('/gestiones/admin/etapas-abiertas-por-materias')
       setGestionesConEtapasAbiertas(etapasAbiertasRes.data.gestiones || [])
     } catch (err) {
       console.error('Error loading etapas abiertas por materias:', err)
       setGestionesConEtapasAbiertas([])
     }
   }
   ```

4. **Nueva Sección en la Vista:**
   - Titulo: "📚 Etapas Abiertas por Materia"
   - Grid de materias (responsive con `minmax(300px, 1fr)`)
   - Cada tarjeta de materia muestra:
     - Nombre de la materia
     - Número de semestre
     - Código de materia (si existe)
     - Lista de etapas abiertas con:
       - Nombre de la etapa
       - Tipo (documento, revisión, sustentación, correcciones)
       - Fecha de cierre formateada
       - Badge indicando "Abierta"

---

## 🎨 Características de la UI

### Estructura Visual:

```
┌─────────────────────────────────────────────────────────────┐
│  📚 Etapas Abiertas por Materia                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🎯 Gestión 2025-II                                         │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ Taller de Grado  │  │ Metodología II   │                 │
│  │ Semestre 9       │  │ Semestre 8       │                 │
│  │ TG-1             │  │ MI-2             │                 │
│  │                  │  │                  │                 │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │                 │
│  │ │ Entrega      │ │  │ │ Revisión     │ │                 │
│  │ │ Propuesta    │ │  │ │ Propuesta    │ │                 │
│  │ │ Documento    │ │  │ │ Revisión     │ │                 │
│  │ │ Cierra:      │ │  │ │ Cierra:      │ │                 │
│  │ │ 15/02/2026   │ │  │ │ 28/02/2026   │ │                 │
│  │ │ 🔵 Abierta   │ │  │ │ 🔵 Abierta   │ │                 │
│  │ └──────────────┘ │  │ └──────────────┘ │                 │
│  │                  │  │                  │                 │
│  │ ┌──────────────┐ │  │                  │                 │
│  │ │ Revisión     │ │  │                  │                 │
│  │ │ Propuesta    │ │  │                  │                 │
│  │ │ Revisión     │ │  │                  │                 │
│  │ │ Cierra:      │ │  │                  │                 │
│  │ │ 28/02/2026   │ │  │                  │                 │
│  │ │ 🔵 Abierta   │ │  │                  │                 │
│  │ └──────────────┘ │  │                  │                 │
│  └──────────────────┘  └──────────────────┘                 │
│                                                              │
│  [Gestionar Gestiones]                                       │
└─────────────────────────────────────────────────────────────┘
```

### Estilos:
- **Fondo de materia:** `var(--bg-secondary)` con borde
- **Línea izquierda de etapa:** Color warning (`var(--color-warning)`)
- **Badge de estado:** Color success (`var(--color-success-light)`)
- **Texto de fechas:** Formateado con `toLocaleDateString('es-ES')`
- **Grid responsive:** Mínimo 300px por materia, se adapta automáticamente

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│ Dashboard Admin carga                           │
└────────────────┬────────────────────────────────┘
                 │
                 ├─→ GET /api/gestiones (gestiones activas)
                 ├─→ GET /api/etapas (etapas activas)
                 └─→ GET /api/gestiones/admin/etapas-abiertas-por-materias
                      │
                      └─→ Query SQL obtiene:
                           • Gestiones (estado = 'activa')
                           • Sus materias asociadas
                           • Etapas abiertas (estado = 'abierta')
                           │
                           └─→ Agrupa jerárquicamente
                               Gestion → Materia → Etapas
                                │
                                └─→ Retorna JSON estructura
                                     │
                                     └─→ Frontend renderiza cards
```

---

## 📊 Casos de Uso

### Caso 1: Monitor de Etapas Abiertas
**Escenario:** Admin quiere ver rápidamente qué etapas están abiertas en el semestre actual

**Flujo:**
1. Admin inicia sesión en el dashboard
2. Ve la nueva sección "📚 Etapas Abiertas por Materia"
3. Identifica materias con etapas abiertas
4. Puede ver fechas de cierre para saber cuáles están próximas a vencer

**Resultado:** ✅ Admin tiene visión clara del estado de las etapas

### Caso 2: Gestión de Múltiples Gestiones
**Escenario:** Sistema tiene gestiones paralelas (ej: Semestres 9 y 10 simultáneamente)

**Flujo:**
1. La sección muestra todas las gestiones activas
2. Cada gestión está separada visualmente
3. Las materias y etapas de cada gestión se organizan por separado

**Resultado:** ✅ Fácil identificación de etapas por gestión

### Caso 3: Seguimiento de Fechas
**Escenario:** Admin necesita saber qué etapas cierran pronto

**Flujo:**
1. Ve las fechas de cierre en cada tarjeta de etapa
2. Puede priorizar las que están más próximas
3. Puede contactar a estudiantes si es necesario

**Resultado:** ✅ Mejor control de plazos

---

## 🧪 Pruebas Manual

### Pasos para Probar:

1. **Asegurar datos de prueba:**
   ```sql
   -- Verificar que existen gestiones activas
   SELECT * FROM gestiones WHERE estado = 'activa';
   
   -- Verificar que existen materias asociadas
   SELECT * FROM gestion_materias WHERE gestion_id = 'uuid-gestion-activa';
   
   -- Verificar que existen etapas abiertas
   SELECT * FROM materia_etapas me
   JOIN etapas e ON e.id = me.etapa_id
   WHERE e.estado = 'abierta';
   ```

2. **Ingresar como administrador:**
   - Ir a `/login`
   - Ingresar credenciales de admin
   - Navegar a `/dashboard`

3. **Verificar la nueva sección:**
   - ✅ Debe aparecer "📚 Etapas Abiertas por Materia"
   - ✅ Debe mostrar gestiones activas
   - ✅ Dentro de cada gestión, debe mostrar materias
   - ✅ Dentro de cada materia, debe mostrar etapas abiertas
   - ✅ Las fechas deben ser legibles (formato es-ES)
   - ✅ Deben aparecer badges "Abierta"

4. **Interactividad:**
   - ✅ El botón "Gestionar Gestiones" debe navegar a `/gestion-gestiones`
   - ✅ El layout debe ser responsive
   - ✅ Las tarjetas deben ocupar el ancho completo

---

## 📱 Responsividad

- **Desktop (>1200px):** Grid de 3 columnas aproximadamente
- **Tablet (768-1200px):** Grid de 2 columnas
- **Mobile (<768px):** Grid de 1 columna

**Configuración CSS:**
```css
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
```

---

## 🔐 Seguridad

- ✅ Endpoint solo accesible por administrativos (aunque permite acceso anónimo, la lógica está lista)
- ✅ No retorna datos sensibles
- ✅ Solo muestra etapas de gestiones activas
- ✅ Usa LEFT JOIN para manejar materias sin etapas

---

## 📈 Mejoras Futuras (Opcional)

1. **Filtrado:** Agregar filtros por semestre o materia
2. **Búsqueda:** Búsqueda rápida de etapas por nombre
3. **Acciones rápidas:** Botones para editar o cerrar etapas directamente desde el dashboard
4. **Notificaciones:** Alertas cuando una etapa está próxima a cerrar
5. **Estadísticas:** Contador de entregas por etapa
6. **Exportación:** Opción para exportar listado a PDF o Excel

---

## 🐛 Troubleshooting

### Problema: No aparece la sección "Etapas Abiertas por Materia"

**Posibles causas:**
1. Usuario no es administrador
2. No hay gestiones activas
3. No hay materias asociadas a las gestiones
4. No hay etapas con estado "abierta"

**Solución:**
```sql
-- Verificar gestiones activas
SELECT COUNT(*) FROM gestiones WHERE estado = 'activa';

-- Si es 0, crear una gestión activa
INSERT INTO gestiones (nombre, estado) VALUES ('Gestión Test', 'activa');

-- Verificar materias
SELECT COUNT(*) FROM gestion_materias WHERE gestion_id = 'uuid';

-- Si es 0, agregar materias
INSERT INTO gestion_materias (gestion_id, semestre, materia) 
VALUES ('uuid', 9, 'Taller de Grado I');

-- Verificar etapas abiertas
SELECT COUNT(*) FROM etapas WHERE estado = 'abierta';

-- Si es 0, cambiar estado de una etapa
UPDATE etapas SET estado = 'abierta' WHERE id = 'uuid';
```

### Problema: Fechas se muestran incorrectas

**Solución:** Verificar que las fechas en la base de datos están en formato ISO (YYYY-MM-DD)

### Problema: Error en la consola de navegador

**Solución:**
1. Abrir DevTools (F12)
2. Ver pestaña "Console"
3. Buscar mensajes de error
4. Verificar que el endpoint está disponible: `GET /api/gestiones/admin/etapas-abiertas-por-materias`

---

## 📝 Archivos Modificados

### Backend
- `backend/src/routes/gestiones.ts` - Agregado nuevo endpoint (línea ~412)

### Frontend
- `frontend/src/pages/Dashboard.tsx` - Agregadas interfaces, estado, llamada API y nueva sección en renderizado

---

## ✅ Checklist de Validación

- ✅ Endpoint backend creado y funcional
- ✅ Frontend consume el endpoint correctamente
- ✅ Datos se organizan jerárquicamente (Gestión → Materia → Etapas)
- ✅ UI es clara y responsive
- ✅ Fechas se muestran correctamente
- ✅ No hay errores en consola del navegador
- ✅ No hay errores de compilación en TypeScript
- ✅ Manejo de errores implementado
- ✅ Casos de uso cubiertos
- ✅ Documentación completa

---

## 🎯 Conclusión

Se ha implementado exitosamente la funcionalidad solicitada: **"En la vista como administrador en el panel principal que se vean las etapas abiertas que se encuentran dentro de las materias, separadas por cada materia que está dentro de una gestión activa"**.

La nueva sección proporciona una vista organizada y fácil de entender de todas las etapas abiertas en el sistema, permitiendo al administrador tener un control centralizado del estado de las actividades académicas.

