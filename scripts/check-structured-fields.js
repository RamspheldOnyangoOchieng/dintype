const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function checkFields() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        // Check for common Swedish terms remaining
        const res = await client.query(`
            SELECT name, occupation, personality, body, relationship 
            FROM characters 
            WHERE 
                occupation IN ('Universitetsstudent', 'Student', 'Lärare', 'Sjuksköterska', 'Ingenjör') OR
                personality IN ('Sportig', 'Lekfull', 'Nyfiken', 'Busig', 'Snäll', 'Intelligent', 'Rolig', 'Seriös', 'Driven') OR
                body IN ('Atletisk', 'Kurvig', 'Smal', 'Alldaglig', 'Muskulös') OR
                relationship IN ('Singel', 'Gift', 'Dejtar', 'Komplicerat')
        `);

        if (res.rows.length > 0) {
            console.log("--- Remaining Swedish Fields ---");
            res.rows.forEach(char => {
                console.log(`[${char.name}]: Occ=${char.occupation}, Pers=${char.personality}, Body=${char.body}, Rel=${char.relationship}`);
            });
        } else {
            console.log("✅ No common Swedish terms found in structured fields!");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkFields();
