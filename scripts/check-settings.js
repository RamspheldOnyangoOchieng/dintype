const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Settings:', JSON.stringify(data, null, 2));
}

checkSettings();
