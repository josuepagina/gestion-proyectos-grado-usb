-- Migración: Actualizar tabla proyectos para usar fecha_entrega en lugar de fecha_inicio y fecha_fin_estimada
-- Fecha: 2025
-- Descripción: 
--   - Renombrar fecha_inicio a fecha_entrega
--   - Eliminar fecha_fin_estimada

BEGIN;

-- Paso 1: Verificar que las columnas existen antes de hacer cambios
DO $$
BEGIN
    -- Verificar si fecha_inicio existe
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'proyectos' 
        AND column_name = 'fecha_inicio'
    ) THEN
        -- Renombrar fecha_inicio a fecha_entrega
        ALTER TABLE proyectos RENAME COLUMN fecha_inicio TO fecha_entrega;
        RAISE NOTICE 'Columna fecha_inicio renombrada a fecha_entrega';
    ELSE
        RAISE NOTICE 'La columna fecha_inicio no existe, puede que ya haya sido renombrada';
    END IF;

    -- Verificar si fecha_fin_estimada existe antes de eliminarla
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'proyectos' 
        AND column_name = 'fecha_fin_estimada'
    ) THEN
        -- Eliminar fecha_fin_estimada
        ALTER TABLE proyectos DROP COLUMN fecha_fin_estimada;
        RAISE NOTICE 'Columna fecha_fin_estimada eliminada';
    ELSE
        RAISE NOTICE 'La columna fecha_fin_estimada no existe, puede que ya haya sido eliminada';
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

