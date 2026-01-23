require('dotenv').config();
const { Client } = require('pg');

async function checkMaze() {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT id, name, hair_color, eye_color, ethnicity, skin_tone, description, system_prompt FROM characters WHERE name ILIKE 'Maze'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkMaze();
