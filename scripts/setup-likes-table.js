const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setup() {
    console.log('🚀 Setting up character_likes table...');

    const { error } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS character_likes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, character_id)
            );

            -- Enable RLS
            ALTER TABLE character_likes ENABLE ROW LEVEL SECURITY;

            -- Create policies
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own likes') THEN
                    CREATE POLICY "Users can view their own likes" ON character_likes FOR SELECT USING (auth.uid() = user_id);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own likes') THEN
                    CREATE POLICY "Users can insert their own likes" ON character_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own likes') THEN
                    CREATE POLICY "Users can delete their own likes" ON character_likes FOR DELETE USING (auth.uid() = user_id);
                END IF;
            END $$;
        `
    });

    if (error) {
        if (error.message.includes('function "exec_sql" does not exist')) {
            console.log('❌ rpc "exec_sql" does not exist. Please run the SQL manually in Supabase SQL Editor:');
            console.log(`
CREATE TABLE IF NOT EXISTS character_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, character_id)
);
            `);
        } else {
            console.error('Error:', error.message);
        }
    } else {
        console.log('✅ Table setup successful!');
    }
}

setup();
