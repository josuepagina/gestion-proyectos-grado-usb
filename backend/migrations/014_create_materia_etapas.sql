-- ============================================
-- Migración: Crear tabla materia_etapas para vincular etapas a materias
-- ============================================

-- Crear tabla materia_etapas si no existe
CREATE TABLE IF NOT EXISTS materia_etapas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materia_id UUID NOT NULL REFERENCES gestion_materias(id) ON DELETE CASCADE,
    etapa_id UUID NOT NULL REFERENCES etapas(id) ON DELETE CASCADE,
    orden_ejecucion INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(materia_id, etapa_id)
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_materia_etapas_materia_id ON materia_etapas(materia_id);
CREATE INDEX IF NOT EXISTS idx_materia_etapas_etapa_id ON materia_etapas(etapa_id);

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_materia_etapas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_materia_etapas_updated_at') THEN
    CREATE TRIGGER update_materia_etapas_updated_at BEFORE UPDATE ON materia_etapas
      FOR EACH ROW EXECUTE FUNCTION update_materia_etapas_updated_at();
  END IF;
END $$;

-- Verificación
SELECT 
  COUNT(*) as materia_etapas_count
FROM materia_etapas;

RAISE NOTICE '✅ Tabla materia_etapas creada exitosamente';
