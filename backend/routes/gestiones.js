// ...existing imports...
const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión a postgres

// Obtener todas las gestiones con sus materias
router.get('/', async (req, res) => {
  try {
    const gestionesRes = await db.query('SELECT * FROM gestiones ORDER BY created_at DESC');
    const gestiones = gestionesRes.rows;

    // Obtener materias asociadas
    const materiasRes = await db.query('SELECT * FROM gestion_materias');
    const materias = materiasRes.rows;

    // Asociar materias a cada gestión
    const gestionesWithMaterias = gestiones.map(g => ({
      ...g,
      materias: materias.filter(m => m.gestion_id === g.id)
    }));

    res.json({ gestiones: gestionesWithMaterias });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener gestiones' });
  }
});

// Crear una nueva gestión con materias
router.post('/', async (req, res) => {
  const { nombre, materias, descripcion } = req.body;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const gestionRes = await client.query(
      'INSERT INTO gestiones (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    const gestion = gestionRes.rows[0];

    for (const mat of materias) {
      await client.query(
        'INSERT INTO gestion_materias (gestion_id, semestre, materia, codigo_materia) VALUES ($1, $2, $3, $4)',
        [gestion.id, mat.semestre, mat.materia, mat.codigo_materia]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ message: 'Gestión creada exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error al crear gestión' });
  } finally {
    client.release();
  }
});

// Actualizar una gestión y sus materias
router.put('/:id', async (req, res) => {
  const { nombre, materias, descripcion } = req.body;
  const { id } = req.params;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE gestiones SET nombre=$1, descripcion=$2, updated_at=NOW() WHERE id=$3',
      [nombre, descripcion, id]
    );
    // Eliminar materias anteriores
    await client.query('DELETE FROM gestion_materias WHERE gestion_id=$1', [id]);
    // Insertar nuevas materias
    for (const mat of materias) {
      await client.query(
        'INSERT INTO gestion_materias (gestion_id, semestre, materia, codigo_materia) VALUES ($1, $2, $3, $4)',
        [id, mat.semestre, mat.materia, mat.codigo_materia]
      );
    }
    await client.query('COMMIT');
    res.json({ message: 'Gestión actualizada exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error al actualizar gestión' });
  } finally {
    client.release();
  }
});

// Archivar (eliminar lógica) una gestión
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE gestiones SET estado=$1, updated_at=NOW() WHERE id=$2', ['archivada', id]);
    res.json({ message: 'Gestión archivada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al archivar gestión' });
  }
});

module.exports = router;
