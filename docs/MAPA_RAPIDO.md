# 🗺️ Mapa Rápido - Sistema de Gestión de Etapas

**Creado:** 7 de enero de 2026 | **Propósito:** Acceso rápido a información

---

## 🎯 ¿Qué necesito?

### ⚡ En 30 segundos
**Link:** [`RESUMEN_EJECUTIVO.md` - Objetivo Cumplido](RESUMEN_EJECUTIVO.md#-objetivo-cumplido)

### ⏱️ En 2 minutos
**Link:** [`RESUMEN_EJECUTIVO.md` - ¿Qué Cambió?](RESUMEN_EJECUTIVO.md#-qué-cambió)

### 📋 En 5 minutos
**Link:** [`RESUMEN_EJECUTIVO.md` completo](RESUMEN_EJECUTIVO.md)

### 📚 En 15 minutos
**Link:** [`GUIA_ETAPAS_ADMIN.md`](GUIA_ETAPAS_ADMIN.md)

### 🔧 En 30 minutos
**Link:** [`GESTION_ETAPAS.md`](GESTION_ETAPAS.md)

### 📊 Visuales
**Link:** [`DIAGRAMAS_UML.md` - Sección Etapas](DIAGRAMAS_UML.md#-diagrama-de-estados---gestión-de-etapas)

---

## 👤 Busco por Mi Rol

```
┌─────────────────────────────────────────────────────────┐
│                   ADMINISTRADOR                         │
├─────────────────────────────────────────────────────────┤
│ 1. Lee: RESUMEN_EJECUTIVO.md (5 min)                   │
│ 2. Lee: GUIA_ETAPAS_ADMIN.md (20 min)                  │
│ 3. Usa: Panel en /etapas                               │
│ 4. Si duda: Revisa FAQ en GUIA_ETAPAS_ADMIN.md         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            DESARROLLADOR BACKEND                        │
├─────────────────────────────────────────────────────────┤
│ 1. Lee: CHANGELOG_ETAPAS.md (15 min)                   │
│ 2. Lee: GESTION_ETAPAS.md (35 min)                     │
│ 3. Lee: backend/src/routes/etapas.ts (30 min)          │
│ 4. Ve: Diagrama de Secuencia en DIAGRAMAS_UML.md       │
│ 5. Testing: Casos en CHANGELOG_ETAPAS.md               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            DESARROLLADOR FRONTEND                       │
├─────────────────────────────────────────────────────────┤
│ 1. Lee: RESUMEN_EJECUTIVO.md (5 min)                   │
│ 2. Lee: GUIA_ETAPAS_ADMIN.md (15 min)                  │
│ 3. Lee: frontend/src/pages/GestionEtapas.tsx (25 min)  │
│ 4. Lee: frontend/src/pages/GestionEtapas.css (10 min)  │
│ 5. Ve: Diagrama de Estados en DIAGRAMAS_UML.md         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   QA / TESTER                           │
├─────────────────────────────────────────────────────────┤
│ 1. Lee: RESUMEN_EJECUTIVO.md (5 min)                   │
│ 2. Lee: GUIA_ETAPAS_ADMIN.md - Casos de uso (20 min)   │
│ 3. Lee: GESTION_ETAPAS.md - Validaciones (15 min)      │
│ 4. Lee: CHANGELOG_ETAPAS.md - Testing (10 min)         │
│ 5. Crea: Casos de test basados en validaciones         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              GERENTE / STAKEHOLDER                      │
├─────────────────────────────────────────────────────────┤
│ 1. Lee: RESUMEN_EJECUTIVO.md (10 min)                  │
│ Ve: Diagramas (5 min)                                  │
│ Ve: Métricas (2 min)                                   │
│ Conoce: Beneficios y ROI                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Busco por Pregunta

### ❓ Preguntas Comunes

#### "¿Cómo creo una etapa?"
→ [`GUIA_ETAPAS_ADMIN.md#crear-una-nueva-etapa`](GUIA_ETAPAS_ADMIN.md)

#### "¿Cómo abro una etapa?"
→ [`GUIA_ETAPAS_ADMIN.md#abrir-una-etapa`](GUIA_ETAPAS_ADMIN.md)

#### "¿Cómo cierro una etapa?"
→ [`GUIA_ETAPAS_ADMIN.md#cerrar-una-etapa`](GUIA_ETAPAS_ADMIN.md)

#### "¿Cómo extiendo el plazo?"
→ [`GUIA_ETAPAS_ADMIN.md#extender-fechas`](GUIA_ETAPAS_ADMIN.md)

#### "¿Cuáles son los estados?"
→ [`RESUMEN_EJECUTIVO.md#-estados-de-una-etapa`](RESUMEN_EJECUTIVO.md)

#### "¿Qué endpoints hay?"
→ [`GESTION_ETAPAS.md#endpoints-backend`](GESTION_ETAPAS.md)

#### "¿Cómo se validan entregas?"
→ [`GESTION_ETAPAS.md#validaciones-en-entregas`](GESTION_ETAPAS.md)

#### "¿Qué archivos cambiaron?"
→ [`CHANGELOG_ETAPAS.md`](CHANGELOG_ETAPAS.md)

#### "¿Cómo es el flujo?"
→ [`DIAGRAMAS_UML.md` - Diagrama de Flujo](DIAGRAMAS_UML.md#-diagrama-de-flujo---ciclo-de-vida-de-etapa)

#### "Tengo un error"
→ [`GUIA_ETAPAS_ADMIN.md#-preguntas-frecuentes`](GUIA_ETAPAS_ADMIN.md)

---

## 📂 Documentación - Ubicación Rápida

### Por Documento
```
RESUMEN_EJECUTIVO.md          ← Visión general (gerentes, todos)
GUIA_ETAPAS_ADMIN.md           ← Manual de usuario (admins)
GESTION_ETAPAS.md              ← Técnico (desarrolladores)
CHANGELOG_ETAPAS.md            ← Cambios (desarrollo, QA)
DIAGRAMAS_UML.md               ← Visualizaciones (todos)
INDICE_DOCUMENTACION.md        ← Índice completo (navegación)
MAPA_RAPIDO.md                 ← Este archivo
```

### Por Tópico
```
Conceptos:        RESUMEN_EJECUTIVO.md, GUIA_ETAPAS_ADMIN.md
API:              GESTION_ETAPAS.md
Código:           Backend/src/routes/etapas.ts, Frontend/src/pages/
Flujos:           DIAGRAMAS_UML.md
Cambios:          CHANGELOG_ETAPAS.md
Troubleshooting:  GUIA_ETAPAS_ADMIN.md
```

---

## 🏃 Flujos Rápidos

### Flujo: Empezar desde Cero

```
┌─────────────────────────────────────────────┐
│ 1. Leer RESUMEN_EJECUTIVO.md (5 min)       │
│    ↓                                         │
│ 2. Leer GUIA_ETAPAS_ADMIN.md (20 min)      │
│    ↓                                         │
│ 3. Acceder a http://localhost:5173/etapas  │
│    ↓                                         │
│ 4. Crear una etapa                          │
│    ↓                                         │
│ 5. Abrir la etapa                           │
│    ↓                                         │
│ 6. Probar que estudiante pueda entregar    │
│    ↓                                         │
│ 7. Cerrar la etapa                          │
│    ↓                                         │
│ 8. ¡DONE! ✅                                │
└─────────────────────────────────────────────┘
```

### Flujo: Implementar Integraciones

```
┌─────────────────────────────────────────────┐
│ 1. Leer CHANGELOG_ETAPAS.md (15 min)       │
│    ↓                                         │
│ 2. Leer GESTION_ETAPAS.md (30 min)         │
│    ↓                                         │
│ 3. Ver diagrama de secuencia (5 min)       │
│    ↓                                         │
│ 4. Revisar endpoints específicos (10 min)  │
│    ↓                                         │
│ 5. Implementar en tu código (TBD)          │
│    ↓                                         │
│ 6. Probar con cURL o Postman               │
│    ↓                                         │
│ 7. ¡DONE! ✅                                │
└─────────────────────────────────────────────┘
```

### Flujo: Debugging de Problema

```
┌──────────────────────────────────────────────────┐
│ 1. ¿Qué rol eres? → Ve sección "Por Rol"       │
│    ↓                                              │
│ 2. ¿Cuál es el error? → Busca en documentación  │
│    ↓                                              │
│ 3. ¿Sigue sin funcionar?                         │
│    → Ve GUIA_ETAPAS_ADMIN.md - FAQ              │
│    → Ve GESTION_ETAPAS.md - Validaciones        │
│    ↓                                              │
│ 4. ¿Sigue sin funcionar?                         │
│    → Revisa diagrama de secuencia                │
│    → Revisa código fuente                        │
│    ↓                                              │
│ 5. Verifica:                                      │
│    - BD conectada ✓                              │
│    - Permisos correctos ✓                        │
│    - Fechas válidas ✓                            │
│    ↓                                              │
│ 6. ¡Resuelto! ✅                                 │
└──────────────────────────────────────────────────┘
```

---

## 🎓 Secuencia de Aprendizaje

### Opción A: Rápida (30 min)
```
RESUMEN_EJECUTIVO.md
    ↓
GUIA_ETAPAS_ADMIN.md (casos de uso)
    ↓
¡Listo para usar!
```

### Opción B: Completa (2 horas)
```
RESUMEN_EJECUTIVO.md (5 min)
    ↓
GUIA_ETAPAS_ADMIN.md (25 min)
    ↓
CHANGELOG_ETAPAS.md (15 min)
    ↓
GESTION_ETAPAS.md (35 min)
    ↓
DIAGRAMAS_UML.md (20 min)
    ↓
Código fuente (20 min)
    ↓
¡Completo dominio!
```

### Opción C: Técnica (1.5 horas)
```
CHANGELOG_ETAPAS.md (15 min)
    ↓
GESTION_ETAPAS.md (40 min)
    ↓
DIAGRAMAS_UML.md (20 min)
    ↓
backend/src/routes/etapas.ts (25 min)
    ↓
¡Listo para desarrollar!
```

---

## 📊 Referencias Rápidas

### Estados de Etapa
```
planificada → abierta → cerrada → archivada
    (no abierta)  (acepta)  (NO acepta)  (fin)
```

### Transiciones Válidas
```
planificada: abierta, archivada
abierta:     cerrada, archivada
cerrada:     archivada
archivada:   (ninguna)
```

### Validación de Entrega
```
1. ¿Etapa existe?           → Error si no
2. ¿Estado = abierta?       → Error si no
3. ¿Dentro de fechas?       → Error si no
4. ¿Dentro del límite?      → Error si no (con flag override)
5. ✅ Aceptar entrega
```

### Endpoints Clave
```
GET    /api/etapas              (listar)
POST   /api/etapas              (crear - admin)
PUT    /api/etapas/:id          (editar - admin)
DELETE /api/etapas/:id          (archivar - admin)
GET    /api/etapas/:id/historial (ver cambios)
```

---

## 🔗 Links Directos

### Más Importantes
- [RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md) - Empieza aquí
- [GUIA_ETAPAS_ADMIN.md](GUIA_ETAPAS_ADMIN.md) - Manual de usuario
- [GESTION_ETAPAS.md](GESTION_ETAPAS.md) - Documentación técnica

### Diagramas
- [Diagrama de Estados](DIAGRAMAS_UML.md#-diagrama-de-estados---gestión-de-etapas)
- [Diagrama de Flujo](DIAGRAMAS_UML.md#-diagrama-de-flujo---ciclo-de-vida-de-etapa)
- [Diagrama de Secuencia](DIAGRAMAS_UML.md#-diagrama-de-secuencia---flujo-de-entrega-con-validación-de-etapa)

### Código
- [Backend Routes](backend/src/routes/etapas.ts)
- [Frontend Component](frontend/src/pages/GestionEtapas.tsx)
- [Schema BD](backend/schema.sql)

### Otros
- [Changelog](CHANGELOG_ETAPAS.md) - Qué cambió
- [Índice Completo](INDICE_DOCUMENTACION.md) - Todo listado

---

## ⏱️ Tiempo Estimado

| Documento | Lectura | Implementación |
|-----------|---------|-----------------|
| RESUMEN_EJECUTIVO | 5 min | N/A |
| GUIA_ETAPAS_ADMIN | 20 min | N/A |
| GESTION_ETAPAS | 30 min | N/A |
| CHANGELOG_ETAPAS | 15 min | N/A |
| DIAGRAMAS_UML | 10 min | N/A |
| Código Backend | 30 min | 2-4 horas |
| Código Frontend | 20 min | 2-3 horas |
| **TOTAL** | **130 min** | **4-7 horas** |

---

## ✅ Checklist de Consultas

- [ ] ¿Entiendo QUÉ es el sistema de etapas?
  → Lee RESUMEN_EJECUTIVO.md

- [ ] ¿Entiendo CÓMO usarlo como admin?
  → Lee GUIA_ETAPAS_ADMIN.md

- [ ] ¿Entiendo la ESTRUCTURA técnica?
  → Lee GESTION_ETAPAS.md

- [ ] ¿Entiendo QUÉ CÓDIGO cambió?
  → Lee CHANGELOG_ETAPAS.md

- [ ] ¿Entiendo los FLUJOS?
  → Ve DIAGRAMAS_UML.md

- [ ] ¿Entiendo el CÓDIGO?
  → Lee los archivos fuente

- [ ] ¿Estoy listo para usar/desarrollar?
  → ✅ SÍ

---

## 🆘 Necesito Ayuda Con...

| Tema | Ir a |
|------|------|
| Entender qué es | [RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md) |
| Usar el sistema | [GUIA_ETAPAS_ADMIN.md](GUIA_ETAPAS_ADMIN.md) |
| API específica | [GESTION_ETAPAS.md](GESTION_ETAPAS.md) |
| Validaciones | [GESTION_ETAPAS.md](GESTION_ETAPAS.md) |
| Problemas | [GUIA_ETAPAS_ADMIN.md](GUIA_ETAPAS_ADMIN.md) |
| Visualizar flujo | [DIAGRAMAS_UML.md](DIAGRAMAS_UML.md) |
| Ver cambios | [CHANGELOG_ETAPAS.md](CHANGELOG_ETAPAS.md) |
| Buscar algo | [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) |

---

**Creado:** 7 de enero de 2026  
**Propósito:** Navegación rápida de documentación  
**Mantenedor:** Equipo de Desarrollo  

📖 Para documentación completa, ver [`INDICE_DOCUMENTACION.md`](INDICE_DOCUMENTACION.md)
