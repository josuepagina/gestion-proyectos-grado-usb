-- Migración 011: Vincular etapas a materias específicas
-- Descripción: Permite que cada materia tenga sus propias etapas

-- Tabla de relación entre Materias y Etapas
CREATE TABLE IF NOT EXISTS materia_etapas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gestion_materia_id UUID NOT NULL REFERENCES gestion_materias(id) ON DELETE CASCADE,
    etapa_id UUID NOT NULL REFERENCES etapas(id) ON DELETE CASCADE,
    orden_ejecucion INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gestion_materia_id, etapa_id)
);

-- Índices para materia_etapas
CREATE INDEX IF NOT EXISTS idx_materia_etapas_materia ON materia_etapas(gestion_materia_id);
CREATE INDEX IF NOT EXISTS idx_materia_etapas_etapa ON materia_etapas(etapa_id);

-- Triggers
CREATE TRIGGER IF NOT EXISTS update_materia_etapas_updated_at BEFORE UPDATE ON materia_etapas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
