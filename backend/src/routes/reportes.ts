import express from 'express';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import * as fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const router = express.Router();

const isAdmin = (user: AuthRequest['user']) => user?.rol === 'administrador';
const isStudent = (user: AuthRequest['user']) => user?.rol === 'estudiante';
const isTutor = (user: AuthRequest['user']) => !!user && (user.es_tutor || user.rol === 'tutor');
const isRevisor = (user: AuthRequest['user']) => !!user && (user.es_revisor || user.rol === 'revisor');

// Get tareas pendientes for current user
router.get('/tareas-pendientes', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const rol = req.user!.rol;

    let query = '';

    if (isStudent(req.user)) {
      // Tareas pendientes para estudiantes: observaciones no resueltas, entregas pendientes de revisión
      query = `
        SELECT 
          'observacion' as tipo_tarea,
          o.id as tarea_id,
          o.comentario as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          o.fecha as fecha_creacion,
          o.estado_resuelto as completada
        FROM observaciones o
        JOIN entregas e ON o.entrega_id = e.id
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.estudiante_id = $1 AND o.estado_resuelto = false
        
        UNION ALL
        
        SELECT 
          'entrega_revision' as tipo_tarea,
          e.id as tarea_id,
          'Entrega pendiente de revisión: ' || e.etapa as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          e.fecha_subida as fecha_creacion,
          CASE WHEN e.estado_revision = 'aprobado' THEN true ELSE false END as completada
        FROM entregas e
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.estudiante_id = $1 AND e.estado_revision IN ('pendiente', 'en_revision', 'observado')
        
        ORDER BY fecha_creacion DESC
      `;
    } else if (isTutor(req.user)) {
      // Tareas pendientes para tutores: entregas sin revisar o con observaciones pendientes
      query = `
        SELECT DISTINCT
          'revisar_entrega' as tipo_tarea,
          e.id::text as tarea_id,
          'Revisar entrega: ' || e.etapa || ' - ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          e.fecha_subida as fecha_creacion,
          CASE WHEN e.estado_revision = 'aprobado' THEN true ELSE false END as completada
        FROM entregas e
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.tutor_id = $1 
          AND e.estado_revision IN ('pendiente', 'en_revision', 'observado')
          AND p.estado NOT IN ('completado', 'aprobado', 'sustentado', 'rechazado')
        
        UNION
        
        SELECT DISTINCT
          'observaciones_pendientes' as tipo_tarea,
          o.id::text as tarea_id,
          'Observaciones pendientes en entrega: ' || e.etapa || ' - ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          o.fecha as fecha_creacion,
          CASE WHEN o.estado_resuelto = true THEN true ELSE false END as completada
        FROM observaciones o
        JOIN entregas e ON o.entrega_id = e.id
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.tutor_id = $1 
          AND o.usuario_id = $1
          AND o.estado_resuelto = false
          AND p.estado NOT IN ('completado', 'aprobado', 'sustentado', 'rechazado')
        
        ORDER BY fecha_creacion DESC
      `;
    } else if (isRevisor(req.user)) {
      // Tareas pendientes para revisores: proyectos asignados sin revisar
      query = `
        SELECT 
          'revisar_proyecto' as tipo_tarea,
          p.id as tarea_id,
          'Revisar proyecto: ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          p.estado,
          pr.fecha_asignacion as fecha_creacion,
          CASE WHEN p.estado = 'aprobado' THEN true ELSE false END as completada
        FROM proyecto_revisores pr
        JOIN proyectos p ON pr.proyecto_id = p.id
        WHERE pr.revisor_id = $1 AND p.estado IN ('en_revision', 'correcciones')
        
        ORDER BY fecha_creacion DESC
      `;
    } else {
      // Administrador: todas las tareas pendientes del sistema
      query = `
        SELECT 
          'asignar_tutor' as tipo_tarea,
          p.id as tarea_id,
          'Proyecto sin tutor asignado: ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          p.estado,
          p.created_at as fecha_creacion,
          CASE WHEN p.tutor_id IS NOT NULL THEN true ELSE false END as completada
        FROM proyectos p
        WHERE p.tutor_id IS NULL
        
        UNION ALL
        
        SELECT 
          'proyecto_revision' as tipo_tarea,
          p.id as tarea_id,
          'Proyecto en revisión: ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          p.estado,
          p.updated_at as fecha_creacion,
          CASE WHEN p.estado IN ('aprobado', 'sustentado') THEN true ELSE false END as completada
        FROM proyectos p
        WHERE p.estado IN ('en_revision', 'correcciones')
        
        ORDER BY fecha_creacion DESC
      `;
    }

    const result = await pool.query(query, isAdmin(req.user) ? [] : [userId]);
    res.json({ tareas: result.rows });
  } catch (error) {
    console.error('Error fetching tareas pendientes:', error);
    res.status(500).json({ error: 'Failed to fetch tareas pendientes' });
  }
});

