import express from 'express';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper to derive tipo automatically from nombre
function deriveTipo(nombre: string | undefined): 'documento' | 'revision' | 'sustentacion' | 'correcciones' {
  const n = (nombre || '').toLowerCase();
  if (n.includes('sustent')) return 'sustentacion';
  if (n.includes('revis') || n.includes('revisión')) return 'revision';
  if (n.includes('correc')) return 'correcciones';
  return 'documento';
}

// ============================================
// GESTIÓN DE ETAPAS - Solo Administrador
// ============================================

// GET: Obtener todas las etapas (o filtradas por materia)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { gestion_materia_id } = req.query;

    let query = `
      SELECT 
        e.id, e.nombre, e.descripcion, e.numero_orden, e.tipo, e.estado,
        e.fecha_apertura, e.fecha_cierre, e.fecha_limite_entrega,
        e.permitir_entregas_fuera_tiempo, e.descripcion_entrega,
        e.criterios_evaluacion, e.archivos_plantilla, e.requerimientos,
        e.created_at, e.updated_at
      FROM etapas e
    `;
    const params: any[] = [];

    if (gestion_materia_id) {
      query += `
        INNER JOIN materia_etapas me ON e.id = me.etapa_id
        WHERE me.gestion_materia_id = $1
        ORDER BY me.orden_ejecucion ASC, e.numero_orden ASC
      `;
      params.push(gestion_materia_id);
    } else {
      query += `
        ORDER BY e.numero_orden ASC
      `;
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      etapas: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching etapas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapas' });
  }
});

// GET: Obtener una etapa específica
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM etapas WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    res.json({ success: true, etapa: result.rows[0] });
  } catch (error) {
    console.error('Error fetching etapa:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapa' });
  }
});

