import express from 'express';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const router = express.Router();

const isAdmin = (user: AuthRequest['user']) => user?.rol === 'administrador';
const isStudent = (user: AuthRequest['user']) => user?.rol === 'estudiante';
const isTutor = (user: AuthRequest['user']) => !!user && (user.es_tutor || user.rol === 'tutor');
const isRevisor = (user: AuthRequest['user']) => !!user && (user.es_revisor || user.rol === 'revisor');

// Upload config (compartido con entregas)
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) }
});

// ============================================
// PROYECTO ETAPAS - Gestionadas por Tutores
// ============================================

// GET: Obtener todas las etapas de un proyecto (solo tutor del proyecto o admin)
router.get('/:proyecto_id/etapas', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id } = req.params;
    const user = req.user;

    // Verificar acceso: tutor del proyecto o admin
    const proyectoRes = await pool.query(
      'SELECT tutor_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    const isOwner = proyectoRes.rows[0].tutor_id === user!.id;
    const admin = isAdmin(user);
    let isAssignedReviewer = false;

    if (isRevisor(user)) {
      const revCheck = await pool.query(
        'SELECT 1 FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2 LIMIT 1',
        [proyecto_id, user!.id]
      );
      isAssignedReviewer = revCheck.rows.length > 0;
    }

    if (!isOwner && !admin && !isAssignedReviewer) {
      return res.status(403).json({ success: false, error: 'No tienes permiso para ver estas etapas' });
    }

    // Obtener etapas con sus tareas
    const etapasRes = await pool.query(`
      SELECT 
        pe.id, pe.nombre, pe.descripcion, pe.numero_orden, pe.estado,
        pe.fecha_publicacion, pe.fecha_inicio, pe.fecha_cierre,
        pe.permitir_entregas_fuera_tiempo, pe.created_at,
        COUNT(pt.id) as total_tareas
      FROM proyecto_etapas pe
      LEFT JOIN proyecto_tareas pt ON pe.id = pt.proyecto_etapa_id
      WHERE pe.proyecto_id = $1
      GROUP BY pe.id
      ORDER BY pe.numero_orden ASC
    `, [proyecto_id]);

    res.json({
      success: true,
      etapas: etapasRes.rows
    });
  } catch (error) {
    console.error('Error fetching proyecto etapas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapas del proyecto' });
  }
});

// GET: Obtener una etapa específica con sus tareas
router.get('/:proyecto_id/etapas/:etapa_id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id } = req.params;
    const user = req.user;

    // Verificar acceso
    const proyectoRes = await pool.query(
      'SELECT tutor_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    const isOwner = proyectoRes.rows[0].tutor_id === user!.id;
    const admin = isAdmin(user);
    let isAssignedReviewer = false;

    if (isRevisor(user)) {
      const revCheck = await pool.query(
        'SELECT 1 FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2 LIMIT 1',
        [proyecto_id, user!.id]
      );
      isAssignedReviewer = revCheck.rows.length > 0;
    }

    if (!isOwner && !admin && !isAssignedReviewer) {
      return res.status(403).json({ success: false, error: 'No tienes permiso' });
    }

    // Obtener etapa con tareas
    const etapaRes = await pool.query(`
      SELECT * FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2
    `, [etapa_id, proyecto_id]);

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    const tareaRes = await pool.query(`
      SELECT * FROM proyecto_tareas WHERE proyecto_etapa_id = $1 ORDER BY numero_orden ASC
    `, [etapa_id]);

    res.json({
      success: true,
      etapa: {
        ...etapaRes.rows[0],
        tareas: tareaRes.rows
      }
    });
  } catch (error) {
    console.error('Error fetching etapa:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapa' });
  }
});