// Get tareas cumplidas for current user
router.get('/tareas-cumplidas', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const rol = req.user!.rol;

    let query = '';

    if (isStudent(req.user)) {
      query = `
        SELECT 
          'observacion' as tipo_tarea,
          o.id as tarea_id,
          o.comentario as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          o.fecha as fecha_creacion,
          o.estado_resuelto as completada,
          o.fecha as fecha_completada
        FROM observaciones o
        JOIN entregas e ON o.entrega_id = e.id
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.estudiante_id = $1 AND o.estado_resuelto = true
        
        UNION ALL
        
        SELECT 
          'entrega_aprobada' as tipo_tarea,
          e.id as tarea_id,
          'Entrega aprobada: ' || e.etapa as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          e.fecha_subida as fecha_creacion,
          true as completada,
          e.updated_at as fecha_completada
        FROM entregas e
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.estudiante_id = $1 AND e.estado_revision = 'aprobado'
        
        ORDER BY fecha_completada DESC
        LIMIT 50
      `;
    } else if (isTutor(req.user)) {
      query = `
        SELECT 
          'entrega_revisada' as tipo_tarea,
          e.id::text as tarea_id,
          'Entrega revisada: ' || e.etapa || ' - ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          e.fecha_subida as fecha_creacion,
          true as completada,
          e.fecha_subida as fecha_completada
        FROM entregas e
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.tutor_id = $1 AND e.estado_revision IN ('aprobado', 'rechazado')
        
        UNION
        
        SELECT 
          'observacion_resuelta' as tipo_tarea,
          o.id::text as tarea_id,
          'Observación resuelta en entrega: ' || e.etapa || ' - ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          e.etapa,
          o.fecha as fecha_creacion,
          true as completada,
          o.fecha as fecha_completada
        FROM observaciones o
        JOIN entregas e ON o.entrega_id = e.id
        JOIN proyectos p ON e.proyecto_id = p.id
        WHERE p.tutor_id = $1 
          AND o.usuario_id = $1
          AND o.estado_resuelto = true
        
        ORDER BY fecha_completada DESC
        LIMIT 50
      `;
    } else if (isRevisor(req.user)) {
      query = `
        SELECT 
          'proyecto_revisado' as tipo_tarea,
          p.id as tarea_id,
          'Proyecto revisado: ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          p.estado,
          pr.fecha_asignacion as fecha_creacion,
          true as completada,
          p.updated_at as fecha_completada
        FROM proyecto_revisores pr
        JOIN proyectos p ON pr.proyecto_id = p.id
        WHERE pr.revisor_id = $1 AND p.estado IN ('aprobado', 'sustentado')
        
        ORDER BY fecha_completada DESC
        LIMIT 50
      `;
    } else {
      // Administrador: todas las tareas cumplidas
      query = `
        SELECT 
          'proyecto_completado' as tipo_tarea,
          p.id as tarea_id,
          'Proyecto completado: ' || p.titulo as descripcion,
          p.titulo as proyecto_titulo,
          p.estado,
          p.created_at as fecha_creacion,
          true as completada,
          p.updated_at as fecha_completada
        FROM proyectos p
        WHERE p.estado IN ('aprobado', 'sustentado')
        
        ORDER BY fecha_completada DESC
        LIMIT 50
      `;
    }

    const result = await pool.query(query, isAdmin(req.user) ? [] : [userId]);
    res.json({ tareas: result.rows });
  } catch (error) {
    console.error('Error fetching tareas cumplidas:', error);
    res.status(500).json({ error: 'Failed to fetch tareas cumplidas' });
  }
});

