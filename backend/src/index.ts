import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/connection';
import authRoutes from './routes/auth';
import proyectosRoutes from './routes/proyectos';
import entregasRoutes from './routes/entregas';
import observacionesRoutes from './routes/observaciones';
import notificacionesRoutes from './routes/notificaciones';
import usuariosRoutes from './routes/usuarios';
import bitacorasRoutes from './routes/bitacoras';
import reportesRoutes from './routes/reportes';
import etapasRoutes from './routes/etapas';
import gestionesRoutes from './routes/gestiones';
import tareasRoutes from './routes/tareas';
import materiasRoutes from './routes/materias';
import proyectoEtapasRoutes from './routes/proyecto-etapas';
import lineamientosRoutes from './routes/lineamientos';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectoEtapasRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/entregas', entregasRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/bitacoras', bitacorasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/etapas', etapasRoutes);
app.use('/api/gestiones', gestionesRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/lineamientos', lineamientosRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

