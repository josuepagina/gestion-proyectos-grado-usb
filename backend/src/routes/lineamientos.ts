import express from 'express';
import multer from 'multer';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { basename, extname, join } from 'path';
import { z } from 'zod';
import { pool } from '../db/connection';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

const uploadRootDir = process.env.UPLOAD_DIR || './uploads';
const lineamientosDir = join(uploadRootDir, 'lineamientos');

if (!existsSync(lineamientosDir)) {
  mkdirSync(lineamientosDir, { recursive: true });
}

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/rtf',
  'application/zip',
  'application/x-zip-compressed',
]);

const allowedExtensions = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.rtf',
  '.zip',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, lineamientosDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = basename(file.originalname).replace(/\s+/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_LINEAMIENTOS || process.env.MAX_FILE_SIZE || '15728640'),
  },
  fileFilter: (_req, file, cb) => {
    const extension = extname(file.originalname).toLowerCase();
    const isValidMime = allowedMimeTypes.has(file.mimetype);
    const isValidExtension = allowedExtensions.has(extension);

    if (isValidMime || isValidExtension) {
      cb(null, true);
      return;
    }

    cb(new Error('Tipo de archivo no permitido. Use PDF, Word, Excel, PowerPoint, TXT, RTF o ZIP.'));
  },
});

const uploadSingleFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload.single('archivo')(req, res, (err: any) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'El archivo excede el tamano permitido' });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    }

    res.status(400).json({ error: err.message || 'No se pudo cargar el archivo' });
  });
};

const createLineamientoSchema = z.object({
  titulo: z.string().trim().min(3, 'El titulo debe tener al menos 3 caracteres').max(255),
});

const updateLineamientoSchema = z.object({
  titulo: z.string().trim().min(3, 'El titulo debe tener al menos 3 caracteres').max(255).optional(),
});

// Get all lineamientos - available for all authenticated users
router.get('/', authenticate, async (_req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT
          l.id,
          l.titulo,
          l.archivo_nombre,
          l.archivo_mime,
          l.archivo_size,
          l.created_at,
          l.updated_at,
          u.nombre AS publicado_por_nombre,
          u.apellidos AS publicado_por_apellidos
       FROM lineamientos l
       LEFT JOIN usuarios u ON l.publicado_por = u.id
       ORDER BY l.created_at DESC`
    );

    res.json({ lineamientos: result.rows });
  } catch (error) {
    console.error('Error fetching lineamientos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los lineamientos' });
  }
});

// Create lineamiento - only administrator
router.post('/', authenticate, authorize('administrador'), uploadSingleFile, async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debe cargar un archivo' });
    }

    const data = createLineamientoSchema.parse(req.body);
    const archivoRuta = join('lineamientos', req.file.filename).replace(/\\/g, '/');

    const result = await pool.query(
      `INSERT INTO lineamientos (titulo, archivo_nombre, archivo_ruta, archivo_mime, archivo_size, publicado_por)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.titulo, req.file.originalname, archivoRuta, req.file.mimetype, req.file.size, req.user!.id]
    );

    res.status(201).json({
      success: true,
      message: 'Lineamiento publicado exitosamente',
      lineamiento: result.rows[0],
    });
  } catch (error) {
    if (req.file) {
      try {
        unlinkSync(join(lineamientosDir, req.file.filename));
      } catch {
        // Ignore cleanup errors
      }
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message || 'Datos invalidos' });
    }

    console.error('Error creating lineamiento:', error);
    res.status(500).json({ error: 'No se pudo publicar el lineamiento' });
  }
});

// Update lineamiento - only administrator
router.put('/:id', authenticate, authorize('administrador'), uploadSingleFile, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = updateLineamientoSchema.parse(req.body);

    const currentResult = await pool.query('SELECT * FROM lineamientos WHERE id = $1', [id]);
    if (currentResult.rows.length === 0) {
      if (req.file) {
        try {
          unlinkSync(join(lineamientosDir, req.file.filename));
        } catch {
          // Ignore cleanup errors
        }
      }
      return res.status(404).json({ error: 'Lineamiento no encontrado' });
    }

    const current = currentResult.rows[0];

    const nextTitulo = data.titulo ?? current.titulo;
    const nextArchivoNombre = req.file ? req.file.originalname : current.archivo_nombre;
    const nextArchivoRuta = req.file
      ? join('lineamientos', req.file.filename).replace(/\\/g, '/')
      : current.archivo_ruta;
    const nextArchivoMime = req.file ? req.file.mimetype : current.archivo_mime;
    const nextArchivoSize = req.file ? req.file.size : current.archivo_size;

    const result = await pool.query(
      `UPDATE lineamientos
       SET titulo = $2,
           archivo_nombre = $3,
           archivo_ruta = $4,
           archivo_mime = $5,
           archivo_size = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, nextTitulo, nextArchivoNombre, nextArchivoRuta, nextArchivoMime, nextArchivoSize]
    );

    if (req.file && current.archivo_ruta) {
      const oldFullPath = join(uploadRootDir, current.archivo_ruta);
      if (existsSync(oldFullPath)) {
        try {
          unlinkSync(oldFullPath);
        } catch {
          // Ignore file deletion errors
        }
      }
    }

    res.json({
      success: true,
      message: 'Lineamiento actualizado exitosamente',
      lineamiento: result.rows[0],
    });
  } catch (error) {
    if (req.file) {
      try {
        unlinkSync(join(lineamientosDir, req.file.filename));
      } catch {
        // Ignore cleanup errors
      }
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message || 'Datos invalidos' });
    }

    console.error('Error updating lineamiento:', error);
    res.status(500).json({ error: 'No se pudo actualizar el lineamiento' });
  }
});

// Delete lineamiento - only administrator
router.delete('/:id', authenticate, authorize('administrador'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM lineamientos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lineamiento no encontrado' });
    }

    const deleted = result.rows[0];

    if (deleted.archivo_ruta) {
      const fullPath = join(uploadRootDir, deleted.archivo_ruta);
      if (existsSync(fullPath)) {
        try {
          unlinkSync(fullPath);
        } catch {
          // Ignore file deletion errors
        }
      }
    }

    res.json({ success: true, message: 'Lineamiento eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting lineamiento:', error);
    res.status(500).json({ error: 'No se pudo eliminar el lineamiento' });
  }
});

// Download lineamiento file - available for all authenticated users
router.get('/:id/download', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT archivo_nombre, archivo_ruta FROM lineamientos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lineamiento no encontrado' });
    }

    const lineamiento = result.rows[0];
    const filePath = join(uploadRootDir, lineamiento.archivo_ruta);

    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'El archivo no existe en el servidor' });
    }

    res.download(filePath, lineamiento.archivo_nombre);
  } catch (error) {
    console.error('Error downloading lineamiento:', error);
    res.status(500).json({ error: 'No se pudo descargar el archivo' });
  }
});

export default router;
