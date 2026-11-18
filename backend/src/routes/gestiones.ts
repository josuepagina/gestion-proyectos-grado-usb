import express from 'express';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// ============================================
// GESTIÓN DE MATERIAS - Solo Administrador
// ============================================

// Mapeo de materias por semestre
const MATERIAS_MAPA = {
  7: 'Metodología de Investigación I',
  8: 'Metodología de Investigación II',
  9: 'Taller de Grado I',
  10: 'Taller de Grado II'
};

type MateriaInput = {
  semestre: number;
  materia?: string;
  codigo_materia?: string;
};

// GET: Obtener todas las gestiones con sus materias
router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        g.id,
        g.nombre,
        g.estado,
        g.descripcion,
        g.created_at,
        g.updated_at,
        gm.id AS gm_id,
        gm.semestre,
        gm.materia,
        gm.codigo_materia
      FROM gestiones g
      LEFT JOIN gestion_materias gm ON gm.gestion_id = g.id
      ORDER BY g.nombre ASC, gm.semestre ASC
    `);

    // Agrupar materias por gestión
    const gestionesMap: Record<string, any> = {};
    for (const row of result.rows) {
      if (!gestionesMap[row.id]) {
        gestionesMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          estado: row.estado,
          descripcion: row.descripcion,
          created_at: row.created_at,
          updated_at: row.updated_at,
          materias: [],
        };
      }
      if (row.gm_id) {
        gestionesMap[row.id].materias.push({
          id: row.gm_id,
          semestre: row.semestre,
          materia: row.materia,
          codigo_materia: row.codigo_materia || ''
        });
      }
    }

    const gestiones = Object.values(gestionesMap);

    res.json({
      success: true,
      gestiones,
      total: gestiones.length
    });
  } catch (error) {
    console.error('Error fetching gestiones:', error);
    res.status(500).json({ success: false, error: 'Error al obtener gestiones' });
  }
});

// GET: Obtener una gestión específica con sus materias y etapas
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
         g.id,
         g.nombre,
         g.estado,
         g.descripcion,
         g.created_at,
         g.updated_at,
         gm.id AS gm_id,
         gm.semestre,
         gm.materia,
         gm.codigo_materia
       FROM gestiones g
       LEFT JOIN gestion_materias gm ON gm.gestion_id = g.id
       WHERE g.id = $1
       ORDER BY gm.semestre ASC`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Gestión no encontrada' });
    }

    const base = result.rows[0];
    const gestion = {
      id: base.id,
      nombre: base.nombre,
      estado: base.estado,
      descripcion: base.descripcion,
      created_at: base.created_at,
      updated_at: base.updated_at,
      materias: result.rows
        .filter(r => r.gm_id)
        .map(r => ({
          id: r.gm_id,
          semestre: r.semestre,
          materia: r.materia,
          codigo_materia: r.codigo_materia || ''
        }))
    } as any;

    // Obtener etapas asociadas
    const etapasRes = await pool.query(`
      SELECT e.*, ge.orden_ejecucion
      FROM etapas e
      JOIN gestion_etapas ge ON e.id = ge.etapa_id
      WHERE ge.gestion_id = $1
      ORDER BY ge.orden_ejecucion ASC
    `, [id]);

    gestion.etapas = etapasRes.rows;

    res.json({ success: true, gestion });
  } catch (error) {
    console.error('Error fetching gestion:', error);
    res.status(500).json({ success: false, error: 'Error al obtener gestión' });
  }
});

