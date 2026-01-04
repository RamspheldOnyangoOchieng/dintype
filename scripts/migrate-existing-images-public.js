const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function migrateExistingImagesToGallery() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // Fetch all characters with images
        const { rows: characters } = await client.query(`
            SELECT id, name, image, images 
            FROM characters 
            WHERE images IS NOT NULL AND array_length(images, 1) > 0
        `);

        console.log(`Found ${characters.length} characters with images`);

        for (const char of characters) {
            console.log(`\nProcessing ${char.name} (${char.id})...`);

            const allImages = [];

            // Add main image first
            if (char.image) {
                allImages.push(char.image);
            }

            // Add all images from the images array
            if (char.images && char.images.length > 0) {
                for (const img of char.images) {
                    if (!allImages.includes(img)) {
                        allImages.push(img);
                    }
                }
            }

            console.log(`  Found ${allImages.length} images to process`);

            for (let i = 0; i < allImages.length; i++) {
                const imgUrl = allImages[i];

                // Check if already exists in gallery
                const { rows: existing } = await client.query(
                    'SELECT id FROM character_gallery WHERE character_id = $1 AND image_url = $2',
                    [char.id, imgUrl]
                );

                if (existing.length > 0) {
                    // Update existing to be FREE/PUBLIC
                    await client.query(`
                        UPDATE character_gallery 
                        SET is_locked = false, is_free_preview = true, updated_at = NOW()
                        WHERE id = $1
                    `, [existing[0].id]);
                    console.log(`  ✅ Updated existing image as PUBLIC: ${imgUrl.substring(0, 50)}...`);
                } else {
                    // Insert as FREE/PUBLIC
                    await client.query(`
                        INSERT INTO character_gallery 
                        (character_id, image_url, is_locked, is_free_preview, is_admin_uploaded, unlock_cost, sort_order)
                        VALUES ($1, $2, false, true, true, 0, $3)
                    `, [char.id, imgUrl, i]);
                    console.log(`  ✅ Added as PUBLIC: ${imgUrl.substring(0, 50)}...`);
                }
            }
        }

        console.log('\n🎉 Migration complete! All existing images are now PUBLIC.');
        console.log('New generated images will be LOCKED by default.');

    } catch (err) {
        console.error('Error migrating images:', err);
    } finally {
        await client.end();
    }
}

migrateExistingImagesToGallery();
