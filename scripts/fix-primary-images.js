require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function fixPrimaryImages() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected to DB');

        // 1. Get all character IDs
        const charRes = await client.query('SELECT id, name FROM characters');
        const characters = charRes.rows;

        for (const char of characters) {
            // 2. Find primary images in gallery for this character
            const galleryRes = await client.query(
                'SELECT id, image_url, created_at FROM character_gallery WHERE character_id = $1 AND is_primary = true ORDER BY created_at DESC',
                [char.id]
            );

            if (galleryRes.rows.length > 1) {
                console.log(`⚠️  Character ${char.name} has ${galleryRes.rows.length} primary images. Fixing...`);

                // Keep the most recent one as primary
                const primaryId = galleryRes.rows[0].id;

                const updateRes = await client.query(
                    'UPDATE character_gallery SET is_primary = false WHERE character_id = $1 AND id != $2',
                    [char.id, primaryId]
                );

                console.log(`✅ Set 1 image as primary and ${updateRes.rowCount} as non-primary for ${char.name}.`);
            }
        }

        console.log('✨ Gallery primary images normalized.');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

fixPrimaryImages();
