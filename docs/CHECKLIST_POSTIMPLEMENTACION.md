# ✅ CHECKLIST POST-IMPLEMENTACIÓN

**Fecha:** 7 de enero de 2026  
**Sistema:** Gestión de Etapas  
**Responsable:** _________________  
**Fecha Completado:** _________________

---

## 🔧 Verificación de Instalación

### Base de Datos

- [ ] Script SQL ejecutado en Neon
  - [ ] Tabla `etapas` creada
  - [ ] Tabla `etapa_proyecto` creada
  - [ ] Tabla `etapas_historial` creada
  - [ ] Índices creados (8 total)
  - [ ] Triggers registrados
  - [ ] Funciones creadas

**Cómo verificar:**
```sql
SELECT COUNT(*) FROM etapas;
SELECT COUNT(*) FROM etapa_proyecto;
SELECT COUNT(*) FROM etapas_historial;
```

### Backend

- [ ] Dependencias instaladas
  ```bash
  cd backend && npm install
  ```

- [ ] Variables de entorno configuradas
  - [ ] DATABASE_URL correcto
  - [ ] PORT correcto
  - [ ] NODE_ENV correcto

- [ ] Servidor iniciando correctamente
  ```bash
  npm run dev
  # Debe estar escuchando en http://localhost:3001
  ```

- [ ] Rutas registradas
  - [ ] `/api/etapas` disponible
  - [ ] Endpoints respondiendo

**Cómo verificar:**
```bash
curl http://localhost:3001/api/etapas
# Debe retornar JSON válido
```

### Frontend

- [ ] Dependencias instaladas
  ```bash
  cd frontend && npm install
  ```

- [ ] Servidor iniciando correctamente
  ```bash
  npm run dev
  # Debe estar en http://localhost:5173
  ```

- [ ] Ruta `/etapas` accesible
  - [ ] Solo si estás logged como admin
  - [ ] URL: http://localhost:5173/etapas

- [ ] Componente GestionEtapas cargando
  - [ ] Página visible
  - [ ] Formularios funcionales

---

## 🧪 Testing Funcional

### Test 1: Crear Etapa

- [ ] Acceder a `/etapas` como admin
- [ ] Haz clic en "+ Nueva Etapa"
- [ ] Completa el formulario:
  - Nombre: "Test Etapa"
  - Número: 99
  - Tipo: "documento"
  - Fecha apertura: (mañana)
  - Fecha cierre: (en 2 semanas)
  - Fecha límite: (en 1.5 semanas)
- [ ] Haz clic en "Crear"
- [ ] Recibes mensaje de éxito
- [ ] Etapa aparece en la lista

**BD Check:**
```sql
SELECT * FROM etapas WHERE nombre = 'Test Etapa';
```

### Test 2: Editar Etapa

- [ ] Haz clic en "Editar" en la tarjeta
- [ ] Cambia descripción
- [ ] Haz clic en "Actualizar"
- [ ] Recibes mensaje de éxito
- [ ] Cambios aparecen reflejados

**BD Check:**
```sql
SELECT descripcion FROM etapas WHERE nombre = 'Test Etapa';
```

### Test 3: Cambiar Estado

- [ ] Etapa en estado "planificada"
- [ ] Haz clic en botón "Abrir"
- [ ] Estado cambia a "abierta"
- [ ] Se registra en historial

**BD Check:**
```sql
SELECT estado FROM etapas WHERE nombre = 'Test Etapa';
SELECT * FROM etapas_historial WHERE etapa_id = (SELECT id FROM etapas WHERE nombre = 'Test Etapa');
```

### Test 4: Bloquear Entrega Fuera de Plazo

- [ ] Crear etapa con fecha límite en el PASADO
- [ ] Como estudiante, intentar subir un documento
- [ ] Sistema debe rechazar: "Se ha excedido el límite"
- [ ] Entrega NO se guarda en BD

**BD Check:**
```sql
SELECT COUNT(*) FROM entregas WHERE proyecto_id = 'xxx'; -- Debe ser 0
```

### Test 5: Permitir Entrega Fuera de Plazo

- [ ] Crear etapa con:
  - Fecha límite: pasado
  - "Permitir entregas fuera de tiempo": SÍ
