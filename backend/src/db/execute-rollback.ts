import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'proyectos_egresados',
  password: '1234',
  port: 5432
});

async function executeRollback() {
  try {
    console.log('🔄 Ejecutando rollback...');
    
    // Paso 1: Verificar si las columnas existen
    const checkColumns = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'gestiones' 
      AND column_name IN ('semestre', 'materia', 'codigo_materia')
    `;
    
    const columnsResult = await pool.query(checkColumns);
    const existingColumns = columnsResult.rows.map(r => r.column_name);
    
    console.log('✓ Columnas existentes en gestiones:', existingColumns);
    
    // Paso 2: Agregar columnas faltantes
    if (!existingColumns.includes('semestre')) {
      console.log('➕ Agregando columna semestre...');
      await pool.query('ALTER TABLE gestiones ADD COLUMN semestre INTEGER;');
    }
    
    if (!existingColumns.includes('materia')) {
      console.log('➕ Agregando columna materia...');
      await pool.query('ALTER TABLE gestiones ADD COLUMN materia VARCHAR(255);');
    }
    
    if (!existingColumns.includes('codigo_materia')) {
      console.log('➕ Agregando columna codigo_materia...');
      await pool.query('ALTER TABLE gestiones ADD COLUMN codigo_materia VARCHAR(50);');
    }
    
    // Paso 3: Eliminar tablas nuevas si existen
    console.log('🗑️  Eliminando tablas nuevas...');
    await pool.query('DROP TABLE IF EXISTS materia_etapas CASCADE;');
    await pool.query('DROP TABLE IF EXISTS gestion_materias CASCADE;');
    
    // Paso 4: Limpiar columnas agregadas
    console.log('🧹 Limpiando columnas agregadas...');
    
    const checkEtapasColumn = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='etapas' AND column_name='materia_id'
    `);
    if (checkEtapasColumn.rows.length > 0) {
      await pool.query('ALTER TABLE etapas DROP COLUMN materia_id CASCADE;');
    }
    
    const checkEntregasColumn = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='entregas' AND column_name='materia_id'
    `);
    if (checkEntregasColumn.rows.length > 0) {
      await pool.query('ALTER TABLE entregas DROP COLUMN materia_id CASCADE;');
    }
    
    const checkTareasColumn = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='tareas' AND column_name='gestion_materia_id'
    `);
    if (checkTareasColumn.rows.length > 0) {
      await pool.query('ALTER TABLE tareas DROP COLUMN gestion_materia_id CASCADE;');
    }
    
    // Paso 5: Verificar resultado
    console.log('\n✅ Rollback completado exitosamente');
    
    const finalCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gestiones'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Estructura final de gestiones:');
    finalCheck.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar datos
    const countGestiones = await pool.query('SELECT COUNT(*) as total FROM gestiones;');
    console.log(`\n📋 Total de gestiones: ${countGestiones.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error durante rollback:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

executeRollback();
