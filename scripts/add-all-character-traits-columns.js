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
            'character_gender TEXT',
            'character_age TEXT',
            'body_type TEXT',
            'character_style TEXT',
            'art_style TEXT',
            'hair_color TEXT',
            'eye_color TEXT',
            'skin_tone TEXT',
            'clothing TEXT',
            'pose TEXT',
            'background TEXT',
            'mood TEXT'
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
