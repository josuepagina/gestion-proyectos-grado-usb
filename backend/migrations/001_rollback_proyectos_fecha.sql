-- Rollback: Revertir cambios de fecha_entrega a fecha_inicio y restaurar fecha_fin_estimada
-- Fecha: 2025
-- Descripción: 
--   - Renombrar fecha_entrega a fecha_inicio
--   - Restaurar fecha_fin_estimada (sin datos, solo la columna)

BEGIN;

-- Paso 1: Verificar que fecha_entrega existe antes de renombrarla
DO $$
BEGIN
    -- Verificar si fecha_entrega existe
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'proyectos' 
        AND column_name = 'fecha_entrega'
    ) THEN
        -- Renombrar fecha_entrega a fecha_inicio
        ALTER TABLE proyectos RENAME COLUMN fecha_entrega TO fecha_inicio;
        RAISE NOTICE 'Columna fecha_entrega renombrada a fecha_inicio';
    ELSE
        RAISE NOTICE 'La columna fecha_entrega no existe';
    END IF;

    -- Verificar si fecha_fin_estimada NO existe antes de crearla
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'proyectos' 
        AND column_name = 'fecha_fin_estimada'
    ) THEN
        -- Restaurar fecha_fin_estimada (sin datos previos)
        ALTER TABLE proyectos ADD COLUMN fecha_fin_estimada DATE;
        RAISE NOTICE 'Columna fecha_fin_estimada restaurada (sin datos previos)';
    ELSE
        RAISE NOTICE 'La columna fecha_fin_estimada ya existe';
    END IF;
END $$;

-- Verificar el resultado
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'proyectos' 
AND column_name IN ('fecha_entrega', 'fecha_inicio', 'fecha_fin_estimada')
ORDER BY column_name;

COMMIT;