// Get avance por proyecto (progress report)
router.get('/avance/:proyectoId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proyectoId } = req.params;
    const userId = req.user!.id;
    const rol = req.user!.rol;

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
    if (isStudent(req.user) && proj.estudiante_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (isTutor(req.user) && !isRevisor(req.user) && proj.tutor_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get entregas por etapa
    const entregasPorEtapa = await pool.query(
      `SELECT 
        etapa,
        COUNT(*) as total_entregas,
        COUNT(CASE WHEN estado_revision = 'aprobado' THEN 1 END) as entregas_aprobadas,
        MAX(version) as ultima_version,
        MAX(fecha_subida) as ultima_fecha_subida
       FROM entregas
       WHERE proyecto_id = $1
       GROUP BY etapa
       ORDER BY 
         CASE etapa
           WHEN 'anteproyecto' THEN 1
           WHEN 'entrega_parcial_1' THEN 2
           WHEN 'entrega_parcial_2' THEN 3
           WHEN 'entrega_parcial_3' THEN 4
           WHEN 'version_final' THEN 5
         END`,
      [proyectoId]
    );

    // Get observaciones pendientes
    const observacionesPendientes = await pool.query(
      `SELECT COUNT(*) as total
       FROM observaciones o
       JOIN entregas e ON o.entrega_id = e.id
       WHERE e.proyecto_id = $1 AND o.estado_resuelto = false`,
      [proyectoId]
    );

    // Calculate progress percentage
    const etapasRequeridas = ['anteproyecto', 'entrega_parcial_1', 'entrega_parcial_2', 'entrega_parcial_3', 'version_final'];
    const etapasCompletadas = entregasPorEtapa.rows.filter(
      (e: any) => e.entregas_aprobadas > 0
    ).length;
    const porcentajeAvance = Math.round((etapasCompletadas / etapasRequeridas.length) * 100);

    res.json({
      proyecto_id: proyectoId,
      porcentaje_avance: porcentajeAvance,
      etapas_completadas: etapasCompletadas,
      etapas_totales: etapasRequeridas.length,
      entregas_por_etapa: entregasPorEtapa.rows,
      observaciones_pendientes: parseInt(observacionesPendientes.rows[0].total),
    });
  } catch (error) {
    console.error('Error fetching avance:', error);
    res.status(500).json({ error: 'Failed to fetch avance' });
  }
});

