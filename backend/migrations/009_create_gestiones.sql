-- Migración 009: Crear tablas para gestión de materias
-- Descripción: Agrega tablas para gestionar materias, semestres y sus etapas asociadas

-- Tabla de Gestiones (Configuradas por el administrador para cada materia/semestre)
CREATE TABLE IF NOT EXISTS gestiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    semestre INTEGER NOT NULL CHECK (semestre IN (7, 8, 9, 10)),
    materia VARCHAR(255) NOT NULL,
    codigo_materia VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'inactiva', 'archivada')),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de relación entre Gestiones y Etapas
CREATE TABLE IF NOT EXISTS gestion_etapas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gestion_id UUID NOT NULL REFERENCES gestiones(id) ON DELETE CASCADE,
    etapa_id UUID NOT NULL REFERENCES etapas(id) ON DELETE CASCADE,
    orden_ejecucion INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gestion_id, etapa_id)
);

-- Tabla de Historial de cambios en gestiones
CREATE TABLE IF NOT EXISTS gestiones_historial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gestion_id UUID NOT NULL REFERENCES gestiones(id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL CHECK (accion IN (
        'creacion', 'cambio_estado', 'cambio_datos', 'actualizacion'
    )),
    datos_antiguos JSONB,
    datos_nuevos JSONB,
    razon_cambio TEXT,
    realizado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para gestiones
CREATE INDEX IF NOT EXISTS idx_gestiones_semestre ON gestiones(semestre);
CREATE INDEX IF NOT EXISTS idx_gestiones_estado ON gestiones(estado);
CREATE INDEX IF NOT EXISTS idx_gestion_etapas_gestion ON gestion_etapas(gestion_id);
CREATE INDEX IF NOT EXISTS idx_gestion_etapas_etapa ON gestion_etapas(etapa_id);
CREATE INDEX IF NOT EXISTS idx_gestiones_historial_gestion ON gestiones_historial(gestion_id);
CREATE INDEX IF NOT EXISTS idx_gestiones_historial_fecha ON gestiones_historial(fecha);

-- Triggers
CREATE TRIGGER IF NOT EXISTS update_gestiones_updated_at BEFORE UPDATE ON gestiones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_gestion_etapas_updated_at BEFORE UPDATE ON gestion_etapas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para registrar cambios en historial de gestiones
CREATE OR REPLACE FUNCTION registrar_cambio_gestion()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO gestiones_historial (
            gestion_id, accion, datos_antiguos, datos_nuevos, realizado_por
        ) VALUES (
            NEW.id,
            CASE 
                WHEN OLD.estado != NEW.estado THEN 'cambio_estado'
                ELSE 'cambio_datos'
            END,
            row_to_json(OLD),
            row_to_json(NEW),
            CURRENT_USER::UUID
        );
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO gestiones_historial (
            gestion_id, accion, datos_nuevos, realizado_por
        ) VALUES (
            NEW.id,
            'creacion',
            row_to_json(NEW),
            CURRENT_USER::UUID
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_registrar_cambio_gestion AFTER INSERT OR UPDATE ON gestiones
    FOR EACH ROW EXECUTE FUNCTION registrar_cambio_gestion();
