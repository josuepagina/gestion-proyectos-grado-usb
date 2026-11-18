-- Migración: Agregar estados 'en_proceso' y 'completado' a proyectos
-- Fecha: 2025

-- Actualizar el CHECK constraint para incluir los nuevos estados
ALTER TABLE proyectos DROP CONSTRAINT IF EXISTS proyectos_estado_check;

ALTER TABLE proyectos ADD CONSTRAINT proyectos_estado_check CHECK (estado IN (
    'registrado', 
    'en_proceso',      -- Nuevo: Proyecto con entregas subidas
    'en_desarrollo',    -- Mantener para compatibilidad
    'en_revision', 
    'correcciones', 
    'completado',       -- Nuevo: Proyecto cerrado por tutor, todas entregas aprobadas
    'aprobado', 
    'sustentado', 
    'rechazado'
));

-- Agregar nuevo tipo de notificación para cierre de proyecto
ALTER TABLE notificaciones DROP CONSTRAINT IF EXISTS notificaciones_tipo_check;

ALTER TABLE notificaciones ADD CONSTRAINT notificaciones_tipo_check CHECK (tipo IN (
    'nueva_observacion', 
    'nueva_entrega', 
    'proyecto_asignado',
    'entrega_aprobada', 
    'entrega_rechazada', 
    'proyecto_completado',  -- Nuevo: Proyecto cerrado por tutor
    'recordatorio'
));

-- Comentario sobre los nuevos estados
COMMENT ON COLUMN proyectos.estado IS 'Estado del proyecto: registrado (recién creado), en_proceso (con entregas subidas), en_desarrollo (en desarrollo), en_revision (siendo revisado), correcciones (con observaciones), completado (cerrado por tutor), aprobado (aprobado por revisor), sustentado (sustentado), rechazado (rechazado)';