// Get reporte de tiempos y plazos
router.get('/tiempos-plazos', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const rol = req.user!.rol;

    let query = '';

    if (isStudent(req.user)) {
      // Proyectos del estudiante con información de tiempos
      query = `
        SELECT 
          p.id,
          p.titulo,
          p.estado,
          p.fecha_entrega,
          p.created_at as fecha_inicio,
          p.updated_at as ultima_actividad,
          CASE 
            WHEN p.fecha_entrega IS NOT NULL AND p.fecha_entrega < CURRENT_DATE THEN 'retrasado'
            WHEN p.fecha_entrega IS NOT NULL AND p.fecha_entrega <= CURRENT_DATE + INTERVAL '7 days' THEN 'proximo_vencimiento'
            ELSE 'en_tiempo'
          END as estado_plazo,
          EXTRACT(DAY FROM (CURRENT_DATE - p.fecha_entrega)) as dias_retraso,
          EXTRACT(DAY FROM (p.fecha_entrega - CURRENT_DATE)) as dias_restantes
        FROM proyectos p
        WHERE p.estudiante_id = $1
        ORDER BY p.fecha_entrega ASC NULLS LAST
      `;
    } else if (isTutor(req.user)) {
      // Proyectos asignados al tutor con información de tiempos
      query = `
        SELECT 
          p.id,
          p.titulo,
          p.estado,
          p.fecha_entrega,
          p.created_at as fecha_inicio,
          p.updated_at as ultima_actividad,
          CASE 
            WHEN p.fecha_entrega IS NOT NULL AND p.fecha_entrega < CURRENT_DATE THEN 'retrasado'
            WHEN p.fecha_entrega IS NOT NULL AND p.fecha_entrega <= CURRENT_DATE + INTERVAL '7 days' THEN 'proximo_vencimiento'
            ELSE 'en_tiempo'
          END as estado_plazo,
          EXTRACT(DAY FROM (CURRENT_DATE - p.fecha_entrega)) as dias_retraso,
          EXTRACT(DAY FROM (p.fecha_entrega - CURRENT_DATE)) as dias_restantes
        FROM proyectos p
        WHERE p.tutor_id = $1
        ORDER BY p.fecha_entrega ASC NULLS LAST
      `;
    } else if (isAdmin(req.user)) {
      // Todos los proyectos con información de tiempos
      query = `
        SELECT 
          p.id,
          p.titulo,
          p.estado,
          p.fecha_entrega,
          p.created_at as fecha_inicio,
          p.updated_at as ultima_actividad,
          CASE 
            WHEN p.fecha_entrega IS NOT NULL AND p.fecha_entrega < CURRENT_DATE THEN 'retrasado'
            WHEN p.fecha_entrega IS NOT NULL AND p.fecha_entrega <= CURRENT_DATE + INTERVAL '7 days' THEN 'proximo_vencimiento'
            ELSE 'en_tiempo'
          END as estado_plazo,
          EXTRACT(DAY FROM (CURRENT_DATE - p.fecha_entrega)) as dias_retraso,
          EXTRACT(DAY FROM (p.fecha_entrega - CURRENT_DATE)) as dias_restantes,
          u.nombre || ' ' || u.apellidos as estudiante_nombre
        FROM proyectos p
        JOIN usuarios u ON p.estudiante_id = u.id
        ORDER BY p.fecha_entrega ASC NULLS LAST
      `;
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query(query, isAdmin(req.user) ? [] : [userId]);

    // Calculate statistics
    const proyectosRetrasados = result.rows.filter((p: any) => p.estado_plazo === 'retrasado').length;
    const proyectosProximosVencimiento = result.rows.filter((p: any) => p.estado_plazo === 'proximo_vencimiento').length;
    const proyectosEnTiempo = result.rows.filter((p: any) => p.estado_plazo === 'en_tiempo').length;

    res.json({
      proyectos: result.rows,
      estadisticas: {
        total: result.rows.length,
        retrasados: proyectosRetrasados,
        proximos_vencimiento: proyectosProximosVencimiento,
        en_tiempo: proyectosEnTiempo,
      },
    });
  } catch (error) {
    console.error('Error fetching tiempos-plazos:', error);
    res.status(500).json({ error: 'Failed to fetch tiempos-plazos' });
  }
});

