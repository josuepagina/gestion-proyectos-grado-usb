import express from 'express';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// ============================================
// GESTIÓN DE TAREAS - Por Etapa y Materia
// ============================================

// GET: Obtener tareas de una etapa dentro de una materia
router.get('/etapa/:etapaId/materia/:gestionMateriaId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { etapaId, gestionMateriaId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        id, nombre, descripcion, estado, prioridad, 
        fecha_vencimiento, created_at, updated_at, created_by
      FROM tareas
      WHERE etapa_id = $1 AND gestion_materia_id = $2
      ORDER BY prioridad DESC, fecha_vencimiento ASC
    `, [etapaId, gestionMateriaId]);

    res.json({
      success: true,
      tareas: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching tareas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener tareas' });
  }
});

// GET: Obtener una tarea específica
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM tareas WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    res.json({ success: true, tarea: result.rows[0] });
  } catch (error) {
    console.error('Error fetching tarea:', error);
    res.status(500).json({ success: false, error: 'Error al obtener tarea' });
  }
});

// POST: Crear nueva tarea
router.post('/', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const {
      gestion_materia_id,
      etapa_id,
      nombre,
      descripcion,
      prioridad = 'media',
      fecha_vencimiento
    } = req.body;

    if (!gestion_materia_id || !etapa_id || !nombre) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: gestion_materia_id, etapa_id, nombre'
      });
    }

    if (!['baja', 'media', 'alta', 'urgente'].includes(prioridad)) {
      return res.status(400).json({
        success: false,
        error: 'Prioridad inválida. Debe ser: baja, media, alta o urgente'
      });
    }

    const userId = (req as AuthRequest).user?.id;

    const result = await pool.query(
      `INSERT INTO tareas (gestion_materia_id, etapa_id, nombre, descripcion, prioridad, fecha_vencimiento, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [gestion_materia_id, etapa_id, nombre, descripcion || null, prioridad, fecha_vencimiento || null, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      tarea: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error creating tarea:', error);
    res.status(500).json({ success: false, error: 'Error al crear tarea' });
  }
});

// PUT: Actualizar tarea
router.put('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      estado,
      prioridad,
      fecha_vencimiento
    } = req.body;

    const checkRes = await pool.query(
      `SELECT id FROM tareas WHERE id = $1`,
      [id]
    );

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    if (estado && !['pendiente', 'en_progreso', 'completada', 'cancelada'].includes(estado)) {
      return res.status(400).json({
        success: false,
        error: 'Estado inválido. Debe ser: pendiente, en_progreso, completada o cancelada'
      });
    }

    if (prioridad && !['baja', 'media', 'alta', 'urgente'].includes(prioridad)) {
      return res.status(400).json({
        success: false,
        error: 'Prioridad inválida. Debe ser: baja, media, alta o urgente'
      });
    }

    const result = await pool.query(
      `UPDATE tareas
       SET nombre = COALESCE($2, nombre),
           descripcion = COALESCE($3, descripcion),
           estado = COALESCE($4, estado),
           prioridad = COALESCE($5, prioridad),
           fecha_vencimiento = COALESCE($6, fecha_vencimiento),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, nombre, descripcion, estado, prioridad, fecha_vencimiento]
    );

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      tarea: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating tarea:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar tarea' });
  }
});

// DELETE: Eliminar tarea
router.delete('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM tareas WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting tarea:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar tarea' });
  }
});

export default router;