// POST: Crear nueva etapa (solo Admin)
router.post('/', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const {
      nombre,
      descripcion,
      fecha_apertura,
      fecha_cierre,
      fecha_limite_entrega,
      permitir_entregas_fuera_tiempo,
      descripcion_entrega,
      criterios_evaluacion,
      archivos_plantilla,
      requerimientos
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ success: false, error: 'Falta el campo requerido: nombre' });
    }

    // Calcular numero_orden automáticamente (siguiente número disponible)
    const nextRes = await pool.query(`SELECT COALESCE(MAX(numero_orden), 0) + 1 AS next FROM etapas`);
    const numero_orden_auto: number = nextRes.rows[0]?.next || 1;

    // Derivar tipo automáticamente a partir del nombre si no se especifica
    const tipo_auto = deriveTipo(nombre);

    // Validar fechas
    if (fecha_apertura && fecha_cierre && new Date(fecha_apertura) >= new Date(fecha_cierre)) {
      return res.status(400).json({
        success: false,
        error: 'La fecha de cierre debe ser posterior a la fecha de apertura'
      });
    }


    const result = await pool.query(
      `INSERT INTO etapas (
        nombre, descripcion, numero_orden, tipo, estado,
        fecha_apertura, fecha_cierre, fecha_limite_entrega,
        permitir_entregas_fuera_tiempo, descripcion_entrega,
        criterios_evaluacion, archivos_plantilla, requerimientos, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        nombre,
        descripcion || null,
        numero_orden_auto,
        tipo_auto,
        'planificada',
        fecha_apertura || null,
        fecha_cierre || null,
        fecha_limite_entrega || null,
        permitir_entregas_fuera_tiempo || false,
        descripcion_entrega || null,
        criterios_evaluacion || null,
        archivos_plantilla || null,
        requerimientos || null,
        req.user!.id
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Etapa creada exitosamente',
      etapa: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating etapa:', error);
    res.status(500).json({ success: false, error: 'Error al crear etapa' });
  }
});

// PUT: Actualizar etapa (solo Admin)
router.put('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      tipo,
      estado,
      fecha_apertura,
      fecha_cierre,
      fecha_limite_entrega,
      permitir_entregas_fuera_tiempo,
      descripcion_entrega,
      criterios_evaluacion,
      archivos_plantilla,
      requerimientos,
      razon_cambio
    } = req.body;

    // Verificar que la etapa existe
    const existingEtapa = await pool.query(
      `SELECT * FROM etapas WHERE id = $1`,
      [id]
    );

    if (existingEtapa.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    const oldEtapa = existingEtapa.rows[0];

    // Validar cambios de estado válidos
    const validStateTransitions: Record<string, string[]> = {
      'planificada': ['abierta'],
      'abierta': ['cerrada'],
      'cerrada': []
    };

    if (estado && !validStateTransitions[oldEtapa.estado]?.includes(estado)) {
      return res.status(400).json({
        success: false,
        error: `No se puede cambiar de ${oldEtapa.estado} a ${estado}`
      });
    }

    // Bloquear cambios de tipo por parte del administrador (no debe modificarse)
    if (tipo && tipo !== oldEtapa.tipo) {
      return res.status(400).json({ success: false, error: 'El tipo no puede ser modificado por el administrador' });
    }

    // Validar fechas si se proporcionan
    const newFechaApertura = fecha_apertura || oldEtapa.fecha_apertura;
    const newFechaCierre = fecha_cierre || oldEtapa.fecha_cierre;

    if (newFechaApertura && newFechaCierre && new Date(newFechaApertura) >= new Date(newFechaCierre)) {
      return res.status(400).json({
        success: false,
        error: 'La fecha de cierre debe ser posterior a la fecha de apertura'
      });
    }

    const result = await pool.query(
      `UPDATE etapas SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        estado = COALESCE($3, estado),
        fecha_apertura = COALESCE($4, fecha_apertura),
        fecha_cierre = COALESCE($5, fecha_cierre),
        fecha_limite_entrega = COALESCE($6, fecha_limite_entrega),
        permitir_entregas_fuera_tiempo = COALESCE($7, permitir_entregas_fuera_tiempo),
        descripcion_entrega = COALESCE($8, descripcion_entrega),
        criterios_evaluacion = COALESCE($9, criterios_evaluacion),
        archivos_plantilla = COALESCE($10, archivos_plantilla),
        requerimientos = COALESCE($11, requerimientos),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *`,
      [
        nombre, descripcion, estado,
        fecha_apertura, fecha_cierre, fecha_limite_entrega,
        permitir_entregas_fuera_tiempo, descripcion_entrega,
        criterios_evaluacion, archivos_plantilla, requerimientos, id
      ]
    );

    // Registrar en historial si hay cambios significativos
    if (estado !== oldEtapa.estado) {
      await pool.query(
        `INSERT INTO etapas_historial (etapa_id, accion, datos_antiguos, datos_nuevos, razon_cambio, realizado_por)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, 'cambio_estado', JSON.stringify(oldEtapa), JSON.stringify(result.rows[0]), razon_cambio || null, req.user!.id]
      );
    }

    res.json({
      success: true,
      message: 'Etapa actualizada exitosamente',
      etapa: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating etapa:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar etapa' });
  }
});

// ============================================
// GESTIÓN DE ETAPAS POR PROYECTO
// ============================================

// GET: Obtener etapas activas de un proyecto
router.get('/proyecto/:proyectoId', async (req: AuthRequest, res) => {
  try {
    const { proyectoId } = req.params;

    const result = await pool.query(`
      SELECT 
        e.*,
        ep.fecha_apertura_proyecto,
        ep.fecha_cierre_proyecto,
        ep.fecha_limite_entrega_proyecto,
        COALESCE(ep.fecha_apertura_proyecto, e.fecha_apertura) as fecha_apertura_efectiva,
        COALESCE(ep.fecha_cierre_proyecto, e.fecha_cierre) as fecha_cierre_efectiva,
        COALESCE(ep.fecha_limite_entrega_proyecto, e.fecha_limite_entrega) as fecha_limite_efectiva
      FROM etapas e
      LEFT JOIN etapa_proyecto ep ON e.id = ep.etapa_id AND ep.proyecto_id = $1
      ORDER BY e.numero_orden ASC
    `, [proyectoId]);

    res.json({
      success: true,
      etapas: result.rows
    });
  } catch (error) {
    console.error('Error fetching proyecto etapas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapas del proyecto' });
  }
});

