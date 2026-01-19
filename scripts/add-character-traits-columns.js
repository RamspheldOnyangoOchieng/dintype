require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
    console.error('❌ Missing POSTGRES_URL in .env');
    process.exit(1);
}

async function addColumns() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        console.log('➕ Adding hair_color, eye_color, and appearance_style columns to characters table...');

        // Add columns one by one IF NOT EXISTS is not directly supported in all pg versions for columns, 
        // but in Supabase (Postgres 13+) it is supported.
        const queries = [
            'ALTER TABLE characters ADD COLUMN IF NOT EXISTS hair_color TEXT;',
            'ALTER TABLE characters ADD COLUMN IF NOT EXISTS eye_color TEXT;',
            'ALTER TABLE characters ADD COLUMN IF NOT EXISTS appearance_style TEXT;'
        ];

        for (const query of queries) {
            console.log(`Executing: ${query}`);
            await client.query(query);
        }

        console.log('✅ All columns added successfully!');
    } catch (err) {
        console.error('❌ Error adding columns:', err.message);
        console.error(err);
    } finally {
        await client.end();
    }
}

addColumns();
