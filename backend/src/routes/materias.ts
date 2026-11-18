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
// GESTIÓN DE ETAPAS POR MATERIA
// ============================================

// GET: Obtener todas las etapas de una materia
router.get('/:materiaId/etapas', async (req: AuthRequest, res) => {
  try {
    const { materiaId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        e.id, e.nombre, e.descripcion, e.numero_orden, e.tipo, e.estado,
        e.fecha_apertura, e.fecha_cierre, e.fecha_limite_entrega,
        e.permitir_entregas_fuera_tiempo, e.descripcion_entrega,
        e.criterios_evaluacion, e.archivos_plantilla, e.requerimientos,
        e.created_at, e.updated_at
      FROM etapas e
      LEFT JOIN materia_etapas me ON e.id = me.etapa_id
      WHERE me.materia_id = $1
      ORDER BY e.numero_orden ASC
      `,
      [materiaId]
    );

    res.json({
      success: true,
      etapas: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching etapas for materia:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapas' });
  }
});

// GET: Obtener una etapa específica de una materia
router.get('/:materiaId/etapas/:etapaId', async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        e.id, e.nombre, e.descripcion, e.numero_orden, e.tipo, e.estado,
        e.fecha_apertura, e.fecha_cierre, e.fecha_limite_entrega,
        e.permitir_entregas_fuera_tiempo, e.descripcion_entrega,
        e.criterios_evaluacion, e.archivos_plantilla, e.requerimientos,
        e.created_at, e.updated_at
      FROM etapas e
      INNER JOIN materia_etapas me ON e.id = me.etapa_id
      WHERE e.id = $1 AND me.materia_id = $2
      `,
      [etapaId, materiaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada en esta materia' });
    }

    res.json({ success: true, etapa: result.rows[0] });
  } catch (error) {
    console.error('Error fetching etapa:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapa' });
  }
});

