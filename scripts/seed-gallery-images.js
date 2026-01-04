const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function seedGalleryImages() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // Fetch all characters
        const { rows: characters } = await client.query('SELECT id, name, image FROM characters LIMIT 10');
        console.log(`Found ${characters.length} characters`);

        for (const char of characters) {
            console.log(`\nSeeding gallery for ${char.name}...`);
            
            // Check if gallery already has images for this character
            const { rows: existing } = await client.query(
                'SELECT COUNT(*) as count FROM character_gallery WHERE character_id = $1',
                [char.id]
            );
            
            if (parseInt(existing[0].count) > 0) {
                console.log(`  Already has ${existing[0].count} images, skipping.`);
                continue;
            }

            // Add the main character image as a free preview
            if (char.image) {
                await client.query(`
                    INSERT INTO character_gallery (character_id, image_url, is_locked, is_free_preview, is_admin_uploaded, sort_order)
                    VALUES ($1, $2, false, true, true, 0)
                `, [char.id, char.image]);
                console.log(`  ✅ Added free preview image`);
            }

            // Add some placeholder locked images (in real scenario these would be real images)
            const placeholderImages = [
                { locked: true, nsfw: false, cost: 100 },
                { locked: true, nsfw: false, cost: 100 },
                { locked: true, nsfw: true, cost: 100 },
                { locked: true, nsfw: true, cost: 100 },
            ];

            for (let i = 0; i < placeholderImages.length; i++) {
                const img = placeholderImages[i];
                // Using a placeholder blurred image URL - in production these would be real images
                const placeholderUrl = char.image || 'https://via.placeholder.com/400x400?text=Locked';
                
                await client.query(`
                    INSERT INTO character_gallery (character_id, image_url, is_locked, is_nsfw, unlock_cost, is_admin_uploaded, sort_order)
                    VALUES ($1, $2, $3, $4, $5, true, $6)
                `, [char.id, placeholderUrl, img.locked, img.nsfw, img.cost, i + 1]);
            }
            console.log(`  ✅ Added ${placeholderImages.length} locked images`);
        }

        console.log('\n🎉 Gallery seeding complete!');

    } catch (err) {
        console.error('Error seeding gallery:', err);
    } finally {
        await client.end();
    }
}

seedGalleryImages();
