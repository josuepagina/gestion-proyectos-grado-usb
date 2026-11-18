import express from 'express';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import multer from 'multer';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

const router = express.Router();

const isStudent = (user: AuthRequest['user']) => user?.rol === 'estudiante';
const isTutor = (user: AuthRequest['user']) => !!user && (user.es_tutor || user.rol === 'tutor');
const isRevisor = (user: AuthRequest['user']) => !!user && (user.es_revisor || user.rol === 'revisor');

// Configure multer for file uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  },
});

const entregaSchema = z.object({
  proyecto_id: z.string().uuid(),
  etapa: z.string(), // puede ser código, nombre libre o id (UUID)
});

// Get all entregas for a project
router.get('/proyecto/:proyectoId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyectoId } = req.params;

    // Verify access
    const project = await pool.query(
      'SELECT estudiante_id, tutor_id FROM proyectos WHERE id = $1',
      [proyectoId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const proj = project.rows[0];

    // Check permissions
    if (isStudent(req.user) && proj.estudiante_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const isTutorOwner = proj.tutor_id === req.user!.id;
    if (isTutor(req.user) && !isRevisor(req.user) && !isTutorOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // For revisores: check if assigned and filter only version_final
    if (isRevisor(req.user) && !isTutorOwner) {
      const revisorCheck = await pool.query(
        'SELECT id FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2',
        [proyectoId, req.user!.id]
      );

      if (revisorCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Forbidden: Reviewer not assigned to this project' });
      }
    }

    // Build query with filters
    let whereClause = 'e.proyecto_id = $1';
    const params: any[] = [proyectoId];

    // Revisores solo ven entregas de version_final
    if (isRevisor(req.user) && !isTutorOwner) {
      whereClause += ' AND e.etapa = $2';
      params.push('version_final');
    }

    const result = await pool.query(
      `SELECT e.*, 
              COALESCE(e.estado_tutor, e.estado_revision) as estado_tutor,
              e.estado_revisor,
              COUNT(DISTINCT o.id) as total_observaciones,
              COUNT(DISTINCT CASE WHEN o.estado_resuelto = false THEN o.id END) as observaciones_pendientes
       FROM entregas e
       LEFT JOIN observaciones o ON e.id = o.entrega_id
       WHERE ${whereClause}
       GROUP BY e.id
       ORDER BY e.fecha_subida DESC`,
      params
    );

    // Obtener también entregas de proyecto_entregas (por tarea)
    const proyectoEntregasRes = await pool.query(`
      SELECT 
        pe.id,
        pe.proyecto_id,
        pe.estudiante_id,
        pe.archivo_url,
        pe.observaciones,
        pe.fecha_entrega as fecha_subida,
        pe.estado_tutor,
        pe.estado_revisor,
        pt.nombre as tarea_nombre,
        pet.nombre as etapa_nombre,
        pet.numero_orden,
        pt.numero_orden as tarea_orden,
        COUNT(DISTINCT o.id) as total_observaciones,
        COUNT(DISTINCT CASE WHEN o.estado_resuelto = false THEN o.id END) as observaciones_pendientes
      FROM proyecto_entregas pe
      JOIN proyecto_tareas pt ON pe.proyecto_tarea_id = pt.id
      JOIN proyecto_etapas pet ON pt.proyecto_etapa_id = pet.id
      LEFT JOIN observaciones o ON pe.id = o.proyecto_entrega_id
      WHERE pe.proyecto_id = $1
      GROUP BY pe.id, pt.nombre, pet.nombre, pet.numero_orden, pt.numero_orden
      ORDER BY pe.fecha_entrega DESC
    `, [proyectoId]);

    // Enriquecer entregas con información de etapas (por separado)
    const enrichedEntregas = await Promise.all(
      result.rows.map(async (entrega: any) => {
        try {
          // Buscar la etapa por id, nombre o codigo
          const etapaRes = await pool.query(
            `SELECT 
              id as etapa_id,
              nombre as etapa_nombre,
              estado as etapa_estado,
              COALESCE((SELECT fecha_apertura_proyecto FROM etapa_proyecto WHERE etapa_id = etapas.id AND proyecto_id = $2), fecha_apertura) as fecha_apertura_efectiva,
              COALESCE((SELECT fecha_cierre_proyecto FROM etapa_proyecto WHERE etapa_id = etapas.id AND proyecto_id = $2), fecha_cierre) as fecha_cierre_efectiva,
              COALESCE((SELECT fecha_limite_entrega_proyecto FROM etapa_proyecto WHERE etapa_id = etapas.id AND proyecto_id = $2), fecha_limite_entrega) as fecha_limite_efectiva
             FROM etapas
             WHERE (id::text = $1 OR LOWER(nombre) = LOWER($1) OR (codigo IS NOT NULL AND LOWER(codigo) = LOWER($1)))
             LIMIT 1`,
            [entrega.etapa, proyectoId]
          );

          return {
            ...entrega,
            etapa_id: etapaRes.rows[0]?.etapa_id || null,
            etapa_nombre: etapaRes.rows[0]?.etapa_nombre || null,
            etapa_estado: etapaRes.rows[0]?.etapa_estado || null,
            fecha_apertura_efectiva: etapaRes.rows[0]?.fecha_apertura_efectiva || null,
            fecha_cierre_efectiva: etapaRes.rows[0]?.fecha_cierre_efectiva || null,
            fecha_limite_efectiva: etapaRes.rows[0]?.fecha_limite_efectiva || null
          };
        } catch (err) {
          console.error('Error enriching entrega with etapa info:', err);
          return entrega;
        }
      })
    );

    // Mapear entregas por tarea al formato compatible con la UI
    const proyectoEntregasMapped = proyectoEntregasRes.rows.map((pe: any) => ({
      id: pe.id,
      proyecto_id: pe.proyecto_id,
      estudiante_id: pe.estudiante_id,
      archivo_url: pe.archivo_url,
      fecha_subida: pe.fecha_subida,
      etapa: pe.etapa_nombre,
      etapa_nombre: pe.etapa_nombre,
      tarea_nombre: pe.tarea_nombre,
      observaciones: pe.observaciones,
      estado_tutor: pe.estado_tutor,
      estado_revisor: pe.estado_revisor,
      total_observaciones: parseInt(pe.total_observaciones) || 0,
      observaciones_pendientes: parseInt(pe.observaciones_pendientes) || 0,
      tipo_entrega: 'tarea',
      numero_orden: pe.numero_orden,
      tarea_orden: pe.tarea_orden
    }));

    // Combinar ambas listas y ordenar por fecha
    const todasLasEntregas = [...enrichedEntregas, ...proyectoEntregasMapped]
      .sort((a, b) => new Date(b.fecha_subida).getTime() - new Date(a.fecha_subida).getTime());

    res.json({ entregas: todasLasEntregas });
  } catch (error) {
    console.error('Error fetching entregas:', error);
    res.status(500).json({ error: 'Failed to fetch entregas' });
  }
});

// Get available stages for a project (for upload form)
router.get('/proyecto/:proyectoId/etapas-disponibles', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyectoId } = req.params;
    console.log('[DEBUG] /entregas/proyecto/:proyectoId/etapas-disponibles called, user=', req.user?.id, 'proyectoId=', proyectoId);

    // Verify project exists
    const project = await pool.query(
      'SELECT id FROM proyectos WHERE id = $1',
      [proyectoId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Mapeo de etapas del sistema a nombres en BD
    const etapaMap = [
      { etapa: 'anteproyecto', nombre_bd: 'anteproyecto' },
      { etapa: 'entrega_parcial_1', nombre_bd: 'entrega parcial 1' },
      { etapa: 'entrega_parcial_2', nombre_bd: 'entrega parcial 2' },
      { etapa: 'entrega_parcial_3', nombre_bd: 'entrega parcial 3' },
      { etapa: 'version_final', nombre_bd: 'versión final' },
    ];

    // Obtener todas las etapas del sistema
    // Las etapas estarán disponibles para cualquier proyecto (sin necesidad de asignarlas en etapa_proyecto)
    const result = await pool.query(`
      SELECT 
        e.id,
        e.nombre,
        e.estado,
        e.numero_orden,
        e.fecha_apertura,
        e.fecha_cierre,
        e.fecha_limite_entrega,
        COALESCE((SELECT fecha_apertura_proyecto FROM etapa_proyecto WHERE etapa_id = e.id AND proyecto_id = $1), e.fecha_apertura) as fecha_apertura_efectiva,
        COALESCE((SELECT fecha_cierre_proyecto FROM etapa_proyecto WHERE etapa_id = e.id AND proyecto_id = $1), e.fecha_cierre) as fecha_cierre_efectiva,
        COALESCE((SELECT fecha_limite_entrega_proyecto FROM etapa_proyecto WHERE etapa_id = e.id AND proyecto_id = $1), e.fecha_limite_entrega) as fecha_limite_efectiva
      FROM etapas e
      ORDER BY COALESCE(e.numero_orden, 999) ASC, e.fecha_apertura ASC
    `, [proyectoId]);

    console.log('[ETAPAS DISPONIBLES] Found', result.rows.length, 'stages for project', proyectoId);

    // Mapear todas las etapas encontradas a la respuesta, aceptando nombres libres
    const etapasDisponibles = result.rows.map((r: any) => {
      const ahoraFecha = new Date();
      // Usar las fechas efectivas (que consideran sobrescrituras por proyecto)
      const estaAbierta =
        r.estado === 'abierta' &&
        (!r.fecha_apertura_efectiva || new Date(r.fecha_apertura_efectiva) <= ahoraFecha) &&
        (!r.fecha_cierre_efectiva || new Date(r.fecha_cierre_efectiva) >= ahoraFecha);

      console.log(`  [ETAPA] ${r.nombre}: estado=${r.estado}, abierta=${estaAbierta}`);

      return {
        id: r.id,
        nombre: r.nombre,
        abierta: estaAbierta,
        estado: r.estado,
        fecha_apertura: r.fecha_apertura_efectiva,
        fecha_cierre: r.fecha_cierre_efectiva,
        fecha_limite: r.fecha_limite_efectiva
      };
    });

    res.json({ etapas: etapasDisponibles });
  } catch (error) {
    console.error('Error fetching available stages:', error);
    res.status(500).json({ error: 'Failed to fetch available stages' });
  }
});

// Get single entrega
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT e.*, 
              COALESCE(e.estado_tutor, e.estado_revision) as estado_tutor,
              e.estado_revisor,
              p.estudiante_id, p.tutor_id
       FROM entregas e
       JOIN proyectos p ON e.proyecto_id = p.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega not found' });
    }

    const entrega = result.rows[0];

    // Check permissions
    if (isStudent(req.user) && entrega.estudiante_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const isTutorOwner = entrega.tutor_id === req.user!.id;
    if (isTutor(req.user) && !isRevisor(req.user) && !isTutorOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // For revisores: check if assigned and only allow version_final
    if (isRevisor(req.user) && !isTutorOwner) {
      const revisorCheck = await pool.query(
        'SELECT id FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2',
        [entrega.proyecto_id, req.user!.id]
      );

      if (revisorCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Forbidden: Reviewer not assigned to this project' });
      }

      if (entrega.etapa !== 'version_final') {
        return res.status(403).json({ error: 'Reviewers can only access version_final deliveries' });
      }
    }

    res.json({ entrega });
  } catch (error) {
    console.error('Error fetching entrega:', error);
    res.status(500).json({ error: 'Failed to fetch entrega' });
  }
});

