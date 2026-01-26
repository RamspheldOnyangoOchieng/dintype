const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVictoria() {
    const { data, error } = await supabase
        .from('characters')
        .select('id, name, system_prompt, description, metadata')
        .ilike('name', '%Victoria%')
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- Victoria Data ---');
    console.log('ID:', data.id);
    console.log('Name:', data.name);
    console.log('System Prompt:', data.system_prompt);
    console.log('Description:', data.description);
    console.log('Metadata Character Details:', data.metadata?.characterDetails ? 'FOUND' : 'MISSING');
    console.log('System Prompt in Metadata:', data.metadata?.characterDetails?.system_prompt || 'MISSING');
}

checkVictoria();
