
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

// Emulate the frontend client (anonymous)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetchBanners() {
    console.log('Testing banner fetch from public view (emulating frontend)...');

    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching banners:', error);
        return;
    }

    console.log(`Found ${data.length} banners:`);
    data.forEach((banner, index) => {
        console.log(`${index + 1}. [${banner.is_active ? 'ACTIVE' : 'INACTIVE'}] ${banner.title} (ID: ${banner.id})`);
    });
}

testFetchBanners();