// Get estadísticas (admin only)
router.get('/estadisticas', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const [
      totalProyectos,
      proyectosPorEstado,
      totalEntregas,
      entregasPorEstado,
      totalObservaciones,
      observacionesPendientes,
      proyectosSinTutor,
      proyectosEnRevision,
      usuariosPorRol,
      entregasPorEtapa,
    ] = await Promise.all([
      // Total proyectos
      pool.query('SELECT COUNT(*) as total FROM proyectos'),
      
      // Proyectos por estado
      pool.query(`
        SELECT estado, COUNT(*) as cantidad
        FROM proyectos
        GROUP BY estado
        ORDER BY cantidad DESC
      `),
      
      // Total entregas
      pool.query('SELECT COUNT(*) as total FROM entregas'),
      
      // Entregas por estado
      pool.query(`
        SELECT estado_revision, COUNT(*) as cantidad
        FROM entregas
        GROUP BY estado_revision
        ORDER BY cantidad DESC
      `),
      
      // Total observaciones
      pool.query('SELECT COUNT(*) as total FROM observaciones'),
      
      // Observaciones pendientes
      pool.query('SELECT COUNT(*) as total FROM observaciones WHERE estado_resuelto = false'),
      
      // Proyectos sin tutor
      pool.query('SELECT COUNT(*) as total FROM proyectos WHERE tutor_id IS NULL'),
      
      // Proyectos en revisión
      pool.query('SELECT COUNT(*) as total FROM proyectos WHERE estado IN (\'en_revision\', \'correcciones\')'),
      
      // Usuarios por rol
      pool.query(`
        SELECT rol, COUNT(*) as cantidad
        FROM usuarios
        WHERE estado = 'activo'
        GROUP BY rol
        ORDER BY cantidad DESC
      `),
      
      // Entregas por etapa
      pool.query(`
        SELECT etapa, COUNT(*) as cantidad
        FROM entregas
        GROUP BY etapa
        ORDER BY cantidad DESC
      `),
    ]);

    res.json({
      estadisticas: {
        proyectos: {
          total: parseInt(totalProyectos.rows[0].total),
          por_estado: proyectosPorEstado.rows,
          sin_tutor: parseInt(proyectosSinTutor.rows[0].total),
          en_revision: parseInt(proyectosEnRevision.rows[0].total),
        },
        entregas: {
          total: parseInt(totalEntregas.rows[0].total),
          por_estado: entregasPorEstado.rows,
          por_etapa: entregasPorEtapa.rows,
        },
        observaciones: {
          total: parseInt(totalObservaciones.rows[0].total),
          pendientes: parseInt(observacionesPendientes.rows[0].total),
        },
        usuarios: {
          por_rol: usuariosPorRol.rows,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching estadisticas:', error);
    res.status(500).json({ error: 'Failed to fetch estadisticas' });
  }
});

export default router;

// ==================== Export: Lista de Docentes/Estudiantes ====================
// Endpoint para que el administrador descargue un documento tipo CSV con información tabular
// similar a la hoja impresa (docente tutor, estudiante, revisores, observaciones, etc.)
router.get('/export/lista-docentes', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    // Obtener proyectos con estudiante, tutor y revisores
    const result = await pool.query(`
      SELECT
        p.id as proyecto_id,
        p.titulo as proyecto,
        est.id as estudiante_id,
        est.nombre || ' ' || est.apellidos as estudiante_nombre,
        est.ru as estudiante_ru,
        tut.nombre || ' ' || tut.apellidos as tutor_nombre,
        ARRAY_REMOVE(ARRAY_AGG(rev.nombre || ' ' || rev.apellidos), NULL) as revisores
      FROM proyectos p
      LEFT JOIN usuarios est ON p.estudiante_id = est.id
      LEFT JOIN usuarios tut ON p.tutor_id = tut.id
      LEFT JOIN proyecto_revisores pr ON pr.proyecto_id = p.id
      LEFT JOIN usuarios rev ON pr.revisor_id = rev.id
      GROUP BY p.id, est.id, est.nombre, est.apellidos, est.ru, tut.nombre, tut.apellidos
      ORDER BY tut.apellidos NULLS LAST, est.apellidos NULLS LAST
    `);

    const rows = result.rows;

    // CSV header similar to the requested sheet
    const headers = [
      'Nro',
      'DOCENTE GUIA O TUTOR',
      'ESTUDIANTE',
      'RU',
      'PROYECTO',
      'PRIMER RELATOR',
      'SEGUNDO RELATOR',
      'DOC',
      'SAF',
      'PAGOS'
    ];

    const lines = [headers.join(',')];

    rows.forEach((r: any, idx: number) => {
      const revisores: string[] = r.revisores || [];
      const primerRelator = revisores[0] || '';
      const segundoRelator = revisores[1] || '';

      const line = [
        (idx + 1).toString(),
        `"${r.tutor_nombre || ''}"`,
        `"${r.estudiante_nombre || ''}"`,
        `"${r.estudiante_ru || ''}"`,
        `"${r.titulo || r.proyecto || ''}"`,
        `"${primerRelator}"`,
        `"${segundoRelator}"`,
        '', // DOC
        '', // SAF
        '', // PAGOS
      ];

      lines.push(line.join(','));
    });

    const csv = lines.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="lista_docentes.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting lista-docentes:', error);
    res.status(500).json({ error: 'Error al exportar lista de docentes' });
  }
});