// POST: Crear nueva gestión (solo Admin)
router.post('/', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const {
      nombre,
      materias = [],
      descripcion,
      etapa_ids = []
    } = req.body;

    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ success: false, error: 'El nombre es requerido' });
    }

    if (!Array.isArray(materias) || materias.length === 0) {
      return res.status(400).json({ success: false, error: 'Debe agregar al menos una materia' });
    }

    // Validar materias
    const materiasPreparadas = (materias as MateriaInput[]).map((mat) => {
      const semestreNum = Number(mat.semestre);
      if (![7, 8, 9, 10].includes(semestreNum)) {
        throw new Error('Semestre inválido. Debe ser 7, 8, 9 o 10');
      }
      return {
        semestre: semestreNum,
        materia: mat.materia || MATERIAS_MAPA[semestreNum as keyof typeof MATERIAS_MAPA],
        codigo_materia: mat.codigo_materia || undefined,
      };
    });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const gestionRes = await client.query(
        `INSERT INTO gestiones (nombre, descripcion)
         VALUES ($1, $2)
         RETURNING *`,
        [nombre, descripcion || null]
      );

      const gestion = gestionRes.rows[0];

      // Insertar todas las materias
      for (let i = 0; i < materiasPreparadas.length; i++) {
        const mat = materiasPreparadas[i];
        await client.query(
          `INSERT INTO gestion_materias (gestion_id, semestre, materia, codigo_materia)
           VALUES ($1, $2, $3, $4)`,
          [gestion.id, mat.semestre, mat.materia, mat.codigo_materia]
        );
      }

      // Asociar etapas si se proporcionan
      if (Array.isArray(etapa_ids) && etapa_ids.length > 0) {
        for (let i = 0; i < etapa_ids.length; i++) {
          await client.query(
            `INSERT INTO gestion_etapas (gestion_id, etapa_id, orden_ejecucion)
             VALUES ($1, $2, $3)`,
            [gestion.id, etapa_ids[i], i + 1]
          );
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Gestión creada exitosamente',
        gestion: { ...gestion, materias: materiasPreparadas }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error creating gestion:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ success: false, error: 'Ya existe una gestión con este nombre' });
    }
    const message = error.message?.includes('Semestre inválido')
      ? error.message
      : 'Error al crear gestión';
    const status = error.message?.includes('Semestre inválido') ? 400 : 500;
    res.status(status).json({ success: false, error: message });
  }
});

