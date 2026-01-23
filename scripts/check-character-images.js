require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function checkImages() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected to DB');

        const res = await client.query('SELECT id, name, image FROM characters');
        console.log('Current Character Images:');
        res.rows.forEach(row => {
            console.log(`- ${row.name}: ${row.image}`);
        });

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

checkImages();
