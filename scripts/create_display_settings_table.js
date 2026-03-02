
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

    console.log('Creating character_display_settings table...');
    const statements = sql.split(';').filter(s => s.trim().length > 0);

    for (const s of statements) {
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
