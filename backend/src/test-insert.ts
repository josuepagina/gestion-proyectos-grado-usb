import { pool } from './db/connection';

async function testInsert() {
  try {
    console.log('🧪 Testing materia_etapas insert...\n');

    // Get a materia ID
    const materiaRes = await pool.query('SELECT id FROM gestion_materias LIMIT 1');
    const materiaId = materiaRes.rows[0]?.id;
    
    console.log('📝 Using materia ID:', materiaId);

    if (!materiaId) {
      console.error('❌ No materia found');
      return;
    }

    // Create an etapa
    console.log('📝 Creating etapa...');
    const etapaRes = await pool.query(`
      INSERT INTO etapas (
        nombre, descripcion, numero_orden, tipo, estado,
        fecha_apertura, fecha_cierre, fecha_limite_entrega,
        permitir_entregas_fuera_tiempo, descripcion_entrega
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `,  [
      'Test Etapa ' + new Date().toISOString(),
      'Descripción de prueba',
      999,
      'documento',
      'planificada',
      null,
      null,
      null,
      false,
      'Descripción entrega'
    ]);

    const etapaId = etapaRes.rows[0].id;
    console.log('✅ Etapa created:', etapaId);

    // Try to link it
    console.log('📝 Linking etapa to materia...');
    const linkRes = await pool.query(`
      INSERT INTO materia_etapas (materia_id, etapa_id)
      VALUES ($1, $2)
      RETURNING id
    `, [materiaId, etapaId]);

    console.log('✅ Link created:', linkRes.rows[0]);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('❌ Full error:', error);
  } finally {
    await pool.end();
  }
}

testInsert();