// Upload entrega (only students)
router.post('/', authenticate, authorize('estudiante'), upload.single('archivo'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const data = entregaSchema.parse(req.body);

    // Verify project ownership
    const project = await pool.query(
      'SELECT estudiante_id FROM proyectos WHERE id = $1',
      [data.proyecto_id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.rows[0].estudiante_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // ========== VALIDAR ESTADO DE LA ETAPA ==========
    // data.etapa puede ser: id (UUID) de la etapa o nombre libre
    const etapaValor = data.etapa;
    let etapaQueryText = '';
    let etapaParams: any[] = [];

    // Determinar si es UUID
    const { success: isUuid } = z.string().uuid().safeParse(etapaValor);

    if (isUuid) {
      etapaQueryText = `SELECT e.*, 
              COALESCE(ep.fecha_apertura_proyecto, e.fecha_apertura) as fecha_apertura_efectiva,
              COALESCE(ep.fecha_cierre_proyecto, e.fecha_cierre) as fecha_cierre_efectiva,
              COALESCE(ep.fecha_limite_entrega_proyecto, e.fecha_limite_entrega) as fecha_limite_efectiva
       FROM etapas e
       LEFT JOIN etapa_proyecto ep ON e.id = ep.etapa_id AND ep.proyecto_id = $1
       WHERE e.id = $2`;
      etapaParams = [data.proyecto_id, etapaValor];
    } else {
      // Buscar por nombre exacto (case-insensitive)
      etapaQueryText = `SELECT e.*, 
              COALESCE(ep.fecha_apertura_proyecto, e.fecha_apertura) as fecha_apertura_efectiva,
              COALESCE(ep.fecha_cierre_proyecto, e.fecha_cierre) as fecha_cierre_efectiva,
              COALESCE(ep.fecha_limite_entrega_proyecto, e.fecha_limite_entrega) as fecha_limite_efectiva
       FROM etapas e
       LEFT JOIN etapa_proyecto ep ON e.id = ep.etapa_id AND ep.proyecto_id = $1
       WHERE LOWER(e.nombre) = LOWER($2)`;
      etapaParams = [data.proyecto_id, etapaValor];
    }

    const etapaQuery = await pool.query(etapaQueryText, etapaParams);

    if (etapaQuery.rows.length === 0) {
      return res.status(400).json({ error: 'Etapa no encontrada para la entrega' });
    }

    const etapa = etapaQuery.rows[0];

    // Verificar que la etapa esté abierta
    if (etapa.estado !== 'abierta') {
        return res.status(400).json({
          error: `La etapa "${etapa.nombre}" no está abierta para entregas (estado actual: ${etapa.estado})`,
          etapa_estado: etapa.estado
        });
      }

      // Verificar fechas
      const ahora = new Date();

      if (etapa.fecha_apertura_efectiva && new Date(etapa.fecha_apertura_efectiva) > ahora) {
        return res.status(400).json({
          error: `La etapa "${etapa.nombre}" aún no se ha abierto. Apertura: ${new Date(etapa.fecha_apertura_efectiva).toLocaleString('es-BO')}`
        });
      }

      if (etapa.fecha_cierre_efectiva && new Date(etapa.fecha_cierre_efectiva) < ahora) {
        return res.status(400).json({
          error: `La etapa "${etapa.nombre}" ya ha sido cerrada. Cierre: ${new Date(etapa.fecha_cierre_efectiva).toLocaleString('es-BO')}`
        });
      }

      // Verificar límite de entrega
      if (etapa.fecha_limite_efectiva && new Date(etapa.fecha_limite_efectiva) < ahora) {
        if (!etapa.permitir_entregas_fuera_tiempo) {
          return res.status(400).json({
            error: `Se ha excedido el límite de entrega para la etapa "${etapa.nombre}". Límite: ${new Date(etapa.fecha_limite_efectiva).toLocaleString('es-BO')}`,
            fuera_de_tiempo: true
          });
        }
        // Si permite entregas fuera de tiempo, continuar pero registrar en la entrega
      }

    // Usar el nombre de la etapa para guardar (no el UUID o valor enviado)
    const etapaNombreGuardar = etapa.nombre;

    // Get next version number
    const versionResult = await pool.query(
      `SELECT COALESCE(MAX(version), 0) + 1 as next_version
       FROM entregas
       WHERE proyecto_id = $1 AND etapa = $2`,
      [data.proyecto_id, etapaNombreGuardar]
    );

    const version = versionResult.rows[0].next_version;

    // Get previous version for comparison
    const previousVersion = version - 1;
    let cambiosDetectados: any = null;
    let versionAnteriorId: string | null = null;

    if (previousVersion > 0) {
      const prevVersionResult = await pool.query(
        `SELECT id, archivo_url, archivo_nombre 
         FROM entregas 
         WHERE proyecto_id = $1 AND etapa = $2 AND version = $3`,
        [data.proyecto_id, data.etapa, previousVersion]
      );

      if (prevVersionResult.rows.length > 0) {
        versionAnteriorId = prevVersionResult.rows[0].id;
        const prevFile = prevVersionResult.rows[0];
        
        // Basic comparison: file size and name
        const currentFilePath = join(process.cwd(), uploadDir, req.file.filename);
        const currentFileStats = statSync(currentFilePath);
        
        cambiosDetectados = {
          nombre_archivo_cambio: prevFile.archivo_nombre !== req.file.originalname,
          nombre_anterior: prevFile.archivo_nombre,
          nombre_actual: req.file.originalname,
          tamano_anterior: null, // Would need to read previous file
          tamano_actual: currentFileStats.size,
          version_anterior: previousVersion,
          version_actual: version,
        };
      }
    }

    const result = await pool.query(
      `INSERT INTO entregas (proyecto_id, etapa, archivo_url, archivo_nombre, version)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.proyecto_id,
        etapaNombreGuardar,
        `/uploads/${req.file.filename}`,
        req.file.originalname,
        version,
      ]
    );

    // Create bitacora entry
    await pool.query(
      `INSERT INTO bitacoras (entrega_id, usuario_id, accion, descripcion, cambios_detectados, version_anterior, version_actual)
       VALUES ($1, $2, 'subida', $3, $4, $5, $6)`,
      [
        result.rows[0].id,
        req.user!.id,
        `Nueva versión ${version} subida para etapa ${etapaNombreGuardar}`,
        cambiosDetectados ? JSON.stringify(cambiosDetectados) : null,
        previousVersion > 0 ? previousVersion : null,
        version,
      ]
    );

    // Transición automática de estado: Si es la primera entrega, cambiar a 'en_proceso'
    const proyectoEstado = await pool.query(
      'SELECT estado FROM proyectos WHERE id = $1',
      [data.proyecto_id]
    );

    if (proyectoEstado.rows.length > 0 && proyectoEstado.rows[0].estado === 'registrado') {
      await pool.query(
        `UPDATE proyectos SET estado = 'en_proceso', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [data.proyecto_id]
      );
    }

    res.status(201).json({ entrega: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating entrega:', error);
    res.status(500).json({ error: 'Failed to create entrega' });
  }
});

// Update entrega status (tutor/revisor/admin)
router.put('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { estado_revision } = z.object({
      estado_revision: z.enum(['pendiente', 'en_revision', 'observado', 'aprobado', 'rechazado']),
    }).parse(req.body);

    // Verify access
    const entrega = await pool.query(
      `SELECT e.*, p.estudiante_id, p.tutor_id
       FROM entregas e
       JOIN proyectos p ON e.proyecto_id = p.id
       WHERE e.id = $1`,
      [id]
    );

    if (entrega.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega not found' });
    }

    const ent = entrega.rows[0];

    // Check permissions
    if (isStudent(req.user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const isTutorOwner = ent.tutor_id === req.user!.id;
    if (isTutor(req.user) && !isRevisor(req.user) && !isTutorOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // For revisores: check if assigned and only allow for version_final
    let isAssignedReviewer = false;
    if (isRevisor(req.user) && !isTutorOwner) {
      const revisorCheck = await pool.query(
        'SELECT id FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2',
        [ent.proyecto_id, req.user!.id]
      );

      isAssignedReviewer = revisorCheck.rows.length > 0;
      if (!isAssignedReviewer) {
        return res.status(403).json({ error: 'Forbidden: Reviewer not assigned to this project' });
      }

      if (ent.etapa !== 'version_final') {
        return res.status(403).json({ error: 'Reviewers can only review version_final deliveries' });
      }
    }

    // Update status based on role
    let updateQuery = '';
    let updateParams: any[] = [];

    const actingAsTutor = isTutorOwner;
    const actingAsRevisor = !actingAsTutor && isAssignedReviewer;

    if (actingAsTutor) {
      // Tutor updates estado_tutor and estado_revision (for compatibility)
      updateQuery = `UPDATE entregas 
                     SET estado_tutor = $1, estado_revision = $1 
                     WHERE id = $2 
                     RETURNING *, COALESCE(estado_tutor, estado_revision) as estado_tutor, estado_revisor`;
      updateParams = [estado_revision, id];
    } else if (actingAsRevisor) {
      // Revisor updates estado_revisor
      updateQuery = `UPDATE entregas 
                     SET estado_revisor = $1 
                     WHERE id = $2 
                     RETURNING *, COALESCE(estado_tutor, estado_revision) as estado_tutor, estado_revisor`;
      updateParams = [estado_revision, id];
    } else {
      // Admin can update both
      updateQuery = `UPDATE entregas 
                     SET estado_tutor = COALESCE(estado_tutor, estado_revision), 
                         estado_revision = COALESCE(estado_tutor, estado_revision)
                     WHERE id = $1 
                     RETURNING *, COALESCE(estado_tutor, estado_revision) as estado_tutor, estado_revisor`;
      updateParams = [id];
    }

    const result = await pool.query(updateQuery, updateParams);

    // Transiciones automáticas de estado del proyecto (solo para tutor)
    if (actingAsTutor) {
      if (estado_revision === 'observado' || estado_revision === 'rechazado') {
        // Si hay observaciones o rechazo, cambiar proyecto a 'correcciones'
        await pool.query(
          `UPDATE proyectos SET estado = 'correcciones', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND estado NOT IN ('aprobado', 'sustentado', 'rechazado')`,
          [ent.proyecto_id]
        );
      } else if (estado_revision === 'en_revision') {
        // Si está en revisión, cambiar proyecto a 'en_revision'
        await pool.query(
          `UPDATE proyectos SET estado = 'en_revision', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND estado NOT IN ('aprobado', 'sustentado', 'rechazado', 'completado')`,
          [ent.proyecto_id]
        );
      }
    }

    // Create notification
    const rolText = actingAsTutor ? 'tutor' : actingAsRevisor ? 'revisor' : 'administrador';
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
       VALUES ($1, 
               CASE WHEN $2 = 'aprobado' THEN 'entrega_aprobada' ELSE 'entrega_rechazada' END,
               CASE WHEN $2 = 'aprobado' THEN 'Tu entrega ha sido aprobada por el ' || $4 ELSE 'Tu entrega requiere correcciones según el ' || $4 END,
               $3, 'entrega')`,
      [ent.estudiante_id, estado_revision, id, rolText]
    );

    res.json({ entrega: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error updating entrega status:', error);
    res.status(500).json({ error: 'Failed to update entrega status' });
  }
});

// Get open stages for the authenticated student's projects
router.get('/mis-proyectos/etapas-abiertas', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Obtener proyectos del estudiante
    const projsRes = await pool.query('SELECT id, titulo FROM proyectos WHERE estudiante_id = $1', [userId]);
    const proyectos = projsRes.rows || [];

    const etapaMap = [
      { etapa: 'anteproyecto', nombre_bd: 'anteproyecto' },
      { etapa: 'entrega_parcial_1', nombre_bd: 'entrega parcial 1' },
      { etapa: 'entrega_parcial_2', nombre_bd: 'entrega parcial 2' },
      { etapa: 'entrega_parcial_3', nombre_bd: 'entrega parcial 3' },
      { etapa: 'version_final', nombre_bd: 'versión final' },
    ];

    const results: any[] = [];

    for (const p of proyectos) {
      const etapasRes = await pool.query(`
        SELECT 
          e.id,
          LOWER(e.nombre) as nombre_etapa,
          e.estado,
          COALESCE(ep.fecha_apertura_proyecto, e.fecha_apertura) as fecha_apertura,
          COALESCE(ep.fecha_cierre_proyecto, e.fecha_cierre) as fecha_cierre,
          COALESCE(ep.fecha_limite_entrega_proyecto, e.fecha_limite_entrega) as fecha_limite,
          e.permitir_entregas_fuera_tiempo
        FROM etapas e
        LEFT JOIN etapa_proyecto ep ON e.id = ep.etapa_id AND ep.proyecto_id = $1
        ORDER BY e.fecha_apertura ASC
      `, [p.id]);

      const etapasDisponibles = etapaMap.map(map => {
        const etapa = etapasRes.rows.find((r: any) => {
          if (r.codigo && r.codigo.trim().toLowerCase() === map.etapa.trim().toLowerCase()) return true;
          return r.nombre_etapa && r.nombre_etapa.trim().toLowerCase() === map.nombre_bd.trim().toLowerCase();
        });
        if (!etapa) {
          return { etapa: map.etapa, nombre: map.nombre_bd, abierta: false, estado: 'no_configurada' };
        }

        const ahora = new Date();
        const estaAbierta = 
          etapa.estado === 'abierta' &&
          (!etapa.fecha_apertura || new Date(etapa.fecha_apertura) <= ahora) &&
          (!etapa.fecha_cierre || new Date(etapa.fecha_cierre) >= ahora);

        return {
          etapa: map.etapa,
          nombre: etapa.nombre_etapa,
          codigo: etapa.codigo || null,
          abierta: estaAbierta,
          estado: etapa.estado,
          fecha_apertura: etapa.fecha_apertura,
          fecha_cierre: etapa.fecha_cierre,
          fecha_limite: etapa.fecha_limite,
          permitir_entregas_fuera_tiempo: etapa.permitir_entregas_fuera_tiempo
        };
      });

      const abiertas = etapasDisponibles.filter((e: any) => e.abierta);
      if (abiertas.length > 0) {
        results.push({ proyecto_id: p.id, titulo: p.titulo, etapas: abiertas });
      }
    }

    res.json({ proyectos: results });
  } catch (error) {
    console.error('Error fetching open stages for student projects:', error);
    res.status(500).json({ error: 'Failed to fetch open stages' });
  }
});

// Update status for task-based entrega (proyecto_entregas)
router.put('/tarea/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { estado_revision } = z.object({
      estado_revision: z.enum(['pendiente', 'en_revision', 'observado', 'aprobado', 'rechazado']),
    }).parse(req.body);

    // Verify access
    const entrega = await pool.query(
      `SELECT pe.*, p.estudiante_id, p.tutor_id
       FROM proyecto_entregas pe
       JOIN proyectos p ON pe.proyecto_id = p.id
       WHERE pe.id = $1`,
      [id]
    );

    if (entrega.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega not found' });
    }

    const ent = entrega.rows[0];

    // Check permissions
    if (isStudent(req.user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const isTutorOwner = ent.tutor_id === req.user!.id;
    if (isTutor(req.user) && !isRevisor(req.user) && !isTutorOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // For revisores: check if assigned
    let isAssignedReviewer = false;
    if (isRevisor(req.user) && !isTutorOwner) {
      const revisorCheck = await pool.query(
        'SELECT id FROM proyecto_revisores WHERE proyecto_id = $1 AND revisor_id = $2',
        [ent.proyecto_id, req.user!.id]
      );

      isAssignedReviewer = revisorCheck.rows.length > 0;
      if (!isAssignedReviewer) {
        return res.status(403).json({ error: 'Forbidden: Reviewer not assigned to this project' });
      }
    }

    // Update status based on role
    let updateQuery = '';
    let updateParams: any[] = [];

    const actingAsTutor = isTutorOwner;
    const actingAsRevisor = !actingAsTutor && isAssignedReviewer;

    if (actingAsTutor) {
      // Tutor updates estado_tutor
      updateQuery = `UPDATE proyecto_entregas 
                     SET estado_tutor = $1, updated_at = CURRENT_TIMESTAMP
                     WHERE id = $2 
                     RETURNING *`;
      updateParams = [estado_revision, id];
    } else if (actingAsRevisor) {
      // Revisor updates estado_revisor
      updateQuery = `UPDATE proyecto_entregas 
                     SET estado_revisor = $1, updated_at = CURRENT_TIMESTAMP
                     WHERE id = $2 
                     RETURNING *`;
      updateParams = [estado_revision, id];
    } else {
      // Admin can update tutor estado
      updateQuery = `UPDATE proyecto_entregas 
                     SET estado_tutor = $1, updated_at = CURRENT_TIMESTAMP
                     WHERE id = $2 
                     RETURNING *`;
      updateParams = [estado_revision, id];
    }

    const result = await pool.query(updateQuery, updateParams);

    // Transiciones automáticas de estado del proyecto (solo para tutor)
    if (actingAsTutor) {
      if (estado_revision === 'observado' || estado_revision === 'rechazado') {
        // Si hay observaciones o rechazo, cambiar proyecto a 'correcciones'
        await pool.query(
          `UPDATE proyectos SET estado = 'correcciones', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND estado NOT IN ('aprobado', 'sustentado', 'rechazado')`,
          [ent.proyecto_id]
        );
      } else if (estado_revision === 'en_revision') {
        // Si está en revisión, cambiar proyecto a 'en_revision'
        await pool.query(
          `UPDATE proyectos SET estado = 'en_revision', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND estado NOT IN ('aprobado', 'sustentado', 'rechazado', 'completado')`,
          [ent.proyecto_id]
        );
      }
    }

    // Create notification
    const rolText = actingAsTutor ? 'tutor' : actingAsRevisor ? 'revisor' : 'administrador';
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, tipo, mensaje, relacion_id, relacion_tipo)
       VALUES ($1, 
               CASE WHEN $2 = 'aprobado' THEN 'entrega_aprobada' ELSE 'entrega_rechazada' END,
               CASE WHEN $2 = 'aprobado' THEN 'Tu entrega de tarea ha sido aprobada por el ' || $4 ELSE 'Tu entrega de tarea requiere correcciones según el ' || $4 END,
               $3, 'proyecto_entrega')`,
      [ent.estudiante_id, estado_revision, id, rolText]
    );

    res.json({ entrega: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error updating task entrega status:', error);
    res.status(500).json({ error: 'Failed to update task entrega status' });
  }
});

export default router;