// POST: Crear nueva etapa en una materia (solo Admin)
router.post('/:materiaId/etapas', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  console.log('🔔 POST /materias/:materiaId/etapas CALLED');
  console.log('   User:', req.user?.email, '- Role:', req.user?.rol);
  
  try {
    const { materiaId } = req.params;
    const {
      nombre,
      descripcion,
      tipo,
      numero_orden,
      fecha_apertura,
      fecha_cierre,
      fecha_limite_entrega,
      permitir_entregas_fuera_tiempo,
      descripcion_entrega,
      criterios_evaluacion,
      archivos_plantilla,
      requerimientos
    } = req.body;

    console.log('📝 Creating etapa for materia:', materiaId);
    console.log('📝 Etapa data:', { nombre, tipo, fecha_apertura, fecha_cierre });

    if (!nombre) {
      console.log('❌ Validation failed: nombre is required');
      return res.status(400).json({ success: false, error: 'El nombre de la etapa es requerido' });
    }

    // Verify materia exists
    const materiaExists = await pool.query('SELECT id FROM gestion_materias WHERE id = $1', [materiaId]);
    console.log('✅ Materia exists check:', materiaExists.rows.length > 0);
    
    if (materiaExists.rows.length === 0) {
      console.log('❌ Materia not found:', materiaId);
      return res.status(404).json({ success: false, error: 'Materia no encontrada' });
    }

    // Derive tipo if not provided
    const etapaTipo = tipo || deriveTipo(nombre);

    // For materias, we don't enforce numero_orden uniqueness globally
    // Just use the provided value or NULL
    const etapaNumeroOrden = numero_orden || null;

    console.log('📝 Etapa numero_orden:', etapaNumeroOrden);

    // Create etapa
    const etapaResult = await pool.query(
      `
      INSERT INTO etapas (
        nombre, descripcion, numero_orden, tipo, estado,
        fecha_apertura, fecha_cierre, fecha_limite_entrega,
        permitir_entregas_fuera_tiempo, descripcion_entrega,
        criterios_evaluacion, archivos_plantilla, requerimientos,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
      `,
      [
        nombre,
        descripcion || null,
        etapaNumeroOrden,
        etapaTipo,
        'planificada',
        fecha_apertura || null,
        fecha_cierre || null,
        fecha_limite_entrega || null,
        permitir_entregas_fuera_tiempo || false,
        descripcion_entrega || null,
        criterios_evaluacion || null,
        archivos_plantilla || null,
        requerimientos || null,
        req.user?.id || null
      ]
    );

    const etapaId = etapaResult.rows[0].id;
    console.log('✅ Etapa created with id:', etapaId);

    // Link etapa to materia
    console.log('📝 Linking etapa to materia:', { materiaId, etapaId });
    const linkResult = await pool.query(
      `
      INSERT INTO materia_etapas (materia_id, etapa_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [materiaId, etapaId]
    );
    
    console.log('✅ Link created:', linkResult.rows[0]?.id);

    res.status(201).json({
      success: true,
      message: 'Etapa creada exitosamente',
      etapa: etapaResult.rows[0]
    });
  } catch (error: any) {
    console.error('❌ Error creating etapa:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({ success: false, error: error.message || 'Error al crear etapa' });
  }
});

// PUT: Actualizar etapa de una materia (solo Admin)
router.put('/:materiaId/etapas/:etapaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId } = req.params;
    const {
      nombre,
      descripcion,
      tipo,
      fecha_apertura,
      fecha_cierre,
      fecha_limite_entrega,
      permitir_entregas_fuera_tiempo,
      descripcion_entrega,
      criterios_evaluacion,
      archivos_plantilla,
      requerimientos
    } = req.body;

    // Verify etapa belongs to this materia
    const existingEtapa = await pool.query(
      `
      SELECT e.id FROM etapas e
      INNER JOIN materia_etapas me ON e.id = me.etapa_id
      WHERE e.id = $1 AND me.materia_id = $2
      `,
      [etapaId, materiaId]
    );

    if (existingEtapa.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada en esta materia' });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (nombre !== undefined) {
      updates.push(`nombre = $${paramCount++}`);
      values.push(nombre);
    }
    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      values.push(descripcion || null);
    }
    if (tipo !== undefined) {
      updates.push(`tipo = $${paramCount++}`);
      values.push(tipo);
    }
    if (fecha_apertura !== undefined) {
      updates.push(`fecha_apertura = $${paramCount++}`);
      values.push(fecha_apertura || null);
    }
    if (fecha_cierre !== undefined) {
      updates.push(`fecha_cierre = $${paramCount++}`);
      values.push(fecha_cierre || null);
    }
    if (fecha_limite_entrega !== undefined) {
      updates.push(`fecha_limite_entrega = $${paramCount++}`);
      values.push(fecha_limite_entrega || null);
    }
    if (permitir_entregas_fuera_tiempo !== undefined) {
      updates.push(`permitir_entregas_fuera_tiempo = $${paramCount++}`);
      values.push(permitir_entregas_fuera_tiempo);
    }
    if (descripcion_entrega !== undefined) {
      updates.push(`descripcion_entrega = $${paramCount++}`);
      values.push(descripcion_entrega || null);
    }
    if (criterios_evaluacion !== undefined) {
      updates.push(`criterios_evaluacion = $${paramCount++}`);
      values.push(criterios_evaluacion || null);
    }
    if (archivos_plantilla !== undefined) {
      updates.push(`archivos_plantilla = $${paramCount++}`);
      values.push(archivos_plantilla || null);
    }
    if (requerimientos !== undefined) {
      updates.push(`requerimientos = $${paramCount++}`);
      values.push(requerimientos || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No hay campos para actualizar' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(etapaId);

    const result = await pool.query(
      `UPDATE etapas SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

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

// DELETE: Eliminar etapa de una materia (solo Admin)
router.delete('/:materiaId/etapas/:etapaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId } = req.params;

    // Verify etapa belongs to this materia
    const existingEtapa = await pool.query(
      `
      SELECT e.id FROM etapas e
      INNER JOIN materia_etapas me ON e.id = me.etapa_id
      WHERE e.id = $1 AND me.materia_id = $2
      `,
      [etapaId, materiaId]
    );

    if (existingEtapa.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada en esta materia' });
    }

    // Delete relationship first
    await pool.query('DELETE FROM materia_etapas WHERE etapa_id = $1', [etapaId]);

    // Then delete etapa
    await pool.query('DELETE FROM etapas WHERE id = $1', [etapaId]);

    res.json({
      success: true,
      message: 'Etapa eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting etapa:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar etapa' });
  }
});

// PATCH: Cambiar estado de una etapa (solo Admin)
router.patch('/:materiaId/etapas/:etapaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  console.log('🔔 PATCH /materias/:materiaId/etapas/:etapaId CALLED');
  console.log('   Params:', req.params);
  console.log('   Body:', req.body);
  
  try {
    const { materiaId, etapaId } = req.params;
    const { estado } = req.body;

    console.log('📝 Changing etapa state:', { materiaId, etapaId, estado });

    if (!estado) {
      console.log('❌ Validation failed: estado is required');
      return res.status(400).json({ success: false, error: 'El estado es requerido' });
    }

    const validEstados = ['planificada', 'abierta', 'cerrada', 'archivada'];
    if (!validEstados.includes(estado)) {
      console.log('❌ Invalid estado:', estado);
      return res.status(400).json({ success: false, error: `Estado inválido. Debe ser uno de: ${validEstados.join(', ')}` });
    }

    // Verify etapa belongs to this materia
    console.log('📝 Verifying etapa belongs to materia...');
    const existingEtapa = await pool.query(
      `
      SELECT e.id FROM etapas e
      INNER JOIN materia_etapas me ON e.id = me.etapa_id
      WHERE e.id = $1 AND me.materia_id = $2
      `,
      [etapaId, materiaId]
    );

    console.log('✅ Etapa verification result:', existingEtapa.rows.length > 0);

    if (existingEtapa.rows.length === 0) {
      console.log('❌ Etapa not found in materia');
      return res.status(404).json({ success: false, error: 'Etapa no encontrada en esta materia' });
    }

    console.log('📝 Updating etapa estado...');
    
    // First, ensure the etapa has created_by if it doesn't
    await pool.query(
      'UPDATE etapas SET created_by = COALESCE(created_by, $1) WHERE id = $2',
      [req.user?.id || null, etapaId]
    );
    
    const result = await pool.query(
      'UPDATE etapas SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [estado, etapaId]
    );

    console.log('✅ Estado updated successfully');

    res.json({
      success: true,
      message: `Etapa cambiada a estado: ${estado}`,
      etapa: result.rows[0]
    });
  } catch (error: any) {
    console.error('❌ Error updating etapa estado:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({ success: false, error: error.message || 'Error al actualizar estado de etapa' });
  }
});

// ============================================
// GESTIÓN DE TAREAS DE ETAPAS (EN CONTEXTO DE MATERIA)
// ============================================

// GET: Obtener todas las tareas de una etapa dentro de una materia
router.get('/:materiaId/etapas/:etapaId/tareas', authenticate, async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId } = req.params;
    console.log('GET /materias/:materiaId/etapas/:etapaId/tareas', { materiaId, etapaId });

    // Verificar que la etapa pertenece a la materia
    const etapaCheck = await pool.query(
      `SELECT e.id FROM etapas e
       INNER JOIN materia_etapas me ON e.id = me.etapa_id
       WHERE e.id = $1 AND me.materia_id = $2`,
      [etapaId, materiaId]
    );

    if (etapaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Etapa no encontrada en esta materia'
      });
    }

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

