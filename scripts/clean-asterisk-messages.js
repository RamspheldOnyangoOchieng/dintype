require('dotenv').config();
const { Client } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL;

async function cleanAsterisksFromMessages() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🚀 Connected to DB');

        // Find and update messages containing asterisks used for actions
        const query = {
            text: `
                UPDATE messages 
                SET content = regexp_replace(content, '\\*[^*]+\\*', '', 'g')
                WHERE content ~ '\\*[^*]+\\*'
                RETURNING id, content
            `
        };

        const res = await client.query(query);
        console.log(`✅ Cleaned ${res.rowCount} messages with asterisks`);

        if (res.rowCount > 0) {
            console.log('Sample cleaned messages:');
            res.rows.slice(0, 5).forEach(row => {
                console.log(`  - ID: ${row.id}: "${row.content.substring(0, 100)}..."`);
            });
        }

    } catch (err) {
        console.error('❌ Error cleaning messages:', err.message);
    } finally {
        await client.end();
    }
}

cleanAsterisksFromMessages();
