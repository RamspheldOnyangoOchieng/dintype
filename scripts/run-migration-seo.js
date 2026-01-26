require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function runMigration() {
    console.log('🔌 Connecting to database...');
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected successfully.');

        const migrationPath = path.join(__dirname, '../supabase/migrations/20260126_create_page_meta.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📜 Running migration from:', migrationPath);
        await client.query(sql);

        console.log('✅ Migration executed successfully.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
