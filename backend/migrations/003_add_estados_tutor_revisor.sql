-- Migración: Agregar campos separados de estado para tutor y revisor
-- Fecha: 2025

-- Agregar campos de estado separados para tutor y revisor
ALTER TABLE entregas 
ADD COLUMN IF NOT EXISTS estado_tutor VARCHAR(50) DEFAULT 'pendiente' 
CHECK (estado_tutor IN ('pendiente', 'en_revision', 'observado', 'aprobado', 'rechazado'));

ALTER TABLE entregas 
ADD COLUMN IF NOT EXISTS estado_revisor VARCHAR(50) DEFAULT NULL 
CHECK (estado_revisor IN ('pendiente', 'en_revision', 'observado', 'aprobado', 'rechazado') OR estado_revisor IS NULL);

-- Migrar datos existentes: estado_revision -> estado_tutor
UPDATE entregas 
SET estado_tutor = estado_revision 
WHERE estado_tutor = 'pendiente' AND estado_revision IS NOT NULL;

-- Comentarios sobre los nuevos campos
COMMENT ON COLUMN entregas.estado_tutor IS 'Estado de la entrega según el tutor: pendiente, en_revision, observado, aprobado, rechazado';
COMMENT ON COLUMN entregas.estado_revisor IS 'Estado de la entrega según el revisor: pendiente, en_revision, observado, aprobado, rechazado, o NULL si no ha sido revisado';

-- Mantener estado_revision para compatibilidad (se puede eliminar en el futuro)
-- Por ahora, estado_revision seguirá reflejando el estado del tutor para mantener compatibilidad

