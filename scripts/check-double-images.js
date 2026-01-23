require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function checkDoubleImages() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected to DB');

        const res = await client.query('SELECT name, image, image_url FROM characters');
        console.log('Character Images (Checking both columns):');
        res.rows.forEach(row => {
            console.log(`- ${row.name}:`);
            console.log(`  image:     ${row.image}`);
            console.log(`  image_url: ${row.image_url}`);
        });

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

checkDoubleImages();