// POST: Crear nueva etapa para un proyecto (solo tutor)
router.post('/:proyecto_id/etapas', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id } = req.params;
    const { nombre, descripcion, permitir_entregas_fuera_tiempo, fecha_inicio, fecha_cierre } = req.body;
    const user = req.user;

    // Validar campos
    if (!nombre) {
      return res.status(400).json({ success: false, error: 'El nombre de la etapa es requerido' });
    }

    // Verificar que es el tutor del proyecto
    const proyectoRes = await pool.query(
      'SELECT tutor_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    if (proyectoRes.rows[0].tutor_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'Solo el tutor puede crear etapas' });
    }

    // Obtener siguiente número de orden
    const orderRes = await pool.query(
      'SELECT COALESCE(MAX(numero_orden), 0) + 1 as next_order FROM proyecto_etapas WHERE proyecto_id = $1',
      [proyecto_id]
    );

    const numero_orden = orderRes.rows[0].next_order;

    // Crear etapa
    const result = await pool.query(`
      INSERT INTO proyecto_etapas (
        proyecto_id, tutor_id, nombre, descripcion, numero_orden,
        permitir_entregas_fuera_tiempo, created_by, fecha_inicio, fecha_cierre
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      proyecto_id,
      user!.id,
      nombre,
      descripcion || null,
      numero_orden,
      permitir_entregas_fuera_tiempo || false,
      user!.id,
      fecha_inicio || null,
      fecha_cierre || null
    ]);

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

// PUT: Actualizar etapa (solo tutor y si está en borrador)
router.put('/:proyecto_id/etapas/:etapa_id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id } = req.params;
    const { nombre, descripcion, permitir_entregas_fuera_tiempo, fecha_inicio, fecha_cierre } = req.body;
    const user = req.user;

    // Verificar acceso
    const etapaRes = await pool.query(
      'SELECT tutor_id, estado FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2',
      [etapa_id, proyecto_id]
    );

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    if (etapaRes.rows[0].tutor_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'Solo el tutor puede editar' });
    }

    if (etapaRes.rows[0].estado !== 'borrador') {
      return res.status(400).json({ success: false, error: 'Solo se pueden editar etapas en borrador' });
    }

    // Actualizar
    const result = await pool.query(`
      UPDATE proyecto_etapas
      SET nombre = COALESCE($2, nombre),
          descripcion = COALESCE($3, descripcion),
          permitir_entregas_fuera_tiempo = COALESCE($4, permitir_entregas_fuera_tiempo),
          fecha_inicio = COALESCE($5, fecha_inicio),
          fecha_cierre = COALESCE($6, fecha_cierre),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [
      etapa_id,
      nombre || null,
      descripcion || null,
      permitir_entregas_fuera_tiempo,
      fecha_inicio || null,
      fecha_cierre || null
    ]);

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

// POST: Publicar etapa (cambiar estado a 'publicada')
router.post('/:proyecto_id/etapas/:etapa_id/publicar', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id } = req.params;
    const user = req.user;

    // Verificar acceso
    const etapaRes = await pool.query(
      'SELECT tutor_id, estado FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2',
      [etapa_id, proyecto_id]
    );

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    if (etapaRes.rows[0].tutor_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'Solo el tutor puede publicar' });
    }

    // Publicar
    const result = await pool.query(`
      UPDATE proyecto_etapas
      SET estado = 'publicada',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [etapa_id]);

    res.json({
      success: true,
      message: 'Etapa publicada exitosamente',
      etapa: result.rows[0]
    });
  } catch (error) {
    console.error('Error publishing etapa:', error);
    res.status(500).json({ success: false, error: 'Error al publicar etapa' });
  }
});

// PATCH: Actualizar estado de etapa (borrador/publicada/cerrada)
router.patch('/:proyecto_id/etapas/:etapa_id/estado', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id } = req.params;
    const { estado } = req.body;
    const user = req.user;

    const allowed = ['borrador', 'publicada', 'cerrada'];
    if (!allowed.includes(estado)) {
      return res.status(400).json({ success: false, error: 'Estado inválido' });
    }

    const etapaRes = await pool.query(
      'SELECT tutor_id, estado FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2',
      [etapa_id, proyecto_id]
    );

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    const isTutor = etapaRes.rows[0].tutor_id === user!.id;
    const admin = isAdmin(user);
    if (!isTutor && !admin) {
      return res.status(403).json({ success: false, error: 'Solo el tutor puede editar el estado' });
    }

    const estadoActual = etapaRes.rows[0].estado;
    const allowedTransitions: Record<string, string[]> = {
      borrador: ['borrador', 'publicada'],
      publicada: ['publicada', 'cerrada'],
      cerrada: ['cerrada']
    };

    if (!allowedTransitions[estadoActual]?.includes(estado)) {
      return res.status(400).json({
        success: false,
        error: `Transición no permitida de ${estadoActual} a ${estado}`
      });
    }

    const result = await pool.query(`
      UPDATE proyecto_etapas
      SET estado = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [etapa_id, estado]);

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      etapa: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating etapa estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar estado de etapa' });
  }
});

