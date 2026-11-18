import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const getJwtExpiresIn = (): jwt.SignOptions['expiresIn'] => {
  return (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d';
};

const router = express.Router();

const registerSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellidos: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  rol: z.enum(['estudiante', 'tutor', 'revisor', 'administrador']),
  es_tutor: z.boolean().optional(),
  es_revisor: z.boolean().optional(),
  ru: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const getDocenteTags = (rol: string, esTutor?: boolean, esRevisor?: boolean) => {
  const normalizedTutor = rol === 'administrador' || rol === 'estudiante' ? false : (esTutor ?? rol === 'tutor');
  const normalizedRevisor = rol === 'administrador' || rol === 'estudiante' ? false : (esRevisor ?? rol === 'revisor');
  return { es_tutor: normalizedTutor, es_revisor: normalizedRevisor };
};

// Register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
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

    const tags = getDocenteTags(data.rol, data.es_tutor, data.es_revisor);

    // Create user
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, apellidos, email, password_hash, rol, es_tutor, es_revisor, ru)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nombre, apellidos, email, rol, es_tutor, es_revisor, estado, ru`,
      [data.nombre, data.apellidos, data.email, passwordHash, data.rol, tags.es_tutor, tags.es_revisor, data.ru || null]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET!,
      { expiresIn: getJwtExpiresIn() }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        es_tutor: user.es_tutor,
        es_revisor: user.es_revisor,
        ru: user.ru,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const result = await pool.query(
      'SELECT id, nombre, apellidos, email, password_hash, rol, es_tutor, es_revisor, estado, ru FROM usuarios WHERE email = $1',
      [data.email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (user.estado !== 'activo') {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET!,
      { expiresIn: getJwtExpiresIn() }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        es_tutor: user.es_tutor,
        es_revisor: user.es_revisor,
        ru: user.ru,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, apellidos, email, rol, es_tutor, es_revisor, estado, created_at FROM usuarios WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;

