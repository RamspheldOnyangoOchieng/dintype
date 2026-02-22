const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function searchAndReplaceBrand() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // List all tables
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    `);

        for (const row of res.rows) {
            const tableName = row.table_name;

            // Get text/json columns
            const cols = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = $1 
          AND (data_type IN ('text', 'character varying', 'jsonb', 'json'))
      `, [tableName]);

            for (const col of cols.rows) {
                const colName = col.column_name;
                const dataType = col.data_type; // 'text', 'jsonb', etc.

                let checkQuery;
                if (dataType === 'jsonb' || dataType === 'json') {
                    checkQuery = `SELECT count(*) FROM "${tableName}" WHERE "${colName}"::text ILIKE '%YourFantasy%' OR "${colName}"::text ILIKE '%Dintyp%'`;
                } else {
                    checkQuery = `SELECT count(*) FROM "${tableName}" WHERE "${colName}" ILIKE '%YourFantasy%' OR "${colName}" ILIKE '%Dintyp%'`;
                }

                try {
                    const countRes = await client.query(checkQuery);
                    const count = parseInt(countRes.rows[0].count);

                    if (count > 0) {
                        console.log(`⚠️  Found ${count} matches for YourFantasy/Dintyp in table '${tableName}', column '${colName}'`);

                        // Perform Update
                        let updateQuery;
                        if (dataType === 'jsonb' || dataType === 'json') {
                            // JSON replacement is tricky, we'll just REPLACE on the text representation which is risky but often works for simple string replacements
                            updateQuery = `
                 UPDATE "${tableName}" 
                 SET "${colName}" = REPLACE(REPLACE("${colName}"::text, 'YourFantasy.ai', 'Dintype.se'), 'YourFantasy', 'Dintype')::jsonb 
                 WHERE "${colName}"::text ILIKE '%YourFantasy%';
                 
                 UPDATE "${tableName}" 
                 SET "${colName}" = REPLACE(REPLACE("${colName}"::text, 'Dintyp.se', 'Dintype.se'), 'Dintyp', 'Dintype')::jsonb 
                 WHERE "${colName}"::text ILIKE '%Dintyp%';
               `;
                        } else {
                            updateQuery = `
                 UPDATE "${tableName}" 
                 SET "${colName}" = REPLACE(REPLACE("${colName}", 'YourFantasy.ai', 'Dintype.se'), 'YourFantasy', 'Dintype') 
                 WHERE "${colName}" ILIKE '%YourFantasy%';

                 UPDATE "${tableName}" 
                 SET "${colName}" = REPLACE(REPLACE("${colName}", 'Dintyp.se', 'Dintype.se'), 'Dintyp', 'Dintype') 
                 WHERE "${colName}" ILIKE '%Dintyp%';
               `;
                        }

                        await client.query(updateQuery);
                        console.log(`✅  Updated '${tableName}'.'${colName}'`);
                    }
                } catch (err) {
                    console.log(`Error checking/updating ${tableName}.${colName}: ${err.message}`);
                }
            }
        }

    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

searchAndReplaceBrand();
