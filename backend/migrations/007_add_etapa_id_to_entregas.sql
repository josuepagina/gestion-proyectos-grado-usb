-- Permitir que la columna 'etapa' en entregas acepte nombres arbitrarios de etapas
-- En lugar de solo los 5 valores predefinidos

-- Primero, removemos el CHECK constraint (requiere recrear la tabla o usar ALTER TABLE)
-- PostgreSQL no permite remover constraints fácilmente, así que alteramos la tabla

-- Opción 1: Cambiar el tipo de dato y remover el check
ALTER TABLE entregas DROP CONSTRAINT IF EXISTS entregas_etapa_check;

-- Ahora 'etapa' puede ser cualquier string (nombre de etapa o UUID)
-- Esto permite tanto valores legacy (anteproyecto, etc.) como nombres nuevos (etapa1, etc.)

-- Crear un índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_entregas_etapa_nombre ON entregas(etapa);
