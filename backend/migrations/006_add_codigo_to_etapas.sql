-- Migración: Añadir campo 'codigo' a la tabla etapas para mapear a identificadores del sistema
-- Fecha: 2026-01-08

ALTER TABLE etapas
ADD COLUMN IF NOT EXISTS codigo VARCHAR(100);

-- Intentar poblar 'codigo' usando heurísticas basadas en el nombre actual
UPDATE etapas SET codigo = 'anteproyecto' WHERE LOWER(nombre) LIKE '%anteproy%';
UPDATE etapas SET codigo = 'entrega_parcial_1' WHERE LOWER(nombre) LIKE '%parcial%1%' OR LOWER(nombre) LIKE '%parcial 1%';
UPDATE etapas SET codigo = 'entrega_parcial_2' WHERE LOWER(nombre) LIKE '%parcial%2%' OR LOWER(nombre) LIKE '%parcial 2%';
UPDATE etapas SET codigo = 'entrega_parcial_3' WHERE LOWER(nombre) LIKE '%parcial%3%' OR LOWER(nombre) LIKE '%parcial 3%';
UPDATE etapas SET codigo = 'version_final' WHERE LOWER(nombre) LIKE '%version final%' OR LOWER(nombre) LIKE '%versi%C3%B3n final%' OR LOWER(nombre) LIKE '%final%';

-- Si hay nombres libres (ej: 'etapa1'), dejar codigo NULL para revisión manual.

-- Crear índice único parcial para facilitar búsquedas por codigo (cuando no sea NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_etapas_codigo ON etapas(codigo) WHERE codigo IS NOT NULL;

-- Nota: Después de ejecutar esta migración, en el admin panel es recomendable revisar las etapas sin 'codigo' y asignarles el código correspondiente si deben mapearse a un identificador del sistema.
