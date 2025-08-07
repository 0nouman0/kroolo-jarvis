import { sql } from './db.js';

async function migrateFrameworksColumn() {
  try {
    console.log('🔄 Migrating frameworks column from text[] to jsonb...');
    
    // First, check if the table exists and what the current column type is
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'analysis_history' 
      AND column_name = 'frameworks'
    `;
    
    console.log('Current frameworks column info:', tableInfo);
    
    if (tableInfo.length > 0) {
      const currentType = tableInfo[0].data_type;
      console.log('Current frameworks column type:', currentType);
      
      if (currentType === 'ARRAY' || currentType === 'text[]') {
        console.log('Converting from array to jsonb...');
        
        // Step 1: Create a backup column
        await sql`ALTER TABLE analysis_history ADD COLUMN frameworks_backup text[]`;
        
        // Step 2: Copy current data to backup
        await sql`UPDATE analysis_history SET frameworks_backup = frameworks`;
        
        // Step 3: Drop the current column
        await sql`ALTER TABLE analysis_history DROP COLUMN frameworks`;
        
        // Step 4: Create new jsonb column
        await sql`ALTER TABLE analysis_history ADD COLUMN frameworks jsonb`;
        
        // Step 5: Convert data from backup to jsonb format
        await sql`
          UPDATE analysis_history 
          SET frameworks = to_jsonb(frameworks_backup)
          WHERE frameworks_backup IS NOT NULL
        `;
        
        // Step 6: Drop backup column
        await sql`ALTER TABLE analysis_history DROP COLUMN frameworks_backup`;
        
        console.log('✅ Migration completed successfully');
      } else if (currentType === 'jsonb') {
        console.log('✅ Column is already jsonb type, no migration needed');
      } else {
        console.log('🔄 Unknown type, converting to jsonb...');
        await sql`ALTER TABLE analysis_history ALTER COLUMN frameworks TYPE jsonb USING frameworks::jsonb`;
        console.log('✅ Migration completed successfully');
      }
    } else {
      console.log('⚠️ Frameworks column not found, it may need to be created');
      await sql`ALTER TABLE analysis_history ADD COLUMN frameworks jsonb`;
      console.log('✅ Created frameworks column as jsonb');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateFrameworksColumn().then(() => {
  console.log('🏁 Migration script completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Migration script failed:', error);
  process.exit(1);
});
