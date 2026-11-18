-- Migration 019: Add support for proyecto_entregas in observaciones table
-- This allows tutors and revisors to add observations to task-based deliveries
-- Makes entrega_id nullable and adds proyecto_entrega_id as alternative foreign key

-- Make entrega_id nullable to allow proyecto_entrega_id instead
ALTER TABLE observaciones 
    ALTER COLUMN entrega_id DROP NOT NULL;

-- Add proyecto_entrega_id column
ALTER TABLE observaciones 
    ADD COLUMN IF NOT EXISTS proyecto_entrega_id UUID REFERENCES proyecto_entregas(id) ON DELETE CASCADE;

-- Add check constraint to ensure exactly one of entrega_id or proyecto_entrega_id is set
ALTER TABLE observaciones
    ADD CONSTRAINT check_observacion_target CHECK (
        (entrega_id IS NOT NULL AND proyecto_entrega_id IS NULL) OR
        (entrega_id IS NULL AND proyecto_entrega_id IS NOT NULL)
    );

-- Create index for efficient queries on proyecto_entrega_id
CREATE INDEX IF NOT EXISTS idx_observaciones_proyecto_entrega ON observaciones(proyecto_entrega_id);

-- Add comment to document the change
COMMENT ON COLUMN observaciones.proyecto_entrega_id IS 'ID de entrega de tarea (alternativo a entrega_id para entregas por tarea)';