// Preview JSON: devuelve las primeras filas para previsualización en UI (sin semestre)
router.get('/export/lista-docentes/preview', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id as proyecto_id,
        p.titulo as proyecto,
        est.id as estudiante_id,
        est.nombre || ' ' || est.apellidos as estudiante_nombre,
        est.ru as estudiante_ru,
        tut.nombre || ' ' || tut.apellidos as tutor_nombre,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT rev.nombre || ' ' || rev.apellidos), NULL) as revisores,
        COALESCE(p.fecha_entrega, p.created_at) as fecha_ref
      FROM proyectos p
      LEFT JOIN usuarios est ON p.estudiante_id = est.id
      LEFT JOIN usuarios tut ON p.tutor_id = tut.id
      LEFT JOIN proyecto_revisores pr ON pr.proyecto_id = p.id
      LEFT JOIN usuarios rev ON pr.revisor_id = rev.id
      GROUP BY p.id, est.id, est.nombre, est.apellidos, est.ru, tut.nombre, tut.apellidos, p.fecha_entrega, p.created_at
      ORDER BY tut.apellidos NULLS LAST, est.apellidos NULLS LAST
      LIMIT 200
    `);

    const rows = result.rows;

    const data = rows.map((r: any, idx: number) => {
      const revisores: string[] = r.revisores || [];
      const primerRelator = revisores[0] || '';
      const segundoRelator = revisores[1] || '';
      return {
        nro: idx + 1,
        docente: r.tutor_nombre || '',
        estudiante: r.estudiante_nombre || '',
        ru: r.estudiante_ru || '',
        proyecto: r.proyecto || r.titulo || '',
        primerRelator,
        segundoRelator
      };
    });

    res.json({ data });
  } catch (error) {
    console.error('Error preview lista-docentes:', error);
    res.status(500).json({ error: 'Error al generar preview' });
  }
});

// PDF export: genera un PDF con observaciones (sin semestre)
import PDFDocument from 'pdfkit';

router.get('/export/lista-docentes/pdf', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const previewRes = await pool.query(`
      SELECT
        p.id as proyecto_id,
        p.titulo as proyecto,
        est.id as estudiante_id,
        est.nombre || ' ' || est.apellidos as estudiante_nombre,
        est.ru as estudiante_ru,
        tut.nombre || ' ' || tut.apellidos as tutor_nombre,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT rev.nombre || ' ' || rev.apellidos), NULL) as revisores,
        COALESCE(p.fecha_entrega, p.created_at) as fecha_ref
      FROM proyectos p
      LEFT JOIN usuarios est ON p.estudiante_id = est.id
      LEFT JOIN usuarios tut ON p.tutor_id = tut.id
      LEFT JOIN proyecto_revisores pr ON pr.proyecto_id = p.id
      LEFT JOIN usuarios rev ON pr.revisor_id = rev.id
      GROUP BY p.id, est.id, est.nombre, est.apellidos, est.ru, tut.nombre, tut.apellidos, p.fecha_entrega, p.created_at
      ORDER BY tut.apellidos NULLS LAST, est.apellidos NULLS LAST
    `);

    const rows = previewRes.rows;

    // Stream PDF (A4 landscape)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="lista_docentes.pdf"');

    // Force landscape by specifying explicit dimensions (points): A4 landscape ~ [842, 595]
    const doc = new PDFDocument({ size: [842, 595], margin: 40 });
    doc.pipe(res);

    // Add small centered logo if available
    const logoCandidates = [path.join(__dirname, '../../uploads/logo.png'), path.join(__dirname, '../../uploads/logo.jpg')];
    for (const lp of logoCandidates) {
      if (fs.existsSync(lp)) {
        try {
          const logoBuffer = fs.readFileSync(lp);
          const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
          const imgWidth = 80; // small
          const xCenter = doc.page.margins.left + (usableWidth - imgWidth) / 2;
          doc.image(logoBuffer, xCenter, doc.y, { width: imgWidth });
          doc.moveDown(0.4);
        } catch (e) {
          console.error('No se pudo cargar el logo para el PDF:', e);
        }
        break;
      }
    }

    doc.fontSize(16).font('Helvetica-Bold').text('Lista de Proyectos y Docentes', { align: 'center' });
    doc.moveDown(0.6);

    // Table header (reduce columns to fit A4 margins and combine relatores)
    const tableHeaders = ['Nro', 'DOCENTE', 'ESTUDIANTE', 'RU', 'PROYECTO', 'RELATOR 1', 'RELATOR 2'];
    // Ajuste de anchos para A4 landscape (margen 40 cada lado -> ancho util ≈ 842 - 80 = 762)
    const columnWidths = [30, 120, 110, 50, 200, 100, 100]; // Sum = 710 (aprox ancho util)
    const totalWidth = columnWidths.reduce((s, w) => s + w, 0);

    const startX = doc.x;
    let y = doc.y;
    let pageNumber = 1;

    const drawTableHeader = () => {
      // header background
      doc.save();
      doc.rect(startX, y - 2, totalWidth, 20).fill('#f2f2f2');
      doc.fillColor('black');
      doc.fontSize(10).font('Helvetica-Bold');
      let xh = startX;
      for (let i = 0; i < tableHeaders.length; i++) {
        doc.text(tableHeaders[i], xh + 2, y, { width: columnWidths[i] - 4, align: 'left' });
        xh += columnWidths[i];
      }
      doc.restore();
      y += 22;
      doc.font('Helvetica').fontSize(9);
    };

    const drawFooter = (_pn?: number) => {
      // Footer intentionally left blank (page numbering removed per request)
      return;
    };

    drawTableHeader();

    rows.forEach((r: any, idx: number) => {
      const revisores: string[] = r.revisores || [];
      const primerRelator = revisores[0] || '';
      const segundoRelator = revisores[1] || '';

      const cells = [String(idx + 1), r.tutor_nombre || '', r.estudiante_nombre || '', r.estudiante_ru || '', r.proyecto || r.titulo || '', primerRelator, segundoRelator];

      // Calculate max height for this row
      const cellHeights = cells.map((cell, i) => doc.heightOfString(String(cell || ''), { width: columnWidths[i] - 4 }));
      const rowHeight = Math.max(...cellHeights) + 8;

      // Page break if necessary (reserve space for footer)
      const bottomLimit = doc.page.height - doc.page.margins.bottom - 25;
      if (y + rowHeight > bottomLimit) {
        // draw footer for current page then add new
        drawFooter(pageNumber);
        doc.addPage();
        pageNumber += 1;
        y = doc.y;
        drawTableHeader();
      }

      // Draw each cell
      let xc = startX;
      for (let i = 0; i < cells.length; i++) {
        doc.text(String(cells[i] || ''), xc + 2, y, { width: columnWidths[i] - 4 });
        xc += columnWidths[i];
      }

      // horizontal separator
      doc.moveTo(startX, y + rowHeight - 4).lineTo(startX + totalWidth, y + rowHeight - 4).strokeColor('#e0e0e0').stroke();

      y += rowHeight;
    });

    // footer for last page
    drawFooter(pageNumber);

    doc.end();
  } catch (error) {
    console.error('Error exporting lista-docentes pdf:', error);
    res.status(500).json({ error: 'Error al exportar pdf' });
  }
});

// XLSX export: genera un archivo Excel en orientación horizontal
router.get('/export/lista-docentes/xlsx', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const previewRes = await pool.query(`
      SELECT
        p.id as proyecto_id,
        p.titulo as proyecto,
        est.id as estudiante_id,
        est.nombre || ' ' || est.apellidos as estudiante_nombre,
        est.ru as estudiante_ru,
        tut.nombre || ' ' || tut.apellidos as tutor_nombre,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT rev.nombre || ' ' || rev.apellidos), NULL) as revisores
      FROM proyectos p
      LEFT JOIN usuarios est ON p.estudiante_id = est.id
      LEFT JOIN usuarios tut ON p.tutor_id = tut.id
      LEFT JOIN proyecto_revisores pr ON pr.proyecto_id = p.id
      LEFT JOIN usuarios rev ON pr.revisor_id = rev.id
      GROUP BY p.id, est.id, est.nombre, est.apellidos, est.ru, tut.nombre, tut.apellidos
      ORDER BY tut.apellidos NULLS LAST, est.apellidos NULLS LAST
    `);

    const rows = previewRes.rows;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Lista', { views: [{ state: 'normal', showGridLines: true }] });
    sheet.pageSetup = { orientation: 'landscape' };

    // Try to add logo if exists in uploads/logo.png or uploads/logo.jpg
    const logoPaths = [path.join(__dirname, '../../uploads/logo.png'), path.join(__dirname, '../../uploads/logo.jpg')];
    for (const lp of logoPaths) {
      if (fs.existsSync(lp)) {
        const logoBuffer = Buffer.from(fs.readFileSync(lp));
        const imageId = workbook.addImage({ buffer: logoBuffer, extension: lp.endsWith('.png') ? 'png' : 'jpeg' } as any);
        // place small centered: start at column 2, small size
        sheet.addImage(imageId, { tl: { col: 2, row: 0 }, ext: { width: 80, height: 40 } });
        break;
      }
    }

    // Header row (leave a blank row after logo)
    const headerRowIndex = 3;
    const headers = ['Nro', 'DOCENTE', 'ESTUDIANTE', 'RU', 'PROYECTO', 'PRIMER RELATOR', 'SEGUNDO RELATOR'];
    sheet.getRow(headerRowIndex).values = headers;
    sheet.getRow(headerRowIndex).font = { bold: true };

    // column widths
    sheet.columns = [
      { key: 'nro', width: 6 },
      { key: 'docente', width: 30 },
      { key: 'estudiante', width: 30 },
      { key: 'ru', width: 12 },
      { key: 'proyecto', width: 50 },
      { key: 'primerRelator', width: 25 },
      { key: 'segundoRelator', width: 25 }
    ];

    // Fill rows
    rows.forEach((r: any, idx: number) => {
      const revisores: string[] = r.revisores || [];
      const primerRelator = revisores[0] || '';
      const segundoRelator = revisores[1] || '';
      sheet.addRow([idx + 1, r.tutor_nombre || '', r.estudiante_nombre || '', r.estudiante_ru || '', r.proyecto || r.titulo || '', primerRelator, segundoRelator]);
    });

    // Styling: borders for header
    sheet.getRow(headerRowIndex).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer() as ArrayBuffer);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="lista_docentes.xlsx"');
    res.setHeader('Content-Length', buffer.length.toString());
    // send buffer directly
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting lista-docentes xlsx:', error);
    res.status(500).json({ error: 'Error al exportar xlsx' });
  }
});

