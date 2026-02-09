require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
    console.error('❌ Missing POSTGRES_URL in .env');
    process.exit(1);
}

async function addAllTraitColumns() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        console.log('➕ Adding all character trait columns to characters table...');

        const columns = [
            '"characterGender" TEXT', 'character_gender TEXT',
            '"characterAge" TEXT', 'character_age TEXT',
            '"bodyType" TEXT', 'body_type TEXT',
            '"characterStyle" TEXT', 'character_style TEXT',
            '"artStyle" TEXT', 'art_style TEXT',
            '"hairColor" TEXT', 'hair_color TEXT',
            '"hairStyle" TEXT', 'hair_style TEXT',
            '"eyeColor" TEXT', 'eye_color TEXT',
            '"skinTone" TEXT', 'skin_tone TEXT',
            'clothing TEXT',
            'pose TEXT',
            'background TEXT',
            'mood TEXT',
            '"isStorylineActive" BOOLEAN DEFAULT FALSE',
            'is_storyline_active BOOLEAN DEFAULT FALSE',
            '"storyPlot" TEXT', 'story_plot TEXT',
            '"storySetting" TEXT', 'story_setting TEXT',
            '"storyConflict" TEXT', 'story_conflict TEXT'
        ];

        for (const column of columns) {
            const [name] = column.split(' ');
            const query = `ALTER TABLE characters ADD COLUMN IF NOT EXISTS ${column};`;
            console.log(`Executing: ${query}`);
            try {
                await client.query(query);
                console.log(`  ✅ Added ${name}`);
            } catch (err) {
                console.log(`  ⚠️ Column ${name} may already exist or error: ${err.message}`);
            }
        }

        console.log('✅ All columns added successfully!');
    } catch (err) {
        console.error('❌ Error adding columns:', err.message);
        console.error(err);
    } finally {
        await client.end();
    }
}

addAllTraitColumns();
