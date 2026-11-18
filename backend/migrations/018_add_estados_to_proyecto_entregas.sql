-- Migration 018: Add estado_tutor and estado_revisor columns to proyecto_entregas
-- This allows tutors and revisors to set statuses on task-based deliveries
-- Matches the estado columns from the entregas table for consistency

-- Add estado_tutor and estado_revisor columns
ALTER TABLE proyecto_entregas 
    ADD COLUMN IF NOT EXISTS estado_tutor VARCHAR(20) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS estado_revisor VARCHAR(20) DEFAULT NULL;

-- Remove the old 'estado' column as we now have separate estado_tutor and estado_revisor
ALTER TABLE proyecto_entregas 
    DROP COLUMN IF EXISTS estado;

-- Add check constraints to ensure valid estado values
ALTER TABLE proyecto_entregas
    ADD CONSTRAINT check_estado_tutor CHECK (estado_tutor IN ('aprobado', 'rechazado', 'observado', 'en_revision') OR estado_tutor IS NULL),
    ADD CONSTRAINT check_estado_revisor CHECK (estado_revisor IN ('aprobado', 'rechazado', 'observado', 'en_revision') OR estado_revisor IS NULL);

-- Create index for efficient estado queries
CREATE INDEX IF NOT EXISTS idx_proyecto_entregas_estado_tutor ON proyecto_entregas(estado_tutor);
CREATE INDEX IF NOT EXISTS idx_proyecto_entregas_estado_revisor ON proyecto_entregas(estado_revisor);

-- Add comment to document the change
COMMENT ON COLUMN proyecto_entregas.estado_tutor IS 'Estado asignado por el tutor: aprobado, rechazado, observado, en_revision';
COMMENT ON COLUMN proyecto_entregas.estado_revisor IS 'Estado asignado por el revisor: aprobado, rechazado, observado, en_revision';
