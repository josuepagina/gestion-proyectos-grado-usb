-- Agregar campo RU (número único del carnet estudiantil) a la tabla usuarios
-- Este campo es único y obligatorio para estudiantes

ALTER TABLE usuarios ADD COLUMN ru VARCHAR(50) UNIQUE;

-- Crear un índice para búsquedas rápidas por RU
CREATE INDEX idx_usuarios_ru ON usuarios(ru);

-- Comentario sobre el campo
COMMENT ON COLUMN usuarios.ru IS 'Número único del carnet estudiantil (RU) - Universidad Salesiana de Bolivia';
