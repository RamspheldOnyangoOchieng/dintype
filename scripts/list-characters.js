require('dotenv').config();
const { Client } = require('pg');

async function listCharacters() {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT name, hair_color, eye_color, ethnicity, skin_tone, image FROM characters WHERE name NOT ILIKE 'Maze' LIMIT 20");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listCharacters();
