# Migraciones de Base de Datos

Este directorio contiene scripts de migración SQL para actualizar el esquema de la base de datos.

## Cómo aplicar migraciones

### Opción 1: Usando psql (PostgreSQL CLI)

```bash
# Conectarse a la base de datos
psql -h <host> -U <usuario> -d <nombre_base_datos>

# Ejecutar la migración
\i migrations/001_update_proyectos_fecha_entrega.sql
```

### Opción 2: Usando un cliente SQL (pgAdmin, DBeaver, etc.)

1. Abrir el archivo de migración en tu cliente SQL
2. Ejecutar el script completo

### Opción 3: Desde la aplicación Node.js

Si tienes un script de migración en Node.js, puedes ejecutarlo así:

```bash
cd backend
node scripts/run-migration.js migrations/001_update_proyectos_fecha_entrega.sql
```

## Orden de migraciones

Las migraciones deben aplicarse en orden numérico:
1. `001_update_proyectos_fecha_entrega.sql` - Actualizar campos de fecha en proyectos
2. `002_add_estados_proyecto.sql` - Agregar estados 'en_proceso' y 'completado' a proyectos
3. `003_add_estados_tutor_revisor.sql` - Agregar campos separados de estado para tutor y revisor

## Verificación

Después de aplicar una migración, verifica que los cambios se aplicaron correctamente:

```sql
-- Verificar estructura de la tabla proyectos
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'proyectos'
ORDER BY ordinal_position;
```

## Rollback

Si necesitas revertir una migración, puedes crear un script de rollback. Por ejemplo:

```sql
-- Rollback para 001_update_proyectos_fecha_entrega.sql
ALTER TABLE proyectos RENAME COLUMN fecha_entrega TO fecha_inicio;
ALTER TABLE proyectos ADD COLUMN fecha_fin_estimada DATE;
```

**Nota:** El rollback puede perder datos si la columna `fecha_fin_estimada` tenía valores que no se pueden recuperar.

