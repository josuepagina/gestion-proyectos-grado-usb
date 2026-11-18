-- Migración SQL para actualizar tabla tareas
-- Ejecutar en la consola de Neon

-- 1. Agregar columna titulo si no existe
ALTER TABLE tareas 
ADD COLUMN IF NOT EXISTS titulo VARCHAR(255);

-- 2. Copiar datos de nombre a titulo
UPDATE tareas SET titulo = nombre WHERE titulo IS NULL AND nombre IS NOT NULL;

-- 3. Agregar otras columnas necesarias si no existen
ALTER TABLE tareas 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS peso_evaluacion NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fecha_limite TIMESTAMP WITH TIME ZONE;

-- 4. Copiar fecha_vencimiento a fecha_limite si es necesario
UPDATE tareas SET fecha_limite = fecha_vencimiento WHERE fecha_limite IS NULL AND fecha_vencimiento IS NOT NULL;

-- 5. Crear índices para las nuevas columnas (si no existen)
CREATE INDEX IF NOT EXISTS idx_tareas_titulo ON tareas(titulo);
CREATE INDEX IF NOT EXISTS idx_tareas_orden ON tareas(orden);
CREATE INDEX IF NOT EXISTS idx_tareas_tipo ON tareas(tipo);
CREATE INDEX IF NOT EXISTS idx_tareas_fecha_limite ON tareas(fecha_limite);

-- Nota: Las columnas antiguas (nombre, prioridad, fecha_vencimiento) se mantienen
-- para compatibilidad. Pueden ser eliminadas después si es necesario.
