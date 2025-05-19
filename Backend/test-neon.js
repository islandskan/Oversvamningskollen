import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_QwdvlP6ND7Ej@ep-lively-sun-a2xoaodw-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
});

try {
  const res = await pool.query('SELECT current_database(), current_user, inet_server_addr();');
  console.log('✅ Ansluten till databasen:');
  console.table(res.rows);
  process.exit(0);
} catch (err) {
  console.error('❌ Fel vid anslutning till Neon:', err.message);
  process.exit(1);
}
