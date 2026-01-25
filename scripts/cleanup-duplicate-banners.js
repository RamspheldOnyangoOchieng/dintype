
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDuplicateBanners() {
    console.log('Cleaning up duplicate banners...');

    // 1. Fetch all banners
    const { data: banners, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching banners:', error);
        return;
    }

    const seenTitles = new Set();
    const toDelete = [];

    banners.forEach((banner) => {
        const uniqueKey = `${banner.title.trim().toLowerCase()}_${(banner.imageUrl || '').trim()}`;
        if (seenTitles.has(uniqueKey)) {
            toDelete.push(banner.id);
        } else {
            seenTitles.add(uniqueKey);
        }
    });

    if (toDelete.length === 0) {
        console.log('No duplicates found.');
        return;
    }

    console.log(`Deleting ${toDelete.length} duplicate banners...`);

    const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .in('id', toDelete);

    if (deleteError) {
        console.error('Error deleting duplicates:', deleteError);
    } else {
        console.log('Successfully cleaned up duplicate banners.');
    }
}

cleanupDuplicateBanners();
