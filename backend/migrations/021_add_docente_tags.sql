-- Agrega tags independientes para docentes
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS es_tutor BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS es_revisor BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill inicial segun rol actual
UPDATE usuarios
SET
  es_tutor = CASE WHEN rol = 'tutor' THEN TRUE ELSE es_tutor END,
  es_revisor = CASE WHEN rol = 'revisor' THEN TRUE ELSE es_revisor END;
