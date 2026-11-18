-- Actualizar entregas que tienen UUID en lugar de nombre
-- Reemplazar los UUIDs de las etapas con sus nombres correspondientes

UPDATE entregas e
SET etapa = eth.nombre
FROM etapas eth
WHERE e.etapa::text = eth.id::text
AND e.etapa ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'::text;
