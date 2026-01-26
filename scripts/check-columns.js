const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    // We can use a trick to list columns by selecting a non-existent column
    // and seeing the error message, or by selecting * from information_schema
    // but since it's Supabase, we can use RPC if available or just check a single record for all keys.
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- Characters Columns ---');
    console.log(Object.keys(data).sort());
}

checkColumns();
