require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function migrate() {
    if (!POSTGRES_URL) {
        console.error('❌ POSTGRES_URL not found in environment');
        process.exit(1);
    }

    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected to DB');

        const sql = `
            -- Add advanced metadata and trait columns to characters table
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_gender TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_age TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS body_type TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_style TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS art_style TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS hair_color TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS eye_color TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS skin_tone TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS clothing TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS pose TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS background TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS mood TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'girls';
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
            
            -- Storyline specific columns
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS story_conflict TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS story_setting TEXT;
            ALTER TABLE characters ADD COLUMN IF NOT EXISTS story_plot TEXT;

            -- Add comments for clarity
            COMMENT ON COLUMN characters.metadata IS 'Stores advanced AI settings like reference URLs and prompt hooks';
            COMMENT ON COLUMN characters.character_style IS 'Visual style e.g. realistic, anime';
        `;

        await client.query(sql);
        console.log('✅ Character metadata columns added successfully');

    } catch (err) {
        console.error('❌ Error during migration:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
