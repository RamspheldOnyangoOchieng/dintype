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

        await client.query(`
            ALTER TABLE character_gallery 
            ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;
        `);
        console.log('✅ Added is_primary column to character_gallery');

    } catch (err) {
        console.error('Error migrating table:', err);
    } finally {
        await client.end();
    }
}

migrate();
