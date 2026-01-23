require('dotenv').config();
const { Client } = require('pg');

async function checkMazeImage() {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT name, image_url, image FROM characters WHERE name ILIKE 'Maze'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkMazeImage();