// POST: Asignar etapa a proyecto con fechas personalizadas (solo Admin)
router.post('/proyecto/:proyectoId/asignar', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { proyectoId } = req.params;
    const { etapa_id, fecha_apertura_proyecto, fecha_cierre_proyecto, fecha_limite_entrega_proyecto } = req.body;

    if (!etapa_id) {
      return res.status(400).json({ success: false, error: 'etapa_id es requerido' });
    }

    // Verificar que el proyecto existe
    const projectExists = await pool.query(`SELECT id FROM proyectos WHERE id = $1`, [proyectoId]);
    if (projectExists.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    // Verificar que la etapa existe
    const etapaExists = await pool.query(`SELECT id FROM etapas WHERE id = $1`, [etapa_id]);
    if (etapaExists.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    const result = await pool.query(`
      INSERT INTO etapa_proyecto (etapa_id, proyecto_id, fecha_apertura_proyecto, fecha_cierre_proyecto, fecha_limite_entrega_proyecto)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (etapa_id, proyecto_id) DO UPDATE SET
        fecha_apertura_proyecto = COALESCE($3, etapa_proyecto.fecha_apertura_proyecto),
        fecha_cierre_proyecto = COALESCE($4, etapa_proyecto.fecha_cierre_proyecto),
        fecha_limite_entrega_proyecto = COALESCE($5, etapa_proyecto.fecha_limite_entrega_proyecto)
      RETURNING *
    `, [etapa_id, proyectoId, fecha_apertura_proyecto || null, fecha_cierre_proyecto || null, fecha_limite_entrega_proyecto || null]);

    res.json({
      success: true,
      message: 'Etapa asignada al proyecto exitosamente',
      asignacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error assigning etapa to proyecto:', error);
    res.status(500).json({ success: false, error: 'Error al asignar etapa al proyecto' });
  }
});

// ============================================
// HISTORIAL DE CAMBIOS EN ETAPAS
// ============================================

// GET: Obtener historial de cambios de una etapa
router.get('/:id/historial', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        eh.*,
        u.nombre || ' ' || u.apellidos as realizado_por_nombre
      FROM etapas_historial eh
      LEFT JOIN usuarios u ON eh.realizado_por = u.id
      WHERE eh.etapa_id = $1
      ORDER BY eh.fecha DESC
    `, [id]);

    res.json({
      success: true,
      historial: result.rows
    });
  } catch (error) {
    console.error('Error fetching etapa historial:', error);
    res.status(500).json({ success: false, error: 'Error al obtener historial' });
  }
});

// POST: Asignar etapa a materia
router.post('/asignar', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { gestion_materia_id, etapa_id, orden_ejecucion } = req.body;

    if (!gestion_materia_id || !etapa_id) {
      return res.status(400).json({
        success: false,
        error: 'gestion_materia_id y etapa_id son requeridos'
      });
    }

    // Verificar que no esté ya asignada
    const checkRes = await pool.query(
      `SELECT id FROM materia_etapas WHERE gestion_materia_id = $1 AND etapa_id = $2`,
      [gestion_materia_id, etapa_id]
    );

    if (checkRes.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Esta etapa ya está asignada a la materia'
      });
    }

    const result = await pool.query(
      `INSERT INTO materia_etapas (gestion_materia_id, etapa_id, orden_ejecucion)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [gestion_materia_id, etapa_id, orden_ejecucion || 1]
    );

    res.status(201).json({
      success: true,
      message: 'Etapa asignada a la materia exitosamente',
      materia_etapa: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error asignando etapa:', error);
    res.status(500).json({ success: false, error: 'Error al asignar etapa' });
  }
});

// DELETE: Desasignar etapa de materia
router.delete('/desasignar/:gestionMateriaId/:etapaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { gestionMateriaId, etapaId } = req.params;

    const result = await pool.query(
      `DELETE FROM materia_etapas
       WHERE gestion_materia_id = $1 AND etapa_id = $2
       RETURNING *`,
      [gestionMateriaId, etapaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Asignación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Etapa desasignada de la materia exitosamente'
    });
  } catch (error) {
    console.error('Error desasignando etapa:', error);
    res.status(500).json({ success: false, error: 'Error al desasignar etapa' });
  }
});

// ============================================
// GESTIÓN DE TAREAS DE ETAPAS
// ============================================

