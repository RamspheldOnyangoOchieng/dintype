require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function fixMaze() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected to DB');

        const query = {
            text: "UPDATE characters SET hair_color = $1, eye_color = $2, skin_tone = $3, ethnicity = $4 WHERE name ILIKE $5",
            values: ['blonde', 'blue', 'light tan', 'Latina', 'Maze']
        };

        const res = await client.query(query);
        console.log(`✅ Updated ${res.rowCount} characters named Maze`);

    } catch (err) {
        console.error('❌ Error updating Maze:', err.message);
    } finally {
        await client.end();
    }
}

fixMaze();