// PUT: Actualizar gestión (solo Admin)
router.put('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      materias = [],
      estado,
      descripcion,
      etapa_ids = []
    } = req.body;

    // Verificar que la gestión existe
    const checkRes = await pool.query(
      `SELECT id FROM gestiones WHERE id = $1`,
      [id]
    );

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Gestión no encontrada' });
    }

    // Validar materias si llegan
    let materiasPreparadas: MateriaInput[] = [];
    if (Array.isArray(materias) && materias.length > 0) {
      materiasPreparadas = materias.map((mat: MateriaInput) => {
        const semestreNum = Number(mat.semestre);
        if (![7, 8, 9, 10].includes(semestreNum)) {
          throw new Error('Semestre inválido. Debe ser 7, 8, 9 o 10');
        }
        return {
          semestre: semestreNum,
          materia: mat.materia || MATERIAS_MAPA[semestreNum as keyof typeof MATERIAS_MAPA],
          codigo_materia: mat.codigo_materia || undefined,
        };
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateRes = await client.query(
        `UPDATE gestiones 
         SET nombre = COALESCE($2, nombre),
             estado = COALESCE($3, estado),
             descripcion = COALESCE($4, descripcion),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id, nombre, estado, descripcion]
      );

      const gestion = updateRes.rows[0];

      // Actualizar materias si se proporcionan
      if (Array.isArray(materias) && materias.length > 0) {
        await client.query(`DELETE FROM gestion_materias WHERE gestion_id = $1`, [id]);
        for (let i = 0; i < materiasPreparadas.length; i++) {
          const mat = materiasPreparadas[i];
          await client.query(
            `INSERT INTO gestion_materias (gestion_id, semestre, materia, codigo_materia)
             VALUES ($1, $2, $3, $4)`,
            [id, mat.semestre, mat.materia, mat.codigo_materia]
          );
        }
      }

      // Actualizar etapas si se proporcionan
      if (Array.isArray(etapa_ids) && etapa_ids.length >= 0) {
        await client.query(
          `DELETE FROM gestion_etapas WHERE gestion_id = $1`,
          [id]
        );

        for (let i = 0; i < etapa_ids.length; i++) {
          await client.query(
            `INSERT INTO gestion_etapas (gestion_id, etapa_id, orden_ejecucion)
             VALUES ($1, $2, $3)`,
            [id, etapa_ids[i], i + 1]
          );
        }
      }

      // Obtener materias actualizadas
      const materiasRes = await client.query(
        `SELECT id, semestre, materia, codigo_materia FROM gestion_materias WHERE gestion_id = $1 ORDER BY semestre ASC`,
        [id]
      );

      // Obtener etapas actualizadas
      const etapasRes = await client.query(`
        SELECT e.*, ge.orden_ejecucion
        FROM etapas e
        JOIN gestion_etapas ge ON e.id = ge.etapa_id
        WHERE ge.gestion_id = $1
        ORDER BY ge.orden_ejecucion ASC
      `, [id]);

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Gestión actualizada exitosamente',
        gestion: {
          ...gestion,
          materias: materiasRes.rows,
          etapas: etapasRes.rows,
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating gestion:', error);
    const message = (error as Error).message?.includes('Semestre inválido')
      ? (error as Error).message
      : 'Error al actualizar gestión';
    const status = (error as Error).message?.includes('Semestre inválido') ? 400 : 500;
    res.status(status).json({ success: false, error: message });
  }
});

// DELETE: Eliminar gestión (solo Admin)
router.delete('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM gestiones WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Gestión no encontrada' });
    }

    res.json({
      success: true,
      message: 'Gestión eliminada exitosamente',
      gestion: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting gestion:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar gestión' });
  }
});

// GET: Obtener materias disponibles por semestre
router.get('/materias/:semestre', async (req: AuthRequest, res) => {
  try {
    const { semestre } = req.params;
    const semestrerInt = parseInt(semestre);

    if (![7, 8, 9, 10].includes(semestrerInt)) {
      return res.status(400).json({ success: false, error: 'Semestre inválido' });
    }

    const materia = MATERIAS_MAPA[semestrerInt as keyof typeof MATERIAS_MAPA];

    res.json({
      success: true,
      semestre: semestrerInt,
      materia
    });
  } catch (error) {
    console.error('Error fetching materia:', error);
    res.status(500).json({ success: false, error: 'Error al obtener materia' });
  }
});

// GET: Obtener gestiones activas y etapas abiertas del usuario (estudiante/tutor)
router.get('/usuario/activas-por-proyectos', authenticate, async (req: AuthRequest, res) => {
  try {
    const usuarioId = req.user!.id;
    const rol = req.user!.rol;
    const esTutor = req.user!.es_tutor || rol === 'tutor';

    // Obtener proyectos del usuario (estudiante o tutor)
    let proyectosQuery = '';
    if (rol === 'estudiante') {
      proyectosQuery = `
        SELECT id
        FROM proyectos
        WHERE estudiante_id = $1
      `;
    } else if (esTutor) {
      proyectosQuery = `
        SELECT DISTINCT p.id
        FROM proyectos p
        LEFT JOIN proyecto_etapas pe ON pe.proyecto_id = p.id
        WHERE p.tutor_id = $1 OR pe.tutor_id = $1
      `;
    } else {
      // Otros roles no tienen acceso
      return res.json({
        success: true,
        gestiones: [],
        total: 0
      });
    }

    const proyectosRes = await pool.query(proyectosQuery, [usuarioId]);
    const proyectoIds = proyectosRes.rows.map(r => r.id);

    if (proyectoIds.length === 0) {
      return res.json({
        success: true,
        proyectos: [],
        total: 0
      });
    }

    // Obtener gestiones activas, materias, etapas abiertas y tareas abiertas por proyecto
    const result = await pool.query(`
      WITH proyectos_usuario AS (
        SELECT id, titulo
        FROM proyectos
        WHERE id = ANY($1::uuid[])
      )
      SELECT 
        p.id AS proyecto_id,
        p.titulo AS proyecto_titulo,
        g.id AS gestion_id,
        g.nombre AS gestion_nombre,
        gm.id AS materia_id,
        gm.semestre,
        gm.materia AS materia_nombre,
        gm.codigo_materia,
        e.id AS etapa_id,
        e.nombre AS etapa_nombre,
        e.tipo AS etapa_tipo,
        e.estado AS etapa_estado,
        e.fecha_apertura,
        e.fecha_cierre,
        e.fecha_limite_entrega,
        t.id AS tarea_id,
        COALESCE(t.titulo, t.nombre) AS tarea_nombre,
        t.estado AS tarea_estado,
        t.prioridad AS tarea_prioridad,
        COALESCE(t.fecha_limite, t.fecha_vencimiento) AS tarea_fecha_limite
      FROM proyectos_usuario p
      JOIN gestiones g ON g.estado = 'activa'
      JOIN gestion_materias gm ON gm.gestion_id = g.id
      LEFT JOIN materia_etapas me ON me.materia_id = gm.id
      LEFT JOIN etapas e ON e.id = me.etapa_id
      LEFT JOIN etapa_proyecto ep ON ep.etapa_id = e.id AND ep.proyecto_id = p.id
      LEFT JOIN tareas t ON t.etapa_id = e.id
        AND t.gestion_materia_id = gm.id
        AND t.estado IN ('pendiente', 'en_progreso')
      WHERE (
        e.id IS NULL OR (
          e.estado = 'abierta'
          AND (COALESCE(ep.fecha_apertura_proyecto, e.fecha_apertura) IS NULL OR COALESCE(ep.fecha_apertura_proyecto, e.fecha_apertura) <= CURRENT_TIMESTAMP)
          AND (COALESCE(ep.fecha_cierre_proyecto, e.fecha_cierre) IS NULL OR COALESCE(ep.fecha_cierre_proyecto, e.fecha_cierre) >= CURRENT_TIMESTAMP)
        )
      )
      ORDER BY p.titulo, g.nombre, gm.semestre, e.numero_orden, t.prioridad DESC
    `, [proyectoIds]);

    // Agrupar los resultados por gestión -> materia -> etapas
    interface TareaData {
      id: string;
      nombre: string;
      estado: string;
      prioridad: string | null;
      fecha_limite: string | null;
    }

    interface EtapaData {
      id: string;
      nombre: string;
      tipo: string;
      estado: string;
      fecha_apertura: string | null;
      fecha_cierre: string | null;
      fecha_limite_entrega: string | null;
      tareas: TareaData[];
    }

    interface GestionData {
      id: string;
      nombre: string;
      materias: Array<{
        id: string;
        semestre: number;
        nombre: string;
        codigo_materia: string | null;
        etapas: EtapaData[];
      }>;
    }

    interface ProyectoData {
      id: string;
      titulo: string;
      gestiones: GestionData[];
    }

    const proyectosMap: Record<string, ProyectoData> = {};

    for (const row of result.rows) {
      if (!proyectosMap[row.proyecto_id]) {
        proyectosMap[row.proyecto_id] = {
          id: row.proyecto_id,
          titulo: row.proyecto_titulo,
          gestiones: []
        };
      }

      let gestion = proyectosMap[row.proyecto_id].gestiones.find(g => g.id === row.gestion_id);
      if (!gestion) {
        gestion = {
          id: row.gestion_id,
          nombre: row.gestion_nombre,
          materias: []
        };
        proyectosMap[row.proyecto_id].gestiones.push(gestion);
      }

      let materia = gestion.materias.find(m => m.id === row.materia_id);
      if (!materia) {
        materia = {
          id: row.materia_id,
          semestre: row.semestre,
          nombre: row.materia_nombre,
          codigo_materia: row.codigo_materia || null,
          etapas: []
        };
        gestion.materias.push(materia);
      }

      if (row.etapa_id) {
        let etapa = materia.etapas.find(e => e.id === row.etapa_id);
        if (!etapa) {
          etapa = {
            id: row.etapa_id,
            nombre: row.etapa_nombre,
            tipo: row.etapa_tipo,
            estado: row.etapa_estado,
            fecha_apertura: row.fecha_apertura,
            fecha_cierre: row.fecha_cierre,
            fecha_limite_entrega: row.fecha_limite_entrega,
            tareas: []
          };
          materia.etapas.push(etapa);
        }

        if (row.tarea_id) {
          const tareaExistente = etapa.tareas.find(t => t.id === row.tarea_id);
          if (!tareaExistente) {
            etapa.tareas.push({
              id: row.tarea_id,
              nombre: row.tarea_nombre,
              estado: row.tarea_estado,
              prioridad: row.tarea_prioridad,
              fecha_limite: row.tarea_fecha_limite
            });
          }
        }
      }
    }

    const proyectos = Object.values(proyectosMap);

    res.json({
      success: true,
      proyectos,
      total: proyectos.length
    });
  } catch (error) {
    console.error('Error fetching gestiones activas por proyectos:', error);
    res.status(500).json({ success: false, error: 'Error al obtener gestiones activas' });
  }
});

// GET: Obtener etapas abiertas agrupadas por materias en gestiones activas
router.get('/admin/etapas-abiertas-por-materias', async (req: AuthRequest, res) => {
  try {
    // Obtener gestiones activas con sus materias y etapas abiertas
    const result = await pool.query(`
      SELECT 
        g.id as gestion_id,
        g.nombre as gestion_nombre,
        gm.id as materia_id,
        gm.semestre,
        gm.materia as materia_nombre,
        gm.codigo_materia,
        e.id as etapa_id,
        e.nombre as etapa_nombre,
        e.tipo as etapa_tipo,
        e.estado as etapa_estado,
        e.fecha_apertura,
        e.fecha_cierre,
        e.fecha_limite_entrega,
        me.orden_ejecucion
      FROM gestiones g
      INNER JOIN gestion_materias gm ON gm.gestion_id = g.id
      LEFT JOIN materia_etapas me ON me.materia_id = gm.id
      LEFT JOIN etapas e ON e.id = me.etapa_id AND e.estado = 'abierta'
      WHERE g.estado = 'activa'
      ORDER BY g.nombre, gm.semestre, me.orden_ejecucion
    `);

    // Agrupar los resultados por gestión -> materia -> etapas
    interface GestionData {
      id: string;
      nombre: string;
      materias: Array<{
        id: string;
        semestre: number;
        nombre: string;
        codigo_materia: string | null;
        etapas: Array<{
          id: string;
          nombre: string;
          tipo: string;
          estado: string;
          fecha_apertura: string | null;
          fecha_cierre: string | null;
          fecha_limite_entrega: string | null;
        }>;
      }>;
    }

    const gestionsMap: Record<string, GestionData> = {};

    for (const row of result.rows) {
      // Crear gestión si no existe
      if (!gestionsMap[row.gestion_id]) {
        gestionsMap[row.gestion_id] = {
          id: row.gestion_id,
          nombre: row.gestion_nombre,
          materias: []
        };
      }

      // Buscar si la materia ya existe en la gestión
      let materia = gestionsMap[row.gestion_id].materias.find(m => m.id === row.materia_id);
      if (!materia) {
        materia = {
          id: row.materia_id,
          semestre: row.semestre,
          nombre: row.materia_nombre,
          codigo_materia: row.codigo_materia || null,
          etapas: []
        };
        gestionsMap[row.gestion_id].materias.push(materia);
      }

      // Agregar etapa si existe
      if (row.etapa_id) {
        materia.etapas.push({
          id: row.etapa_id,
          nombre: row.etapa_nombre,
          tipo: row.etapa_tipo,
          estado: row.etapa_estado,
          fecha_apertura: row.fecha_apertura,
          fecha_cierre: row.fecha_cierre,
          fecha_limite_entrega: row.fecha_limite_entrega
        });
      }
    }

    const gestiones = Object.values(gestionsMap);

    res.json({
      success: true,
      gestiones,
      total: gestiones.length
    });
  } catch (error) {
    console.error('Error fetching etapas abiertas por materias:', error);
    res.status(500).json({ success: false, error: 'Error al obtener etapas abiertas por materias' });
  }
});

export default router;