// POST: Crear nueva tarea en una etapa de una materia
router.post('/:materiaId/etapas/:etapaId/tareas', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId } = req.params;
    const { titulo, descripcion, fecha_limite } = req.body;
    const userId = req.user?.id;

    console.log('POST /materias/:materiaId/etapas/:etapaId/tareas', {
      materiaId,
      etapaId,
      titulo,
      fecha_limite,
      userId
    });

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El título de la tarea es requerido'
      });
    }

    // Verificar que la etapa pertenece a la materia
    const etapaCheck = await pool.query(
      `SELECT e.id FROM etapas e
       INNER JOIN materia_etapas me ON e.id = me.etapa_id
       WHERE e.id = $1 AND me.materia_id = $2`,
      [etapaId, materiaId]
    );

    if (etapaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Etapa no encontrada en esta materia'
      });
    }

    const result = await pool.query(
      `INSERT INTO tareas (
        etapa_id, titulo, nombre, descripcion, estado,
        fecha_vencimiento, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        etapaId,
        titulo.trim(),
        titulo.trim(),
        descripcion?.trim() || null,
        'pendiente',
        fecha_limite || null,
        userId
      ]
    );

    console.log('Tarea created:', result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      tarea: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error creando tarea:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ success: false, error: 'Error al crear tarea: ' + error.message });
  }
});

// PUT: Actualizar tarea completa
router.put('/:materiaId/etapas/:etapaId/tareas/:tareaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId, tareaId } = req.params;
    const { titulo, descripcion, tipo, fecha_limite, peso_evaluacion, estado } = req.body;

    console.log('PUT /materias/:materiaId/etapas/:etapaId/tareas/:tareaId', {
      materiaId,
      etapaId,
      tareaId,
      titulo,
      tipo,
      estado
    });

    // Verificar que la etapa pertenece a la materia
    const etapaCheck = await pool.query(
      `SELECT e.id FROM etapas e
       INNER JOIN materia_etapas me ON e.id = me.etapa_id
       WHERE e.id = $1 AND me.materia_id = $2`,
      [etapaId, materiaId]
    );

    if (etapaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Etapa no encontrada en esta materia'
      });
    }

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
router.patch('/:materiaId/etapas/:etapaId/tareas/:tareaId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId, tareaId } = req.params;
    const { estado } = req.body;

    console.log('PATCH /materias/:materiaId/etapas/:etapaId/tareas/:tareaId', {
      materiaId,
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

    // Verificar que la etapa pertenece a la materia
    const etapaCheck = await pool.query(
      `SELECT e.id FROM etapas e
       INNER JOIN materia_etapas me ON e.id = me.etapa_id
       WHERE e.id = $1 AND me.materia_id = $2`,
      [etapaId, materiaId]
    );

    if (etapaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Etapa no encontrada en esta materia'
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
router.delete('/:materiaId/etapas/:etapaId/tareas/:tareaId', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { materiaId, etapaId, tareaId } = req.params;

    console.log('DELETE /materias/:materiaId/etapas/:etapaId/tareas/:tareaId', {
      materiaId,
      etapaId,
      tareaId
    });

    // Verificar que la etapa pertenece a la materia
    const etapaCheck = await pool.query(
      `SELECT e.id FROM etapas e
       INNER JOIN materia_etapas me ON e.id = me.etapa_id
       WHERE e.id = $1 AND me.materia_id = $2`,
      [etapaId, materiaId]
    );

    if (etapaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Etapa no encontrada en esta materia'
      });
    }

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
