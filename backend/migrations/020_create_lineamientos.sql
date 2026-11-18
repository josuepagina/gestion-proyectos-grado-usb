-- Migration 020: Create lineamientos table for administrator publications

CREATE TABLE IF NOT EXISTS lineamientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    archivo_nombre VARCHAR(255) NOT NULL,
    archivo_ruta TEXT NOT NULL,
    archivo_mime VARCHAR(150),
    archivo_size BIGINT,
    publicado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lineamientos_created_at ON lineamientos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lineamientos_publicado_por ON lineamientos(publicado_por);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_lineamientos_updated_at'
    ) THEN
        CREATE TRIGGER update_lineamientos_updated_at
            BEFORE UPDATE ON lineamientos
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;