// GET: Obtener todas las tareas de una etapa
router.get('/:etapaId/tareas', authenticate, async (req: AuthRequest, res) => {
  try {
    const { etapaId } = req.params;
    console.log('GET /etapas/:etapaId/tareas - etapaId:', etapaId);

    const result = await pool.query(
      `SELECT 
        id, etapa_id, titulo, descripcion, tipo, estado,
        fecha_limite, peso_evaluacion, orden, 
        created_at, updated_at, created_by
      FROM tareas
      WHERE etapa_id = $1
      ORDER BY orden ASC, created_at ASC`,
      [etapaId]
    );

    console.log('Tareas found:', result.rows.length);
    res.json({
      success: true,
      tareas: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener tareas' });
  }
});

// POST: Crear nueva tarea en una etapa
router.post('/:etapaId/tareas', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { etapaId } = req.params;
    const { titulo, descripcion, tipo, fecha_limite, peso_evaluacion } = req.body;
    const userId = req.user?.id;

    console.log('POST /etapas/:etapaId/tareas', {
      etapaId,
      titulo,
      tipo,
      fecha_limite,
      peso_evaluacion,
      userId
    });

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El título de la tarea es requerido'
      });
    }

    // Verificar que la etapa existe
    const etapaCheck = await pool.query(
      'SELECT id FROM etapas WHERE id = $1',
      [etapaId]
    );

    if (etapaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Etapa no encontrada'
      });
    }

    // Obtener el siguiente orden
    const ordenResult = await pool.query(
      'SELECT COALESCE(MAX(orden), 0) + 1 as next_orden FROM tareas WHERE etapa_id = $1',
      [etapaId]
    );
    const nextOrden = ordenResult.rows[0].next_orden;

    const result = await pool.query(
      `INSERT INTO tareas (
        etapa_id, titulo, descripcion, tipo, estado,
        fecha_limite, peso_evaluacion, orden, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        etapaId,
        titulo.trim(),
        descripcion?.trim() || null,
        tipo || 'individual',
        'pendiente',
        fecha_limite || null,
        peso_evaluacion || 0,
        nextOrden,
        userId
      ]
    );

    console.log('Tarea created:', result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      tarea: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando tarea:', error);
    res.status(500).json({ success: false, error: 'Error al crear tarea' });
  }
});

// PUT: Actualizar tarea completa
router.put('/:etapaId/tareas/:tareaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { etapaId, tareaId } = req.params;
    const { titulo, descripcion, tipo, fecha_limite, peso_evaluacion, estado } = req.body;

    console.log('PUT /etapas/:etapaId/tareas/:tareaId', {
      etapaId,
      tareaId,
      titulo,
      tipo,
      estado
    });

    const result = await pool.query(
      `UPDATE tareas
       SET titulo = COALESCE($1, titulo),
           descripcion = $2,
           tipo = COALESCE($3, tipo),
           fecha_limite = $4,
           peso_evaluacion = COALESCE($5, peso_evaluacion),
           estado = COALESCE($6, estado),
           updated_at = NOW()
       WHERE id = $7 AND etapa_id = $8
       RETURNING *`,
      [
        titulo?.trim(),
        descripcion?.trim() || null,
        tipo,
        fecha_limite || null,
        peso_evaluacion,
        estado,
        tareaId,
        etapaId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      tarea: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar tarea' });
  }
});

// PATCH: Cambiar solo el estado de la tarea
router.patch('/:etapaId/tareas/:tareaId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { etapaId, tareaId } = req.params;
    const { estado } = req.body;

    console.log('PATCH /etapas/:etapaId/tareas/:tareaId - cambiar estado', {
      etapaId,
      tareaId,
      estado
    });

    const validEstados = ['pendiente', 'en_progreso', 'completada', 'cancelada'];
    if (!validEstados.includes(estado)) {
      return res.status(400).json({
        success: false,
        error: 'Estado no válido'
      });
    }

    const result = await pool.query(
      `UPDATE tareas
       SET estado = $1, updated_at = NOW()
       WHERE id = $2 AND etapa_id = $3
       RETURNING *`,
      [estado, tareaId, etapaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Estado de tarea actualizado',
      tarea: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando estado de tarea:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar estado' });
  }
});

// DELETE: Eliminar tarea
router.delete('/:etapaId/tareas/:tareaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { etapaId, tareaId } = req.params;

    console.log('DELETE /etapas/:etapaId/tareas/:tareaId', {
      etapaId,
      tareaId
    });

    const result = await pool.query(
      'DELETE FROM tareas WHERE id = $1 AND etapa_id = $2 RETURNING *',
      [tareaId, etapaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar tarea' });
  }
});

export default router;
