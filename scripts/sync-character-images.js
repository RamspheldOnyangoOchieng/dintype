require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function syncImages() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected to DB');

        // 1. Sync image_url to match image for all characters
        const res = await client.query(`
            UPDATE characters 
            SET image_url = image 
            WHERE image_url IS DISTINCT FROM image
        `);
        console.log(`✅ Synced ${res.rowCount} rows: image_url now matches image.`);

        // 2. Identify Supabase URLs that need migration to Cloudinary (Alley case)
        const supabaseRes = await client.query(`
            SELECT id, name, image 
            FROM characters 
            WHERE image LIKE '%supabase.co%' 
               OR (image NOT LIKE 'http%' AND image NOT LIKE 'data:%')
        `);

        if (supabaseRes.rows.length > 0) {
            console.log('\n⚠️ Found characters with Supabase/Local images that need manual regeneration or migration:');
            supabaseRes.rows.forEach(row => {
                console.log(`- ${row.name}: ${row.image}`);
            });
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

syncImages();
