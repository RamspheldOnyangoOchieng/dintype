const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function migrate() {
    if (!POSTGRES_URL) {
        console.error('POSTGRES_URL is not defined');
        return;
    }

    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // 1. Create the suggestions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS profile_photo_suggestion_prompts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                category TEXT NOT NULL, -- 'environment', 'pose', 'outfit', 'lighting', etc.
                label TEXT NOT NULL,    -- Human readable label
                prompt_text TEXT NOT NULL, -- The text to append to the prompt
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('✅ Created profile_photo_suggestion_prompts table');

        // 2. Add sample suggestions
        const suggestions = [
            // Outfits
            ['outfit', 'Casual Wear', 'wearing casual jeans and a t-shirt'],
            ['outfit', 'Formal Dress', 'wearing a sophisticated formal evening dress'],
            ['outfit', 'Professional', 'wearing professional business attire'],
            ['outfit', 'Summer Outfit', 'wearing a light summer breeze dress'],
            ['outfit', 'Bikini', 'wearing a stylish bikini'],
            ['outfit', 'Lingerie', 'wearing elegant lace lingerie'],

            // Poses
            ['pose', 'Standing', 'standing tall and confident'],
            ['pose', 'Sitting', 'sitting gracefully on a chair'],
            ['pose', 'Lying Down', 'lying down comfortably'],
            ['pose', 'Close Up', 'close up portrait shot focusing on the face'],
            ['pose', 'Leaning', 'leaning against a wall'],

            // Environments
            ['environment', 'Bedroom', 'in a cozy luxury bedroom'],
            ['environment', 'Beach', 'at a beautiful tropical beach during sunset'],
            ['environment', 'Office', 'in a modern high-end office'],
            ['environment', 'Studio', 'in a professional photography studio with clean background'],
            ['environment', 'Park', 'in a lush green park with natural lighting'],
            ['environment', 'Living Room', 'in a stylish modern living room'],

            // Lighting
            ['lighting', 'Soft Lighting', 'soft cinematic lighting'],
            ['lighting', 'Golden Hour', 'warm golden hour sunlight'],
            ['lighting', 'Studio Lighting', 'professional studio lighting'],
            ['lighting', 'Neon', 'vibrant neon city lights in the background']
        ];

        for (const [category, label, text] of suggestions) {
            await client.query(
                `INSERT INTO profile_photo_suggestion_prompts (category, label, prompt_text) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT DO NOTHING`,
                [category, label, text]
            );
        }
        console.log('✅ Seeded suggestions');

    } catch (err) {
        console.error('Error migrating table:', err);
    } finally {
        await client.end();
    }
}

migrate();
