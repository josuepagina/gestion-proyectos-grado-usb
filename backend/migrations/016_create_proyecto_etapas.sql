-- ============================================
-- Migración: Crear tablas para etapas y tareas de proyecto
-- ============================================
-- Descripción: Permite que tutores creen etapas y tareas específicas para cada proyecto

-- Tabla: proyecto_etapas (Etapas creadas por tutores para sus proyectos)
CREATE TABLE IF NOT EXISTS proyecto_etapas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    numero_orden INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'borrador', -- borrador, publicada, cerrada
    fecha_publicacion TIMESTAMP,
    fecha_inicio TIMESTAMP,
    fecha_cierre TIMESTAMP,
    permitir_entregas_fuera_tiempo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES usuarios(id),
    UNIQUE(proyecto_id, numero_orden)
);

-- Tabla: proyecto_tareas (Tareas dentro de cada etapa)
CREATE TABLE IF NOT EXISTS proyecto_tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_etapa_id UUID NOT NULL REFERENCES proyecto_etapas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    es_entregable BOOLEAN DEFAULT false, -- true = requiere documento, false = solo checkbox
    numero_orden INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, completada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proyecto_etapa_id, numero_orden)
);

-- Tabla: proyecto_entregas (Entregas de tareas entregables)
CREATE TABLE IF NOT EXISTS proyecto_entregas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_tarea_id UUID NOT NULL REFERENCES proyecto_tareas(id) ON DELETE CASCADE,
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    estudiante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    archivo_url VARCHAR,
    observaciones TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, entregado, revisado
    fecha_entrega TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: proyecto_tareas_completadas (Registro de tareas no entregables completadas)
CREATE TABLE IF NOT EXISTS proyecto_tareas_completadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_tarea_id UUID NOT NULL REFERENCES proyecto_tareas(id) ON DELETE CASCADE,
    estudiante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    estado BOOLEAN DEFAULT false,
    fecha_completacion TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proyecto_tarea_id, estudiante_id)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_proyecto_etapas_proyecto ON proyecto_etapas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_etapas_tutor ON proyecto_etapas(tutor_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_etapas_estado ON proyecto_etapas(estado);
CREATE INDEX IF NOT EXISTS idx_proyecto_tareas_etapa ON proyecto_tareas(proyecto_etapa_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_entregas_proyecto ON proyecto_entregas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_entregas_estudiante ON proyecto_entregas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_tareas_completadas_tarea ON proyecto_tareas_completadas(proyecto_tarea_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_proyecto_etapas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_proyecto_tareas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_proyecto_etapas_updated_at') THEN
    CREATE TRIGGER update_proyecto_etapas_updated_at BEFORE UPDATE ON proyecto_etapas
      FOR EACH ROW EXECUTE FUNCTION update_proyecto_etapas_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_proyecto_tareas_updated_at') THEN
    CREATE TRIGGER update_proyecto_tareas_updated_at BEFORE UPDATE ON proyecto_tareas
      FOR EACH ROW EXECUTE FUNCTION update_proyecto_tareas_updated_at();
  END IF;
END $$;

-- ✅ Tablas de proyecto_etapas creadas exitosamente
