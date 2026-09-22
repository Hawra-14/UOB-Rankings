const db = require('./db');

async function runMigration() {
  console.log('🚀 Connecting to Turso to add password reset columns...\n');
  
  const columnsToAdd = [
    { name: 'reset_otp', type: 'TEXT' },
    { name: 'reset_token', type: 'TEXT' },
    { name: 'reset_expires_at', type: 'TEXT' }
  ];

  for (const col of columnsToAdd) {
    try {
      await db.execute({ 
        sql: `ALTER TABLE users ADD COLUMN ${col.name} ${col.type}` 
      });
      console.log(`✅ Successfully added column to Turso: ${col.name}`);
    } catch (err) {
      // Turso/SQLite throws a specific error if the column already exists
      if (err.message && err.message.toLowerCase().includes('duplicate column name')) {
        console.log(`ℹ️ Column '${col.name}' already exists in Turso. Skipping.`);
      } else {
        console.error(`❌ Failed to add column '${col.name}':`, err.message);
      }
    }
  }
  
  console.log('\n🎉 Migration complete! Your Turso database is now ready.');
  process.exit(0);
}

runMigration();