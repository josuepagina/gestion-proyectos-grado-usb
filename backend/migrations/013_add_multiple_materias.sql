-- ============================================
-- Migración: Soportar múltiples materias por gestión
-- ============================================

-- Paso 1: Crear tabla gestion_materias si no existe
CREATE TABLE IF NOT EXISTS gestion_materias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gestion_id UUID NOT NULL REFERENCES gestiones(id) ON DELETE CASCADE,
    semestre INTEGER NOT NULL CHECK (semestre IN (7, 8, 9, 10)),
    materia VARCHAR(255) NOT NULL,
    codigo_materia VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'inactiva', 'archivada')),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE(gestion_id, semestre, materia)
);

-- Paso 2: Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_gestion_materias_updated_at') THEN
    CREATE TRIGGER update_gestion_materias_updated_at BEFORE UPDATE ON gestion_materias
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Paso 3: Migrar datos existentes de gestiones a gestion_materias
DO $$
DECLARE
  gestion_row RECORD;
  migrated_count INTEGER := 0;
BEGIN
  -- Para cada gestión que tenga semestre y materia
  FOR gestion_row IN 
    SELECT id, semestre, materia, codigo_materia 
    FROM gestiones 
    WHERE semestre IS NOT NULL AND materia IS NOT NULL
  LOOP
    INSERT INTO gestion_materias (gestion_id, semestre, materia, codigo_materia)
    VALUES (gestion_row.id, gestion_row.semestre, gestion_row.materia, gestion_row.codigo_materia)
    ON CONFLICT (gestion_id, semestre, materia) DO NOTHING;
    
    migrated_count := migrated_count + 1;
  END LOOP;
  
  RAISE NOTICE '✅ Migradas % gestiones a gestion_materias', migrated_count;
END $$;

-- Paso 4: Verificación
SELECT 
  g.id,
  g.nombre,
  COUNT(gm.id) as materias_count,
  string_agg(gm.materia, ', ') as materias
FROM gestiones g
LEFT JOIN gestion_materias gm ON gm.gestion_id = g.id
GROUP BY g.id, g.nombre
ORDER BY g.nombre;
