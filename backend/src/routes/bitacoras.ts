import express from 'express';
import { pool } from '../db/connection';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const isStudent = (user: AuthRequest['user']) => user?.rol === 'estudiante';
const isTutor = (user: AuthRequest['user']) => !!user && (user.es_tutor || user.rol === 'tutor');

// Get bitacoras for an entrega
router.get('/entrega/:entregaId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { entregaId } = req.params;

    // Verify access
    const entrega = await pool.query(
      `SELECT e.*, p.estudiante_id, p.tutor_id
       FROM entregas e
       JOIN proyectos p ON e.proyecto_id = p.id
       WHERE e.id = $1`,
      [entregaId]
    );

    if (entrega.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega not found' });
    }

    const ent = entrega.rows[0];

    // Check permissions
    if (isStudent(req.user) && ent.estudiante_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (isTutor(req.user) && ent.tutor_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(
      `SELECT b.*, 
              u.nombre || ' ' || u.apellidos as usuario_nombre,
              u.rol as usuario_rol
       FROM bitacoras b
       JOIN usuarios u ON b.usuario_id = u.id
       WHERE b.entrega_id = $1
       ORDER BY b.fecha DESC`,
      [entregaId]
    );

    res.json({ bitacoras: result.rows });
  } catch (error) {
    console.error('Error fetching bitacoras:', error);
    res.status(500).json({ error: 'Failed to fetch bitacoras' });
  }
});

// Create bitacora entry
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = z.object({
      entrega_id: z.string().uuid(),
      accion: z.enum(['creacion', 'modificacion', 'subida', 'descarga', 'revision', 'aprobacion', 'rechazo']),
      descripcion: z.string().optional(),
      cambios_detectados: z.record(z.any()).optional(),
      version_anterior: z.number().optional(),
      version_actual: z.number().optional(),
    }).parse(req.body);

    // Verify entrega exists and user has access
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

    const result = await pool.query(
      `INSERT INTO bitacoras (entrega_id, usuario_id, accion, descripcion, cambios_detectados, version_anterior, version_actual)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.entrega_id,
        req.user!.id,
        data.accion,
        data.descripcion || null,
        data.cambios_detectados ? JSON.stringify(data.cambios_detectados) : null,
        data.version_anterior || null,
        data.version_actual || null,
      ]
    );

    res.status(201).json({ bitacora: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating bitacora:', error);
    res.status(500).json({ error: 'Failed to create bitacora' });
  }
});

export default router;

