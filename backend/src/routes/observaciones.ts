import express from 'express';
import { pool } from '../db/connection';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const isStudent = (user: AuthRequest['user']) => user?.rol === 'estudiante';
const isTutor = (user: AuthRequest['user']) => !!user && (user.es_tutor || user.rol === 'tutor');
const isRevisor = (user: AuthRequest['user']) => !!user && (user.es_revisor || user.rol === 'revisor');

const observacionSchema = z.object({
  entrega_id: z.string().uuid().optional(),
  proyecto_entrega_id: z.string().uuid().optional(),
  comentario: z.string().min(1),
  seccion_documento: z.string().optional(),
  tipo: z.enum(['observacion', 'aprobacion', 'rechazo']).default('observacion'),
}).refine(data => data.entrega_id || data.proyecto_entrega_id, {
  message: 'Either entrega_id or proyecto_entrega_id must be provided',
});

// Get observaciones for an entrega (traditional or task-based)
router.get('/entrega/:entregaId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { entregaId } = req.params;
    const { tipo } = req.query; // 'tradicional' or 'tarea'

    let entrega: any;
    let proyectoId: string;
    let estudianteId: string;
    let tutorId: string;

    if (tipo === 'tarea') {
      // Query proyecto_entregas
      const result = await pool.query(
        `SELECT pe.*, p.estudiante_id, p.tutor_id
         FROM proyecto_entregas pe
         JOIN proyectos p ON pe.proyecto_id = p.id
         WHERE pe.id = $1`,
        [entregaId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Entrega not found' });
      }

      entrega = result.rows[0];
      proyectoId = entrega.proyecto_id;
      estudianteId = entrega.estudiante_id;
      tutorId = entrega.tutor_id;
    } else {
      // Query tradicional entregas
      const result = await pool.query(
        `SELECT e.*, p.estudiante_id, p.tutor_id
         FROM entregas e
         JOIN proyectos p ON e.proyecto_id = p.id
         WHERE e.id = $1`,
        [entregaId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Entrega not found' });
      }

      entrega = result.rows[0];
      proyectoId = entrega.proyecto_id;
      estudianteId = entrega.estudiante_id;
      tutorId = entrega.tutor_id;
    }

    // Check permissions
    if (isStudent(req.user) && estudianteId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (isTutor(req.user) && !isRevisor(req.user) && tutorId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Query observaciones based on tipo
    const observacionesQuery = tipo === 'tarea' 
      ? `SELECT o.*, 
                u.nombre || ' ' || u.apellidos as usuario_nombre,
                u.rol as usuario_rol
         FROM observaciones o
         JOIN usuarios u ON o.usuario_id = u.id
         WHERE o.proyecto_entrega_id = $1
         ORDER BY o.fecha DESC`
      : `SELECT o.*, 
                u.nombre || ' ' || u.apellidos as usuario_nombre,
                u.rol as usuario_rol
         FROM observaciones o
         JOIN usuarios u ON o.usuario_id = u.id
         WHERE o.entrega_id = $1
         ORDER BY o.fecha DESC`;

    const result = await pool.query(observacionesQuery, [entregaId]);

    res.json({ observaciones: result.rows });
  } catch (error) {
    console.error('Error fetching observaciones:', error);
    res.status(500).json({ error: 'Failed to fetch observaciones' });
  }
});

// Create observacion (tutor/revisor/admin)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (isStudent(req.user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const data = observacionSchema.parse(req.body);

    let proyectoId: string;
    let tutorId: string;

    if (data.proyecto_entrega_id) {
      // Verify proyecto_entrega exists and user has access
      const entrega = await pool.query(
        `SELECT pe.*, p.estudiante_id, p.tutor_id
         FROM proyecto_entregas pe
         JOIN proyectos p ON pe.proyecto_id = p.id
         WHERE pe.id = $1`,
        [data.proyecto_entrega_id]
      );

      if (entrega.rows.length === 0) {
        return res.status(404).json({ error: 'Entrega not found' });
      }

      const ent = entrega.rows[0];
      proyectoId = ent.proyecto_id;
      tutorId = ent.tutor_id;

      // Check permissions
      if (isTutor(req.user) && !isRevisor(req.user) && tutorId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      if (isRevisor(req.user) && tutorId !== req.user!.id) {
        // Check if user is assigned as revisor
        const revisorCheck = await pool.query(
          'SELECT id FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2',
          [proyectoId, req.user!.id]
        );

        if (revisorCheck.rows.length === 0) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }
    } else {
      // Verify traditional entrega exists and user has access
      const entrega = await pool.query(
        `SELECT e.*, p.estudiante_id, p.tutor_id
         FROM entregas e
         JOIN proyectos p ON e.proyecto_id = p.id
         WHERE e.id = $1`,
        [data.entrega_id]
      );

      if (entrega.rows.length === 0) {
        return res.status(404).json({ error: 'Entrega not found' });
      }

      const ent = entrega.rows[0];
      proyectoId = ent.proyecto_id;
      tutorId = ent.tutor_id;

      // Check permissions
      if (isTutor(req.user) && !isRevisor(req.user) && tutorId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      if (isRevisor(req.user) && tutorId !== req.user!.id) {
        // Check if user is assigned as revisor
        const revisorCheck = await pool.query(
          'SELECT id FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2',
          [proyectoId, req.user!.id]
        );

        if (revisorCheck.rows.length === 0) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }
    }

    const result = await pool.query(
      `INSERT INTO observaciones (entrega_id, proyecto_entrega_id, usuario_id, comentario, seccion_documento, tipo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.entrega_id || null,
        data.proyecto_entrega_id || null,
        req.user!.id,
        data.comentario,
        data.seccion_documento || null,
        data.tipo,
      ]
    );

    res.status(201).json({ observacion: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating observacion:', error);
    res.status(500).json({ error: 'Failed to create observacion' });
  }
});

// Update observacion (mark as resolved)
router.put('/:id/resolve', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership (check both traditional and task entregas)
    const observacion = await pool.query(
      `SELECT o.*, 
              COALESCE(e.proyecto_id, pe_proj.id) as proyecto_id,
              COALESCE(p.estudiante_id, pe_p.estudiante_id) as estudiante_id
       FROM observaciones o
       LEFT JOIN entregas e ON o.entrega_id = e.id
       LEFT JOIN proyectos p ON e.proyecto_id = p.id
       LEFT JOIN proyecto_entregas pe ON o.proyecto_entrega_id = pe.id
       LEFT JOIN proyectos pe_p ON pe.proyecto_id = pe_p.id
       LEFT JOIN proyectos pe_proj ON pe.proyecto_id = pe_proj.id
       WHERE o.id = $1`,
      [id]
    );

    if (observacion.rows.length === 0) {
      return res.status(404).json({ error: 'Observacion not found' });
    }

    const obs = observacion.rows[0];

    // Only student can mark as resolved
    if (!isStudent(req.user) || obs.estudiante_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(
      `UPDATE observaciones SET estado_resuelto = true WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({ observacion: result.rows[0] });
  } catch (error) {
    console.error('Error updating observacion:', error);
    res.status(500).json({ error: 'Failed to update observacion' });
  }
});

export default router;