- [ ] Como estudiante, subir un documento
- [ ] Sistema acepta la entrega
- [ ] Entrega se guarda

**BD Check:**
```sql
SELECT * FROM entregas WHERE fecha_subida > fecha_limite;
```

### Test 6: Cerrar Etapa

- [ ] Etapa en estado "abierta"
- [ ] Haz clic en botón "Cerrar"
- [ ] Estado cambia a "cerrada"
- [ ] Estudiante NO puede subir

**BD Check:**
```sql
SELECT estado FROM etapas WHERE nombre = 'Test Etapa';
-- Debe ser 'cerrada'
```

### Test 7: Archivar Etapa

- [ ] Etapa en estado "cerrada"
- [ ] Haz clic en botón "Archivar"
- [ ] Confirmación de alerta
- [ ] Estado cambia a "archivada"
- [ ] Etapa desaparece de la lista (archivadas ocultas)

**BD Check:**
```sql
SELECT estado FROM etapas WHERE nombre = 'Test Etapa';
-- Debe ser 'archivada'
```

---

## 📊 Validaciones a Verificar

### Validación: Número de Orden Único

- [ ] Intenta crear dos etapas con número 1
- [ ] Sistema rechaza: "Ya existe una etapa con el número 1"

### Validación: Fechas Lógicas

- [ ] Intenta crear etapa con:
  - Fecha apertura: 15 feb
  - Fecha cierre: 10 feb (anterior)
- [ ] Sistema rechaza: "La fecha de cierre debe ser posterior"

### Validación: Transiciones de Estado

- [ ] Intenta cambiar directamente: archivada → abierta
- [ ] Sistema rechaza: "No se puede cambiar de archivada a abierta"

### Validación: Permisos

- [ ] Log in como ESTUDIANTE
- [ ] Intenta acceder a `/etapas`
- [ ] Sistema redirecciona a `/` (Forbidden)

- [ ] Log in como TUTOR
- [ ] Intenta acceder a `/etapas`
- [ ] Sistema redirecciona a `/` (Forbidden)

- [ ] Log in como REVISOR
- [ ] Intenta acceder a `/etapas`
- [ ] Sistema redirecciona a `/` (Forbidden)

---

## 🔐 Seguridad

- [ ] Solo admin puede crear etapas
  - [ ] POST /etapas requiere admin
  - [ ] Respuesta 403 si no es admin

- [ ] Solo admin puede editar etapas
  - [ ] PUT /etapas/:id requiere admin
  - [ ] Respuesta 403 si no es admin

- [ ] Solo admin puede archivar etapas
  - [ ] DELETE /etapas/:id requiere admin
  - [ ] Respuesta 403 si no es admin

- [ ] Auditoría de cambios
  - [ ] Todos los cambios en etapas_historial
  - [ ] Usuario que hizo el cambio registrado
  - [ ] Fecha registrada
  - [ ] Datos antiguos y nuevos guardados

---

## 📱 Responsividad

### Desktop (1920px)

- [ ] Panel de administración visible correctamente
- [ ] Cards se ven bien
- [ ] Formularios legibles
- [ ] Botones accesibles

### Tablet (768px)

- [ ] Layout se adapta
- [ ] Cards apiladas correctamente
- [ ] Formularios responsivos
- [ ] Botones clickeables

### Mobile (375px)

- [ ] Todo cabe en pantalla
- [ ] Sin scroll horizontal
- [ ] Botones del tamaño apropiado
- [ ] Texto legible

---

## ⚡ Performance

- [ ] Carga de página `/etapas` < 2 segundos
- [ ] Listado de etapas rápido (< 1 segundo)
- [ ] Creación de etapa rápida (< 2 segundos)
- [ ] Edición de etapa rápida (< 2 segundos)
- [ ] Cambio de estado rápido (< 1 segundo)

**Cómo verificar:**
- Abre DevTools (F12)
- Sección Network
- Mira tiempos de respuesta

---

## 📝 Documentación

