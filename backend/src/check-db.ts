import { pool } from './db/connection';

async function checkTables() {
  try {
    console.log('🔍 Checking tables...');
    
    // Check if materia_etapas exists
    const mataresResult = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'materia_etapas'
      );
    `);
    
    console.log('✅ materia_etapas table exists:', mataresResult.rows[0].exists);

    // Check gestion_materias
    const gmResult = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'gestion_materias'
      );
    `);
    
    console.log('✅ gestion_materias table exists:', gmResult.rows[0].exists);

    // List all tables
    const allTablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 All tables in database:');
    allTablesResult.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });

    // Check gestion_materias data
    const gmDataResult = await pool.query('SELECT COUNT(*) as count FROM gestion_materias');
    console.log(`\n📊 gestion_materias records: ${gmDataResult.rows[0].count}`);

    if (gmDataResult.rows[0].count > 0) {
      const sampleResult = await pool.query('SELECT id, gestion_id, materia FROM gestion_materias LIMIT 3');
      console.log('📝 Sample records:');
      sampleResult.rows.forEach((row: any) => {
        console.log(`  - ID: ${row.id}, Gestion: ${row.gestion_id}, Materia: ${row.materia}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkTables();
