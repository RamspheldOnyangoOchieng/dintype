
const { createClient } = require('@supabase/supabase-js');
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

    const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
    const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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

    console.log('Creating character_carousel table...');
    const statements = sql.split(';').filter(s => s.trim().length > 0);

    for (const s of statements) {
        console.log('Executing:', s.trim().substring(0, 50) + '...');
        const { data, error } = await supabase.rpc('execute_sql', {
            sql_query: s.trim() + ';'
        });

        if (error) {
            console.error('Error executing statement:', error.message);
        } else {
            console.log('✅ Success');
        }
    }
}

run();
