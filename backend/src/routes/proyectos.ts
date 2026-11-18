import express from 'express';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const isAdmin = (user: AuthRequest['user']) => user?.rol === 'administrador';
const isStudent = (user: AuthRequest['user']) => user?.rol === 'estudiante';
const isTutor = (user: AuthRequest['user']) => !!user && (user.es_tutor || user.rol === 'tutor');
const isRevisor = (user: AuthRequest['user']) => !!user && (user.es_revisor || user.rol === 'revisor');

const createProyectoSchema = z.object({
  titulo: z.string().min(5).max(500),
  descripcion: z.string().optional(),
  estudiante_id: z.string().uuid(),
  tutor_id: z.string().uuid().optional().nullable(),
});

const updateProyectoSchema = z.object({
  titulo: z.string().min(5).max(500).optional(),
  descripcion: z.string().optional(),
  fecha_entrega: z.string().optional(),
});

// Get all projects (filtered by role)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let query = '';
    let params: any[] = [];

    if (isStudent(req.user)) {
      query = `
        SELECT p.*, 
               u1.nombre || ' ' || u1.apellidos as estudiante_nombre,
               u2.nombre || ' ' || u2.apellidos as tutor_nombre
        FROM proyectos p
        JOIN usuarios u1 ON p.estudiante_id = u1.id
        LEFT JOIN usuarios u2 ON p.tutor_id = u2.id
        WHERE p.estudiante_id = $1
        ORDER BY p.created_at DESC
      `;
      params = [req.user!.id];
    } else if (isTutor(req.user) && isRevisor(req.user)) {
      query = `
        SELECT DISTINCT p.*, 
               u1.nombre || ' ' || u1.apellidos as estudiante_nombre,
               u2.nombre || ' ' || u2.apellidos as tutor_nombre
        FROM proyectos p
        JOIN usuarios u1 ON p.estudiante_id = u1.id
        LEFT JOIN usuarios u2 ON p.tutor_id = u2.id
        LEFT JOIN proyecto_revisores pr ON p.id = pr.proyecto_id
        WHERE p.tutor_id = $1 OR pr.revisor_id = $1
        ORDER BY p.created_at DESC
      `;
      params = [req.user!.id];
    } else if (isTutor(req.user)) {
      query = `
        SELECT p.*, 
               u1.nombre || ' ' || u1.apellidos as estudiante_nombre,
               u2.nombre || ' ' || u2.apellidos as tutor_nombre
        FROM proyectos p
        JOIN usuarios u1 ON p.estudiante_id = u1.id
        LEFT JOIN usuarios u2 ON p.tutor_id = u2.id
        WHERE p.tutor_id = $1
        ORDER BY p.created_at DESC
      `;
      params = [req.user!.id];
    } else if (isRevisor(req.user)) {
      query = `
        SELECT DISTINCT p.*, 
               u1.nombre || ' ' || u1.apellidos as estudiante_nombre,
               u2.nombre || ' ' || u2.apellidos as tutor_nombre
        FROM proyectos p
        JOIN proyecto_revisores pr ON p.id = pr.proyecto_id
        JOIN usuarios u1 ON p.estudiante_id = u1.id
        LEFT JOIN usuarios u2 ON p.tutor_id = u2.id
        WHERE pr.revisor_id = $1
        ORDER BY p.created_at DESC
      `;
      params = [req.user!.id];
    } else {
      // Administrador ve todos
      query = `
        SELECT p.*, 
               u1.nombre || ' ' || u1.apellidos as estudiante_nombre,
               u2.nombre || ' ' || u2.apellidos as tutor_nombre
        FROM proyectos p
        JOIN usuarios u1 ON p.estudiante_id = u1.id
        LEFT JOIN usuarios u2 ON p.tutor_id = u2.id
        ORDER BY p.created_at DESC
      `;
    }

    const result = await pool.query(query, params);
    res.json({ proyectos: result.rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify access
    const project = await pool.query(
      'SELECT * FROM proyectos WHERE id = $1',
      [id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const proj = project.rows[0];

    // Check permissions
    if (isStudent(req.user) && proj.estudiante_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const ownerTutor = proj.tutor_id && proj.tutor_id === req.user!.id;

    if (isTutor(req.user) && !isRevisor(req.user) && proj.tutor_id && proj.tutor_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // For reviewers: check if they are assigned to this project
    if (isRevisor(req.user) && !ownerTutor) {
      const revisorCheck = await pool.query(
        'SELECT id FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2',
        [id, req.user!.id]
      );
      if (revisorCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    // Get project with relations
    const result = await pool.query(
      `SELECT p.*, 
              u1.nombre || ' ' || u1.apellidos as estudiante_nombre,
              u1.email as estudiante_email,
              u2.nombre || ' ' || u2.apellidos as tutor_nombre,
              u2.email as tutor_email
       FROM proyectos p
       JOIN usuarios u1 ON p.estudiante_id = u1.id
       LEFT JOIN usuarios u2 ON p.tutor_id = u2.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to load project details' });
    }

    res.json({ proyecto: result.rows[0] });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project (only admin)
router.post('/', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const data = createProyectoSchema.parse(req.body);

    const estudianteResult = await pool.query(
      `SELECT id FROM usuarios WHERE id = $1 AND rol = 'estudiante' AND estado = 'activo'`,
      [data.estudiante_id]
    );

    if (estudianteResult.rows.length === 0) {
      return res.status(400).json({ error: 'El estudiante seleccionado no es válido o no está activo' });
    }

    if (data.tutor_id) {
      const tutorResult = await pool.query(
        `SELECT id FROM usuarios WHERE id = $1 AND (es_tutor = true OR rol = 'tutor') AND estado = 'activo'`,
        [data.tutor_id]
      );

      if (tutorResult.rows.length === 0) {
        return res.status(400).json({ error: 'El tutor seleccionado no es válido o no está activo' });
      }
    }

    const result = await pool.query(
      `INSERT INTO proyectos (titulo, descripcion, estudiante_id, tutor_id, fecha_entrega)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)
       RETURNING *`,
      [
        data.titulo,
        data.descripcion || null,
        data.estudiante_id,
        data.tutor_id || null
      ]
    );

    await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
       VALUES ($1, 'proyecto_asignado', 'Se te ha asignado un nuevo proyecto de grado', $2, 'proyecto')`,
      [data.estudiante_id, result.rows[0].id]
    );

    if (data.tutor_id) {
      await pool.query(
        `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
         VALUES ($1, 'proyecto_asignado', 'Has sido asignado como tutor del proyecto', $2, 'proyecto')`,
        [data.tutor_id, result.rows[0].id]
      );
    }

    res.status(201).json({ proyecto: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = updateProyectoSchema.parse(req.body);

    // Verify existence
    const project = await pool.query(
      'SELECT id FROM proyectos WHERE id = $1',
      [id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.titulo) {
      updates.push(`titulo = $${paramCount++}`);
      values.push(data.titulo);
    }
    if (data.descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      values.push(data.descripcion);
    }
    if (data.fecha_entrega) {
      updates.push(`fecha_entrega = $${paramCount++}`);
      values.push(data.fecha_entrega);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE proyectos SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({ proyecto: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (only admin)
router.delete('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM proyectos WHERE id = $1 RETURNING id, titulo',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Proyecto eliminado correctamente',
      proyecto: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    if (error?.code === '23503') {
      return res.status(400).json({ error: 'No se puede eliminar el proyecto porque tiene datos relacionados' });
    }
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Assign tutor (only admin)
router.post('/:id/assign-tutor', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { tutor_id } = z.object({ tutor_id: z.string().uuid() }).parse(req.body);

    const result = await pool.query(
      `UPDATE proyectos SET tutor_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [tutor_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create notification
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
       VALUES ($1, 'proyecto_asignado', 'Has sido asignado como tutor del proyecto', $2, 'proyecto')`,
      [tutor_id, id]
    );

    res.json({ proyecto: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error assigning tutor:', error);
    res.status(500).json({ error: 'Failed to assign tutor' });
  }
});

// Get revisores for a project
router.get('/:id/revisores', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT pr.*, 
              u.nombre || ' ' || u.apellidos as revisor_nombre,
              u.email as revisor_email
       FROM proyecto_revisores pr
       JOIN usuarios u ON pr.revisor_id = u.id
       WHERE pr.proyecto_id = $1
       ORDER BY pr.fecha_asignacion DESC`,
      [id]
    );

    res.json({ revisores: result.rows });
  } catch (error) {
    console.error('Error fetching proyecto revisores:', error);
    res.status(500).json({ error: 'Failed to fetch revisores' });
  }
});

// Assign reviewer (only admin)
router.post('/:id/assign-reviewer', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { revisor_id } = z.object({ revisor_id: z.string().uuid() }).parse(req.body);

    const result = await pool.query(
      `INSERT INTO proyecto_revisores (proyecto_id, revisor_id, asignado_por)
       VALUES ($1, $2, $3)
       ON CONFLICT (proyecto_id, revisor_id) DO NOTHING
       RETURNING *`,
      [id, revisor_id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Reviewer already assigned' });
    }

    // Create notification
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
       VALUES ($1, 'proyecto_asignado', 'Has sido asignado como revisor de un proyecto', $2, 'proyecto')`,
      [revisor_id, id]
    );

    res.json({ asignacion: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error assigning reviewer:', error);
    res.status(500).json({ error: 'Failed to assign reviewer' });
  }
});

// Close project (only tutor) - Marcar proyecto como completado
router.post('/:id/close', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify project exists and user is the tutor
    const project = await pool.query(
      'SELECT tutor_id, estudiante_id, estado FROM proyectos WHERE id = $1',
      [id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const proj = project.rows[0];

    // Check permissions: only tutor can close project
    if (!isTutor(req.user) || proj.tutor_id !== req.user!.id) {
      return res.status(403).json({ error: 'Only the assigned tutor can close the project' });
    }

    // Check if project is already in a final state
    if (['completado', 'aprobado', 'sustentado', 'rechazado'].includes(proj.estado)) {
      return res.status(400).json({ error: `Project is already in state: ${proj.estado}` });
    }

    // Validate that all required entregas are approved by tutor
    const entregasTutorResult = await pool.query(
      `SELECT etapa, COUNT(*) as total, 
              COUNT(CASE WHEN COALESCE(estado_tutor, estado_revision) = 'aprobado' THEN 1 END) as aprobadas_tutor
       FROM entregas
       WHERE proyecto_id = $1
       GROUP BY etapa`,
      [id]
    );

    // Check if there are entregas not approved by tutor
    const entregasNoAprobadasTutor = entregasTutorResult.rows.filter(
      (e: any) => e.aprobadas_tutor === 0
    );

    if (entregasNoAprobadasTutor.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede cerrar el proyecto: hay entregas que no han sido aprobadas por el tutor' 
      });
    }

    // Validate that version_final is approved by both tutor and revisor
    const versionFinalResult = await pool.query(
      `SELECT 
              COALESCE(estado_tutor, estado_revision) as estado_tutor,
              estado_revisor
       FROM entregas
       WHERE proyecto_id = $1 AND etapa = 'version_final'
       ORDER BY version DESC
       LIMIT 1`,
      [id]
    );

    if (versionFinalResult.rows.length > 0) {
      const versionFinal = versionFinalResult.rows[0];
      
      if (versionFinal.estado_tutor !== 'aprobado') {
        return res.status(400).json({ 
          error: 'No se puede cerrar el proyecto: la versión final no ha sido aprobada por el tutor' 
        });
      }

      if (!versionFinal.estado_revisor || versionFinal.estado_revisor !== 'aprobado') {
        return res.status(400).json({ 
          error: 'No se puede cerrar el proyecto: la versión final no ha sido aprobada por el revisor. Asegúrate de que todas las entregas estén aprobadas tanto por el tutor como por el revisor.' 
        });
      }
    }

    // Check if there are entregas with observaciones pendientes
    const observacionesPendientes = await pool.query(
      `SELECT COUNT(*) as total
       FROM observaciones o
       JOIN entregas e ON o.entrega_id = e.id
       WHERE e.proyecto_id = $1 AND o.estado_resuelto = false`,
      [id]
    );

    if (parseInt(observacionesPendientes.rows[0].total) > 0) {
      return res.status(400).json({ 
        error: 'No se puede cerrar el proyecto: hay observaciones sin resolver' 
      });
    }

    // Check if there are entregas pendientes de revisión por tutor
    const entregasPendientesTutor = await pool.query(
      `SELECT COUNT(*) as total
       FROM entregas
       WHERE proyecto_id = $1 AND COALESCE(estado_tutor, estado_revision) IN ('pendiente', 'en_revision', 'observado', 'rechazado')`,
      [id]
    );

    if (parseInt(entregasPendientesTutor.rows[0].total) > 0) {
      return res.status(400).json({ 
        error: 'No se puede cerrar el proyecto: hay entregas pendientes de revisión o con problemas según el tutor' 
      });
    }

    // Update project state to 'completado'
    const result = await pool.query(
      `UPDATE proyectos SET estado = 'completado', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    // Create notifications
    // Notify student
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
       VALUES ($1, 'proyecto_completado', 'Tu proyecto ha sido cerrado por el tutor y marcado como completado', $2, 'proyecto')`,
      [proj.estudiante_id, id]
    );

    // Notify admin
    const admins = await pool.query(
      `SELECT id FROM usuarios WHERE rol = 'administrador' AND estado = 'activo'`
    );
    
    for (const admin of admins.rows) {
      await pool.query(
        `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
         VALUES ($1, 'proyecto_completado', 'Proyecto completado por el tutor', $2, 'proyecto')`,
        [admin.id, id]
      );
    }

    res.json({ proyecto: result.rows[0] });
  } catch (error) {
    console.error('Error closing project:', error);
    res.status(500).json({ error: 'Failed to close project' });
  }
});

export default router;

