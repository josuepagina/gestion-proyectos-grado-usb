import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
    es_tutor: boolean;
    es_revisor: boolean;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      rol: string;
    };

    // Verify user still exists and is active
    const result = await pool.query(
      'SELECT id, email, rol, estado, es_tutor, es_revisor FROM usuarios WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    if (user.estado !== 'activo') {
      return res.status(401).json({ error: 'User is inactive' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      es_tutor: !!user.es_tutor,
      es_revisor: !!user.es_revisor,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized - No user in request' });
    }

    const hasRole = roles.some((role) => {
      if (role === 'administrador') return req.user!.rol === 'administrador';
      if (role === 'estudiante') return req.user!.rol === 'estudiante';
      if (role === 'tutor') return req.user!.es_tutor || req.user!.rol === 'tutor';
      if (role === 'revisor') return req.user!.es_revisor || req.user!.rol === 'revisor';
      return req.user!.rol === role;
    });

    if (!hasRole) {
      return res.status(403).json({ success: false, error: `Forbidden - User role '${req.user.rol}' not allowed. Required: ${roles.join(', ')}` });
    }

    next();
  };
};

