
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            envVars[key.trim()] = valueParts.join('=').trim();
        }
    });

    const connectionString = envVars.POSTGRES_URL_NON_POOLING || envVars.POSTGRES_URL;

    if (!connectionString) {
        console.error('❌ Missing POSTGRES_URL in .env file');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    const sql = `
CREATE TABLE IF NOT EXISTS character_display_settings (
  character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  show_age BOOLEAN DEFAULT TRUE,
  show_occupation BOOLEAN DEFAULT TRUE,
  show_personality BOOLEAN DEFAULT TRUE,
  show_hobbies BOOLEAN DEFAULT TRUE,
  show_body BOOLEAN DEFAULT TRUE,
  show_ethnicity BOOLEAN DEFAULT TRUE,
  show_language BOOLEAN DEFAULT TRUE,
  show_relationship BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE character_display_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'character_display_settings' AND policyname = 'Public read access for display settings'
  ) THEN
    CREATE POLICY "Public read access for display settings" ON character_display_settings
      FOR SELECT USING (TRUE);
  END IF;
END $$;
`;

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');
        await client.query(sql);
        console.log('Successfully created character_display_settings table');
    } catch (err) {
        console.error('Error executing SQL:', err.stack);
    } finally {
        await client.end();
    }
}

run();