// DELETE: Eliminar etapa (solo si está en borrador)
router.delete('/:proyecto_id/etapas/:etapa_id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id } = req.params;
    const user = req.user;

    // Verificar acceso
    const etapaRes = await pool.query(
      'SELECT tutor_id, estado FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2',
      [etapa_id, proyecto_id]
    );

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    if (etapaRes.rows[0].tutor_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'Solo el tutor puede eliminar' });
    }

    if (etapaRes.rows[0].estado !== 'borrador') {
      return res.status(400).json({ success: false, error: 'Solo se pueden eliminar etapas en borrador' });
    }

    // Eliminar
    await pool.query('DELETE FROM proyecto_etapas WHERE id = $1', [etapa_id]);

    res.json({
      success: true,
      message: 'Etapa eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting etapa:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar etapa' });
  }
});

// ============================================
// PROYECTO TAREAS - Tareas dentro de etapas
// ============================================

// POST: Crear tarea en una etapa
router.post('/:proyecto_id/etapas/:etapa_id/tareas', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id } = req.params;
    const { nombre, descripcion, es_entregable, fecha_limite } = req.body;
    const user = req.user;

    if (!nombre) {
      return res.status(400).json({ success: false, error: 'El nombre de la tarea es requerido' });
    }

    // Verificar acceso: tutor de la etapa
    const etapaRes = await pool.query(
      'SELECT tutor_id FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2',
      [etapa_id, proyecto_id]
    );

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    let canManage = etapaRes.rows[0].tutor_id === user!.id;
    if (!canManage && isRevisor(user)) {
      const revCheck = await pool.query(
        'SELECT 1 FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2 LIMIT 1',
        [proyecto_id, user!.id]
      );
      canManage = revCheck.rows.length > 0;
    }
    const admin = isAdmin(user);
    if (!canManage && !admin) {
      return res.status(403).json({ success: false, error: 'Sin permiso' });
    }

    // Obtener siguiente número de orden
    const orderRes = await pool.query(
      'SELECT COALESCE(MAX(numero_orden), 0) + 1 as next_order FROM proyecto_tareas WHERE proyecto_etapa_id = $1',
      [etapa_id]
    );

    const numero_orden = orderRes.rows[0].next_order;

    // Crear tarea
    const result = await pool.query(`
      INSERT INTO proyecto_tareas (
        proyecto_etapa_id, nombre, descripcion, es_entregable, numero_orden, estado, fecha_limite
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [etapa_id, nombre, descripcion || null, es_entregable || false, numero_orden, 'activa', fecha_limite || null]);

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      tarea: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating tarea:', error);
    res.status(500).json({ success: false, error: 'Error al crear tarea' });
  }
});

// PUT: Actualizar tarea
router.put('/:proyecto_id/etapas/:etapa_id/tareas/:tarea_id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id, tarea_id } = req.params;
    const { nombre, descripcion, es_entregable } = req.body;
    const user = req.user;

    // Verificar acceso
    const etapaRes = await pool.query(
      'SELECT tutor_id FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2',
      [etapa_id, proyecto_id]
    );

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    let canManage = etapaRes.rows[0].tutor_id === user!.id;
    if (!canManage && isRevisor(user)) {
      const revCheck = await pool.query(
        'SELECT 1 FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2 LIMIT 1',
        [proyecto_id, user!.id]
      );
      canManage = revCheck.rows.length > 0;
    }
    const admin = isAdmin(user);
    if (!canManage && !admin) {
      return res.status(403).json({ success: false, error: 'Sin permiso' });
    }

    // Actualizar
    const result = await pool.query(`
      UPDATE proyecto_tareas
      SET nombre = COALESCE($2, nombre),
          descripcion = COALESCE($3, descripcion),
          es_entregable = COALESCE($4, es_entregable),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND proyecto_etapa_id = $5
      RETURNING *
    `, [tarea_id, nombre || null, descripcion || null, es_entregable, etapa_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

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
router.delete('/:proyecto_id/etapas/:etapa_id/tareas/:tarea_id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, etapa_id, tarea_id } = req.params;
    const user = req.user;

    // Verificar acceso
    const etapaRes = await pool.query(
      'SELECT tutor_id FROM proyecto_etapas WHERE id = $1 AND proyecto_id = $2',
      [etapa_id, proyecto_id]
    );

    if (etapaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }

    let canManage = etapaRes.rows[0].tutor_id === user!.id;
    if (!canManage && isRevisor(user)) {
      const revCheck = await pool.query(
        'SELECT 1 FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2 LIMIT 1',
        [proyecto_id, user!.id]
      );
      canManage = revCheck.rows.length > 0;
    }
    const admin = isAdmin(user);
    if (!canManage && !admin) {
      return res.status(403).json({ success: false, error: 'Sin permiso' });
    }

    // Eliminar
    await pool.query(
      'DELETE FROM proyecto_tareas WHERE id = $1 AND proyecto_etapa_id = $2',
      [tarea_id, etapa_id]
    );

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting tarea:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar tarea' });
  }
});

// ============================================
// VISTAS ESTUDIANTE - Ver tareas activas
// ============================================

// GET: Obtener etapas abiertas por proyecto para estudiante o tutor
router.get('/mis-etapas-abiertas', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = req.user;

    if (!isStudent(user) && !isTutor(user)) {
      return res.json({ success: true, proyectos: [], total: 0 });
    }

    let proyectosQuery = '';
    if (isStudent(user)) {
      proyectosQuery = `SELECT id, titulo FROM proyectos WHERE estudiante_id = $1`;
    } else {
      proyectosQuery = `
        SELECT DISTINCT p.id, p.titulo
        FROM proyectos p
        LEFT JOIN proyecto_etapas pe ON pe.proyecto_id = p.id
        WHERE p.tutor_id = $1 OR pe.tutor_id = $1
      `;
    }

    const proyectosRes = await pool.query(proyectosQuery, [user!.id]);
    const proyectos = proyectosRes.rows || [];

    if (proyectos.length === 0) {
      return res.json({ success: true, proyectos: [], total: 0 });
    }

    const proyectosIds = proyectos.map((p: any) => p.id);

    const etapasRes = await pool.query(`
      SELECT 
        pe.proyecto_id,
        pe.id as etapa_id,
        pe.nombre as etapa_nombre,
        pe.descripcion as etapa_descripcion,
        pe.numero_orden,
        pe.estado as etapa_estado,
        pe.fecha_inicio,
        pe.fecha_cierre,
        pe.fecha_publicacion,
        COUNT(pt.id) as total_tareas,
        COUNT(CASE WHEN pt.estado IN ('pendiente', 'activa') THEN 1 END) as tareas_abiertas
      FROM proyecto_etapas pe
      LEFT JOIN proyecto_tareas pt ON pe.id = pt.proyecto_etapa_id
      WHERE pe.proyecto_id = ANY($1::uuid[])
        AND ($2::boolean = true OR pe.estado <> 'borrador')
      GROUP BY pe.id
      ORDER BY pe.numero_orden ASC
    `, [proyectosIds, isTutor(user)]);

    const etapasPorProyecto: Record<string, any> = {};
    etapasRes.rows.forEach((row: any) => {
      if (!etapasPorProyecto[row.proyecto_id]) {
        etapasPorProyecto[row.proyecto_id] = [];
      }
      etapasPorProyecto[row.proyecto_id].push({
        id: row.etapa_id,
        nombre: row.etapa_nombre,
        descripcion: row.etapa_descripcion,
        numero_orden: row.numero_orden,
        estado: row.etapa_estado,
        fecha_inicio: row.fecha_inicio,
        fecha_cierre: row.fecha_cierre,
        fecha_publicacion: row.fecha_publicacion,
        total_tareas: Number(row.total_tareas) || 0,
        tareas_abiertas: Number(row.tareas_abiertas) || 0,
        tareas: []
      });
    });

    if (etapasRes.rows.length > 0) {
      const etapaIds = etapasRes.rows.map((r: any) => r.etapa_id);
      const tareasRes = await pool.query(`
        SELECT 
          pt.proyecto_etapa_id as etapa_id,
          pt.id as tarea_id,
          pt.nombre as tarea_nombre,
          pt.descripcion as tarea_descripcion,
          pt.estado as tarea_estado,
          pt.fecha_limite
        FROM proyecto_tareas pt
        WHERE pt.proyecto_etapa_id = ANY($1::uuid[])
        ORDER BY pt.numero_orden ASC
      `, [etapaIds]);

      const tareasPorEtapa: Record<string, any[]> = {};
      tareasRes.rows.forEach((row: any) => {
        if (!tareasPorEtapa[row.etapa_id]) {
          tareasPorEtapa[row.etapa_id] = [];
        }
        tareasPorEtapa[row.etapa_id].push({
          id: row.tarea_id,
          nombre: row.tarea_nombre,
          descripcion: row.tarea_descripcion,
          estado: row.tarea_estado,
          fecha_limite: row.fecha_limite
        });
      });

      Object.keys(etapasPorProyecto).forEach((proyectoId) => {
        etapasPorProyecto[proyectoId] = etapasPorProyecto[proyectoId].map((etapa: any) => ({
          ...etapa,
          tareas: tareasPorEtapa[etapa.id] || []
        }));
      });
    }

    const payload = proyectos.map((p: any) => ({
      proyecto_id: p.id,
      titulo: p.titulo,
      etapas: etapasPorProyecto[p.id] || []
    }));

    res.json({ success: true, proyectos: payload, total: payload.length });
  } catch (error) {
    console.error('Error fetching etapas abiertas por proyecto:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapas del proyecto' });
  }
});

// GET: Obtener tareas activas para un estudiante en un proyecto
router.get('/:proyecto_id/mis-tareas', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id } = req.params;
    const user = req.user;

    // Verificar que el usuario es estudiante del proyecto
    const proyectoRes = await pool.query(
      'SELECT estudiante_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    if (proyectoRes.rows[0].estudiante_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'No eres estudiante de este proyecto' });
    }

    // Obtener etapas publicadas con sus tareas activas
    const result = await pool.query(`
      SELECT 
        pe.id as etapa_id,
        pe.nombre as etapa_nombre,
        pe.descripcion as etapa_descripcion,
        pe.numero_orden,
        pe.permitir_entregas_fuera_tiempo,
        pe.fecha_inicio,
        pe.fecha_cierre,
        pe.fecha_publicacion,
        pt.id as tarea_id,
        pt.nombre as tarea_nombre,
        pt.descripcion as tarea_descripcion,
        pt.es_entregable,
        pt.numero_orden as tarea_orden,
        pt.estado as tarea_estado,
        pt.fecha_limite,
        COALESCE(ptc.estado, false) as completada,
        pe.id::text as etapa_id_str,
        pe.numero_orden::text as numero_orden_str,
        CASE 
          WHEN pe.fecha_inicio IS NOT NULL AND pe.fecha_inicio > CURRENT_TIMESTAMP THEN 'no_iniciada'
          WHEN pe.fecha_cierre IS NOT NULL AND pe.fecha_cierre < CURRENT_TIMESTAMP THEN 'cerrada'
          WHEN pe.estado = 'publicada' OR (pe.estado = 'activa' AND pe.fecha_inicio <= CURRENT_TIMESTAMP) THEN 'activa'
          ELSE 'inactiva'
        END as etapa_status,
        CASE 
          WHEN pt.fecha_limite IS NOT NULL AND pt.fecha_limite < CURRENT_TIMESTAMP THEN 'cerrada'
          WHEN pt.estado = 'activa' OR pt.estado = 'pendiente' THEN 'activa'
          ELSE 'inactiva'
        END as tarea_status
      FROM proyecto_etapas pe
      LEFT JOIN proyecto_tareas pt ON pe.id = pt.proyecto_etapa_id
      LEFT JOIN proyecto_tareas_completadas ptc ON pt.id = ptc.proyecto_tarea_id 
        AND ptc.estudiante_id = $2
      WHERE pe.proyecto_id = $1 
      ORDER BY pe.numero_orden ASC, pt.numero_orden ASC
    `, [proyecto_id, user!.id]);

    // Agrupar por etapas
    const etapasMap: Record<string, any> = {};
    
    for (const row of result.rows) {
      if (!etapasMap[row.etapa_id]) {
        etapasMap[row.etapa_id] = {
          id: row.etapa_id,
          nombre: row.etapa_nombre,
          descripcion: row.etapa_descripcion,
          numero_orden: row.numero_orden,
          estado: row.etapa_estado,
          fecha_inicio: row.fecha_inicio,
          fecha_cierre: row.fecha_cierre,
          fecha_publicacion: row.fecha_publicacion,
          permitir_entregas_fuera_tiempo: row.permitir_entregas_fuera_tiempo,
          tareas: []
        };
      }

      if (row.tarea_id) {
        etapasMap[row.etapa_id].tareas.push({
          id: row.tarea_id,
          nombre: row.tarea_nombre,
          descripcion: row.tarea_descripcion,
          es_entregable: row.es_entregable,
          numero_orden: row.tarea_orden,
          estado: row.tarea_estado,
          fecha_limite: row.fecha_limite,
          tarea_status: row.tarea_status,
          completada: row.completada
        });
      }
    }

    const etapas = Object.values(etapasMap);

    res.json({
      success: true,
      etapas,
      total: etapas.length
    });
  } catch (error) {
    console.error('Error fetching mis-tareas:', error);
    res.status(500).json({ success: false, error: 'Error al obtener tareas' });
  }
});

// POST: Marcar tarea no entregable como completada
router.post('/:proyecto_id/tareas/:tarea_id/completar', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, tarea_id } = req.params;
    const user = req.user;

    // Verificar acceso
    const proyectoRes = await pool.query(
      'SELECT estudiante_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    if (proyectoRes.rows[0].estudiante_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'No autorizado' });
    }

    // Verificar que la tarea existe y no es entregable
    const tareaRes = await pool.query(`
      SELECT pt.es_entregable
      FROM proyecto_tareas pt
      JOIN proyecto_etapas pe ON pt.proyecto_etapa_id = pe.id
      WHERE pt.id = $1 AND pe.proyecto_id = $2
    `, [tarea_id, proyecto_id]);

    if (tareaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    if (tareaRes.rows[0].es_entregable) {
      return res.status(400).json({ success: false, error: 'Esta tarea requiere un archivo' });
    }

    // Insertar o actualizar completación
    const result = await pool.query(`
      INSERT INTO proyecto_tareas_completadas (proyecto_tarea_id, estudiante_id, estado, fecha_completacion)
      VALUES ($1, $2, true, CURRENT_TIMESTAMP)
      ON CONFLICT (proyecto_tarea_id, estudiante_id)
      DO UPDATE SET estado = true, fecha_completacion = CURRENT_TIMESTAMP
      RETURNING *
    `, [tarea_id, user!.id]);

    res.json({
      success: true,
      message: 'Tarea marcada como completada',
      completacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error completing tarea:', error);
    res.status(500).json({ success: false, error: 'Error al completar tarea' });
  }
});

// POST: Desmarcar tarea como completada
router.post('/:proyecto_id/tareas/:tarea_id/descompletar', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, tarea_id } = req.params;
    const user = req.user;

    // Verificar acceso
    const proyectoRes = await pool.query(
      'SELECT estudiante_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    if (proyectoRes.rows[0].estudiante_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'No autorizado' });
    }

    // Actualizar estado a false
    await pool.query(`
      UPDATE proyecto_tareas_completadas
      SET estado = false
      WHERE proyecto_tarea_id = $1 AND estudiante_id = $2
    `, [tarea_id, user!.id]);

    res.json({
      success: true,
      message: 'Tarea desmarcada como completada'
    });
  } catch (error) {
    console.error('Error uncompleting tarea:', error);
    res.status(500).json({ success: false, error: 'Error al descompletar tarea' });
  }
});

// POST: Entregar archivo para tarea entregable
router.post('/:proyecto_id/tareas/:tarea_id/entregar', authenticate, upload.single('archivo'), async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, tarea_id } = req.params;
    const { observaciones } = req.body;
    const user = req.user;
    const archivoUrl = req.file?.path ? req.file.path.replace(/\\/g, '/') : null;

    if (!archivoUrl) {
      return res.status(400).json({ success: false, error: 'El archivo es requerido' });
    }

    // Verificar acceso
    const proyectoRes = await pool.query(
      'SELECT estudiante_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    if (proyectoRes.rows[0].estudiante_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'No autorizado' });
    }

    // Verificar que la tarea es entregable
    const tareaRes = await pool.query(`
      SELECT pt.es_entregable
      FROM proyecto_tareas pt
      JOIN proyecto_etapas pe ON pt.proyecto_etapa_id = pe.id
      WHERE pt.id = $1 AND pe.proyecto_id = $2
    `, [tarea_id, proyecto_id]);

    if (tareaRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    if (!tareaRes.rows[0].es_entregable) {
      return res.status(400).json({ success: false, error: 'Esta tarea no requiere entrega' });
    }

    // Insertar entrega
    const result = await pool.query(`
      INSERT INTO proyecto_entregas (
        proyecto_tarea_id, proyecto_id, estudiante_id, 
        archivo_url, observaciones, fecha_entrega
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *
    `, [tarea_id, proyecto_id, user!.id, archivoUrl, observaciones || null]);

    res.status(201).json({
      success: true,
      message: 'Entrega registrada exitosamente',
      entrega: result.rows[0]
    });
  } catch (error) {
    console.error('Error delivering tarea:', error);
    res.status(500).json({ success: false, error: 'Error al entregar tarea' });
  }
});

// GET: Obtener entrega de una tarea entregable
router.get('/:proyecto_id/tareas/:tarea_id/entrega', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyecto_id, tarea_id } = req.params;
    const user = req.user;

    // Verificar acceso
    const proyectoRes = await pool.query(
      'SELECT estudiante_id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );

    if (proyectoRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }

    if (proyectoRes.rows[0].estudiante_id !== user!.id) {
      return res.status(403).json({ success: false, error: 'No autorizado' });
    }

    // Obtener entrega más reciente
    const result = await pool.query(`
      SELECT * FROM proyecto_entregas
      WHERE proyecto_tarea_id = $1 AND estudiante_id = $2 AND proyecto_id = $3
      ORDER BY fecha_entrega DESC
      LIMIT 1
    `, [tarea_id, user!.id, proyecto_id]);

    res.json({
      success: true,
      entrega: result.rows.length > 0 ? result.rows[0] : null
    });
  } catch (error) {
    console.error('Error fetching entrega:', error);
    res.status(500).json({ success: false, error: 'Error al obtener entrega' });
  }
});

export default router;

