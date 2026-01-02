import { neon } from '@neondatabase/serverless';

// Will be run on startup
export async function setupDatabase() {
  try {
    console.log('Checking and updating database schema...');
    const sql = neon(process.env.DATABASE_URL);
    
    // First, check if the meditations table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'meditations'
      );
    `;
    
    const meditationsTableExists = tableExists[0]?.exists || false;
    
    if (!meditationsTableExists) {
      console.log('Creating meditations table');
      await sql`
        CREATE TABLE meditations (
          id SERIAL PRIMARY KEY,
          prompt TEXT NOT NULL,
          content TEXT,
          rating INTEGER,
          model TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      console.log('Meditations table created successfully');
    } else {
      console.log('Meditations table already exists');
      
      // Check if model column exists
      const checkResult = await sql`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'meditations' AND column_name = 'model'
        );
      `;
      
      const modelColumnExists = checkResult[0]?.exists || false;
      
      if (!modelColumnExists) {
        console.log('Adding model column to meditations table');
        await sql`ALTER TABLE meditations ADD COLUMN IF NOT EXISTS model TEXT;`;
        console.log('Model column added successfully');
      } else {
        console.log('Model column already exists');
      }
    }

    // Now check for influencer_events table
    const influencerTableCheck = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'influencer_events'
      );
    `;
    
    if (!influencerTableCheck[0].exists) {
      console.log('Creating influencer_events table');
      await sql`
        CREATE TABLE influencer_events (
          id SERIAL PRIMARY KEY,
          influencer_id TEXT NOT NULL,
          event_type TEXT NOT NULL,
          amount INTEGER DEFAULT 0,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      console.log('influencer_events table created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    // Don't crash the application on migration failure
    return false;
  }
} 