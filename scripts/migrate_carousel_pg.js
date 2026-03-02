
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
CREATE TABLE IF NOT EXISTS character_carousel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_character_carousel_character_id ON character_carousel(character_id);

-- Enable RLS
ALTER TABLE character_carousel ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'character_carousel' AND policyname = 'Public read access for carousel images'
  ) THEN
    CREATE POLICY "Public read access for carousel images" ON character_carousel
      FOR SELECT USING (TRUE);
  END IF;
END $$;
`;

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');
        await client.query(sql);
        console.log('Successfully created character_carousel table');
    } catch (err) {
        console.error('Error executing SQL:', err.stack);
    } finally {
        await client.end();
    }
}

run();
