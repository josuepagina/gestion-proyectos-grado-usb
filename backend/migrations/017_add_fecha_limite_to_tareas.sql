-- ============================================
-- Migración: Agregar fecha_limite a tareas y mejorar estados de etapas
-- ============================================
-- Descripción: Permite establecer fechas límite para tareas y mejorar gestión de estados

-- Agregar columna fecha_limite a proyecto_tareas
ALTER TABLE proyecto_tareas 
ADD COLUMN IF NOT EXISTS fecha_limite TIMESTAMP;

-- Actualizar estado de etapas para ser más descriptivo (borrador, activa, cerrada, publicada)
-- Ya existe 'estado', solo documentamos que puede ser: borrador, activa, cerrada, publicada

-- Tabla de auxilio para manejar cierre automático de etapas
CREATE OR REPLACE FUNCTION cerrar_etapas_vencidas()
RETURNS void AS $$
BEGIN
  -- Cerrar etapas cuya fecha_cierre ha pasado
  UPDATE proyecto_etapas
  SET estado = 'cerrada'
  WHERE (estado = 'activa' OR estado = 'publicada')
    AND fecha_cierre IS NOT NULL
    AND fecha_cierre < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Función para activar etapas cuando llega su fecha_inicio
CREATE OR REPLACE FUNCTION activar_etapas_publicadas()
RETURNS void AS $$
BEGIN
  -- Activar etapas publicadas que han llegado a fecha_inicio
  UPDATE proyecto_etapas
  SET estado = 'activa'
  WHERE estado = 'publicada'
    AND fecha_inicio IS NOT NULL
    AND fecha_inicio <= CURRENT_TIMESTAMP
    AND (fecha_cierre IS NULL OR fecha_cierre > CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Tabla de auxilio para manejar cierre automático de tareas
CREATE OR REPLACE FUNCTION cerrar_tareas_vencidas()
RETURNS void AS $$
BEGIN
  -- Cerrar tareas cuya fecha_limite ha pasado
  UPDATE proyecto_tareas
  SET estado = 'cerrada'
  WHERE (estado = 'pendiente' OR estado = 'activa')
    AND fecha_limite IS NOT NULL
    AND fecha_limite < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Función para activar tareas cuando se crean
CREATE OR REPLACE FUNCTION activar_tareas_creadas()
RETURNS void AS $$
BEGIN
  -- Activar tareas recién creadas
  UPDATE proyecto_tareas
  SET estado = 'activa'
  WHERE estado = 'pendiente'
    AND created_at >= (CURRENT_TIMESTAMP - INTERVAL '1 minute');
END;
$$ LANGUAGE plpgsql;

-- Índice para búsquedas de tareas por fecha_limite
CREATE INDEX IF NOT EXISTS idx_proyecto_tareas_fecha_limite ON proyecto_tareas(fecha_limite);
