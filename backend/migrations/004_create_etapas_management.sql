-- Migración 004: Creación de tablas para gestión de etapas por administrador
-- Esta migración crea la capacidad para que el administrador controle:
-- 1. Las etapas del proyecto
-- 2. Las fechas de apertura y cierre de cada etapa
-- 3. Los plazos de entrega para cada etapa

-- Tabla de Etapas (configuradas por el administrador)
CREATE TABLE etapas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    numero_orden INTEGER,
    tipo VARCHAR(50) NOT NULL DEFAULT 'documento' CHECK (tipo IN (
        'documento',      -- Entrega de documento
        'revision',       -- Revisión por tutor/revisor
        'sustentacion',   -- Defensa oral
        'correcciones'    -- Periodo de correcciones
    )),
    estado VARCHAR(20) DEFAULT 'planificada' CHECK (estado IN (
        'planificada',    -- Aún no abierta
        'abierta',        -- Disponible para entregas
        'cerrada',        -- Ya no acepta entregas
        'archivada'       -- Eliminada lógicamente
    )),
    fecha_apertura TIMESTAMP WITH TIME ZONE,
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    fecha_limite_entrega TIMESTAMP WITH TIME ZONE,  -- Límite para subir documentos
    permitir_entregas_fuera_tiempo BOOLEAN DEFAULT FALSE,
    descripcion_entrega TEXT,  -- Qué debe entregarse en esta etapa
    criterios_evaluacion JSONB,  -- JSON con criterios de evaluación
    archivos_plantilla JSONB,  -- URLs de plantillas de documentos
    requerimientos JSONB,  -- Requerimientos específicos de la etapa
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE(numero_orden)
);

-- Tabla de relación entre Etapas y Proyectos
-- Permite tener diferentes calendarios por proyecto si es necesario
CREATE TABLE etapa_proyecto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etapa_id UUID NOT NULL REFERENCES etapas(id) ON DELETE CASCADE,
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    fecha_apertura_proyecto TIMESTAMP WITH TIME ZONE,  -- Puede sobrescribir la fecha global
    fecha_cierre_proyecto TIMESTAMP WITH TIME ZONE,    -- Puede sobrescribir la fecha global
    fecha_limite_entrega_proyecto TIMESTAMP WITH TIME ZONE,  -- Puede sobrescribir la fecha global
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(etapa_id, proyecto_id)
);

-- Tabla de Historial de cambios en etapas
CREATE TABLE etapas_historial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etapa_id UUID NOT NULL REFERENCES etapas(id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL CHECK (accion IN (
        'creacion',
        'cambio_estado',
        'cambio_fechas',
        'cambio_criterios',
        'apertura',
        'cierre',
        'archivo'
    )),
    datos_antiguos JSONB,
    datos_nuevos JSONB,
    razon_cambio TEXT,
    realizado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_etapas_estado ON etapas(estado);
CREATE INDEX idx_etapas_numero_orden ON etapas(numero_orden);
CREATE INDEX idx_etapas_fechas ON etapas(fecha_apertura, fecha_cierre);
CREATE INDEX idx_etapa_proyecto_etapa ON etapa_proyecto(etapa_id);
CREATE INDEX idx_etapa_proyecto_proyecto ON etapa_proyecto(proyecto_id);
CREATE INDEX idx_etapa_proyecto_activa ON etapa_proyecto(activa);
CREATE INDEX idx_etapas_historial_etapa ON etapas_historial(etapa_id);
CREATE INDEX idx_etapas_historial_fecha ON etapas_historial(fecha);

-- Trigger para actualizar updated_at en etapas
CREATE TRIGGER update_etapas_updated_at BEFORE UPDATE ON etapas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_etapa_proyecto_updated_at BEFORE UPDATE ON etapa_proyecto
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para registrar cambios en historial de etapas
CREATE OR REPLACE FUNCTION registrar_cambio_etapa()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO etapas_historial (
            etapa_id, accion, datos_antiguos, datos_nuevos, realizado_por
        ) VALUES (
            NEW.id,
            CASE 
                WHEN OLD.estado != NEW.estado THEN 'cambio_estado'
                WHEN OLD.fecha_apertura != NEW.fecha_apertura OR OLD.fecha_cierre != NEW.fecha_cierre THEN 'cambio_fechas'
                WHEN OLD.criterios_evaluacion != NEW.criterios_evaluacion THEN 'cambio_criterios'
                ELSE 'actualizacion'
            END,
            row_to_json(OLD),
            row_to_json(NEW),
            CURRENT_USER::UUID
        );
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO etapas_historial (
            etapa_id, accion, datos_nuevos, realizado_por
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

CREATE TRIGGER trigger_registrar_cambio_etapa AFTER INSERT OR UPDATE ON etapas
    FOR EACH ROW EXECUTE FUNCTION registrar_cambio_etapa();
