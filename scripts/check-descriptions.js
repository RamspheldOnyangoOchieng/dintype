const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function checkDescriptions() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query('SELECT name, description FROM characters');
        
        console.log("--- Character Descriptions ---");
        res.rows.forEach(char => {
            console.log(`[${char.name}]: ${char.description.substring(0, 50)}...`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkDescriptions();