- [ ] `GESTION_ETAPAS.md` existe y está completo
- [ ] `GUIA_ETAPAS_ADMIN.md` existe y está completo
- [ ] `RESUMEN_EJECUTIVO.md` existe y está completo
- [ ] `CHANGELOG_ETAPAS.md` existe y está completo
- [ ] `DIAGRAMAS_UML.md` actualizado con nuevos diagramas
- [ ] `README.md` actualizado con nueva característica
- [ ] `INDICE_DOCUMENTACION.md` está disponible
- [ ] `MAPA_RAPIDO.md` está disponible

---

## 🔗 Integración con Otros Módulos

### Entregas

- [ ] Sistema valida etapa antes de aceptar entrega
- [ ] Entrega rechazada si etapa no está abierta
- [ ] Entrega rechazada si fuera de fechas
- [ ] Entrega rechazada si fuera de límite (sin flag)
- [ ] Entrega aceptada si fuera de límite (con flag)

**Cómo verificar:**
- Intenta subir como estudiante
- Verifica que se valida correctamente

### Reportes

- [ ] Reportes aún funcionan
- [ ] No hay cambios rotos

---

## 🐛 Debugging

Si algo no funciona, revisa:

### Error: "Tabla no existe"
```sql
-- Verificar que las tablas fueron creadas
\dt etapas;
\dt etapa_proyecto;
\dt etapas_historial;
```

### Error: "Ruta no encontrada"
```bash
# Verificar que etapas.ts está importado en index.ts
grep "etapasRoutes" backend/src/index.ts
```

### Error: "No puedo acceder a /etapas"
```javascript
// Verificar que:
// 1. Estoy logged como admin
// 2. ProtectedRoute tiene roles=['administrador']
// 3. Componente está importado en App.tsx
```

### Error: "No se valida entrega"
```bash
# Verificar que validación está en entregas.ts
grep -A 20 "VALIDAR ESTADO DE LA ETAPA" backend/src/routes/entregas.ts
```

---

## 📋 Limpieza Post-Instalación

### Datos de Prueba

- [ ] Eliminar etapas de prueba creadas
  ```bash
  # Si necesitas eliminar:
  # Archiva la etapa desde UI o:
  DELETE FROM etapas WHERE nombre = 'Test Etapa';
  ```

### Logs

- [ ] Revisar logs de backend por errores
  ```bash
  # En la terminal donde corre npm run dev
  # Debe estar limpia de errores
  ```

### Caché

- [ ] Limpiar caché del navegador (F12 → Application → Clear)
- [ ] Recargar página (Ctrl+Shift+R)

---

## ✅ Final Checklist

- [ ] Base de datos funcionando
- [ ] Backend respondiendo
- [ ] Frontend cargando
- [ ] Panel de administración accesible
- [ ] Crear etapa funciona
- [ ] Editar etapa funciona
- [ ] Cambiar estado funciona
- [ ] Archivar etapa funciona
- [ ] Validaciones funcionan
- [ ] Entregas se validan
- [ ] Permisos funcionan
- [ ] Documentación completa
- [ ] Tests pasando
- [ ] Performance aceptable
- [ ] Mobile responsive
- [ ] Listo para producción ✅

---

## 📊 Métricas Finales

| Métrica | Valor | Status |
|---------|-------|--------|
| Tablas de BD | 3 | ✅ |
| Endpoints | 7 | ✅ |
| Validaciones | 10+ | ✅ |
| Documentación (pág) | ~60 | ✅ |
| Tests pasando | ? | ⏳ |
| Bugs encontrados | 0 | ✅ |

---

## 🎯 Firma de Aceptación

**Implementador:** _________________________  
**Fecha:** _________________________  

**QA/Tester:** _________________________  
**Fecha:** _________________________  

**Aprobación:** _________________________  
**Fecha:** _________________________  

---

## 📞 Contacto

Si encuentras problemas:
1. Revisa [`GUIA_ETAPAS_ADMIN.md`](GUIA_ETAPAS_ADMIN.md)
2. Revisa [`GESTION_ETAPAS.md`](GESTION_ETAPAS.md)
3. Contacta al equipo de desarrollo
4. Abre un issue en el repositorio

---

**Generado:** 7 de enero de 2026  
**Versión:** 1.0.0  
**Estado:** Listo para validación

Para más detalles, ver [`MAPA_RAPIDO.md`](MAPA_RAPIDO.md)
