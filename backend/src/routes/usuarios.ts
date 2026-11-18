import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const createUserSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellidos: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  rol: z.enum(['estudiante', 'tutor', 'revisor', 'administrador']),
  es_tutor: z.boolean().optional(),
  es_revisor: z.boolean().optional(),
  ru: z.string().optional(),
});

const updateUserSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  apellidos: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  rol: z.enum(['estudiante', 'tutor', 'revisor', 'administrador']).optional(),
  es_tutor: z.boolean().optional(),
  es_revisor: z.boolean().optional(),
  estado: z.enum(['activo', 'inactivo']).optional(),
  ru: z.string().optional(),
});

const normalizeDocenteTags = (rol: string, esTutor?: boolean, esRevisor?: boolean) => {
  if (rol === 'estudiante' || rol === 'administrador') {
    return { es_tutor: false, es_revisor: false };
  }
  return {
    es_tutor: esTutor ?? rol === 'tutor',
    es_revisor: esRevisor ?? rol === 'revisor',
  };
};

// Get all users (admin only)
router.get('/', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { rol } = req.query;

    let query = 'SELECT id, nombre, apellidos, email, rol, es_tutor, es_revisor, estado, ru, created_at FROM usuarios';
    const params: any[] = [];

    if (rol) {
      if (rol === 'tutor') {
        query += ' WHERE (es_tutor = true OR rol = $1)';
      } else if (rol === 'revisor') {
        query += ' WHERE (es_revisor = true OR rol = $1)';
      } else {
        query += ' WHERE rol = $1';
      }
      params.push(rol);
    }

    query += ' ORDER BY nombre, apellidos';

    const result = await pool.query(query, params);
    res.json({ usuarios: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get tutors (for assignment)
router.get('/tutores', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, apellidos, email
       FROM usuarios
       WHERE (es_tutor = true OR rol = 'tutor') AND estado = 'activo'
       ORDER BY nombre, apellidos`
    );

    res.json({ tutores: result.rows });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

// Get revisores (for assignment)
router.get('/revisores', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, apellidos, email
       FROM usuarios
       WHERE (es_revisor = true OR rol = 'revisor') AND estado = 'activo'
       ORDER BY nombre, apellidos`
    );

    res.json({ revisores: result.rows });
  } catch (error) {
    console.error('Error fetching revisores:', error);
    res.status(500).json({ error: 'Failed to fetch revisores' });
  }
});

// Get estudiantes (for project assignment)
router.get('/estudiantes', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, apellidos, email
       FROM usuarios
       WHERE rol = 'estudiante' AND estado = 'activo'
       ORDER BY nombre, apellidos`
    );

    res.json({ estudiantes: result.rows });
  } catch (error) {
    console.error('Error fetching estudiantes:', error);
    res.status(500).json({ error: 'Failed to fetch estudiantes' });
  }
});

// Create user (admin only)
router.post('/', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const data = createUserSchema.parse(req.body);

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [data.email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const tags = normalizeDocenteTags(data.rol, data.es_tutor, data.es_revisor);

    // Create user
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, apellidos, email, password_hash, rol, es_tutor, es_revisor, ru)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nombre, apellidos, email, rol, es_tutor, es_revisor, estado, ru, created_at`,
      [data.nombre, data.apellidos, data.email, passwordHash, data.rol, tags.es_tutor, tags.es_revisor, data.ru || null]
    );

    res.status(201).json({ usuario: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (admin only)
router.put('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check email uniqueness if email is being updated
    if (data.email) {
      const emailCheck = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
        [data.email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.nombre !== undefined) {
      updates.push(`nombre = $${paramCount++}`);
      values.push(data.nombre);
    }
    if (data.apellidos !== undefined) {
      updates.push(`apellidos = $${paramCount++}`);
      values.push(data.apellidos);
    }
    if (data.email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.password) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(passwordHash);
    }
    let nextRol: string | undefined;
    if (data.rol !== undefined) {
      updates.push(`rol = $${paramCount++}`);
      values.push(data.rol);
      nextRol = data.rol;
    }
    if (data.estado !== undefined) {
      updates.push(`estado = $${paramCount++}`);
      values.push(data.estado);
    }
    if (data.ru !== undefined) {
      updates.push(`ru = $${paramCount++}`);
      values.push(data.ru);
    }

    if (data.es_tutor !== undefined || data.es_revisor !== undefined || nextRol !== undefined) {
      const currentUser = await pool.query('SELECT rol, es_tutor, es_revisor FROM usuarios WHERE id = $1', [id]);
      const current = currentUser.rows[0];
      const effectiveRol = nextRol || current.rol;
      const tags = normalizeDocenteTags(
        effectiveRol,
        data.es_tutor !== undefined ? data.es_tutor : current.es_tutor,
        data.es_revisor !== undefined ? data.es_revisor : current.es_revisor
      );
      updates.push(`es_tutor = $${paramCount++}`);
      values.push(tags.es_tutor);
      updates.push(`es_revisor = $${paramCount++}`);
      values.push(tags.es_revisor);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, nombre, apellidos, email, rol, es_tutor, es_revisor, estado, ru, created_at`,
      values
    );

    res.json({ usuario: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;

