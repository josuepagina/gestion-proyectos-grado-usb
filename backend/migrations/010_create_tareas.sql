-- Migración 010: Crear tabla de tareas para etapas
-- Descripción: Agrega tabla de tareas asociadas a materias y etapas dentro de gestiones

CREATE TABLE IF NOT EXISTS tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gestion_materia_id UUID NOT NULL,
    etapa_id UUID NOT NULL REFERENCES etapas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),
    prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_gestion_materia FOREIGN KEY (gestion_materia_id) REFERENCES gestion_materias(id) ON DELETE CASCADE
);

-- Índices para tareas
CREATE INDEX IF NOT EXISTS idx_tareas_gestion_materia ON tareas(gestion_materia_id);
CREATE INDEX IF NOT EXISTS idx_tareas_etapa ON tareas(etapa_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON tareas(estado);
CREATE INDEX IF NOT EXISTS idx_tareas_prioridad ON tareas(prioridad);
CREATE INDEX IF NOT EXISTS idx_tareas_fecha_vencimiento ON tareas(fecha_vencimiento);

-- Triggers
CREATE TRIGGER IF NOT EXISTS update_tareas_updated_at BEFORE UPDATE ON tareas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
