const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function checkVictoria() {
    const { data, error } = await supabase.from('characters').select('id, name, systemPrompt, system_prompt, description, metadata').ilike('name', '%Victoria%').single();
    if (error) { console.error('Error:', error); return; }
    console.log('NAME:', data.name);
    console.log('DESC:', data.description.substring(0, 100));
    console.log('S_CAMEL:', data.systemPrompt);
    console.log('S_SNAKE:', data.system_prompt);
    console.log('META_DET_PROMPT:', data.metadata?.characterDetails?.systemPrompt || data.metadata?.characterDetails?.system_prompt || 'NONE');
}
checkVictoria();
