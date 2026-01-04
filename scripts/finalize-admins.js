const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

const admins = [
    {
        email: "carlosdcastrosa@gmail.com",
        tokens: 300000
    },
    {
        email: "admin@pocketlove.ai",
        tokens: 300000
    },
    {
        email: "admin.support@pocketlove.ai",
        tokens: 300000
    }
];

async function finalizeAdmins() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        for (const admin of admins) {
            console.log(`Finalizing ${admin.email}...`);

            // 1. Get User ID
            const res = await client.query('SELECT id FROM auth.users WHERE email = $1', [admin.email]);
            if (res.rows.length === 0) {
                console.error(`❌ User not found: ${admin.email}`);
                continue;
            }
            const userId = res.rows[0].id;
            console.log(`   ID: ${userId}`);

            // 2. Insert into auth.identities
            // We cast userId to text for the 'id' column
            try {
                await client.query(`
          INSERT INTO auth.identities (
            id,
            user_id,
            provider_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
          ) VALUES (
            gen_random_uuid(), 
            $1::uuid,
            $1::text,
            json_build_object('sub', $1::text, 'email', $3::text),
            'email',
            now(),
            now(),
            now()
          ) ON CONFLICT (provider_id, provider) DO NOTHING
        `, [userId, userId, admin.email]);
                console.log(`✅  Identity created`);
            } catch (err) {
                console.error(`❌  Identity failed: ${err.message}`);
            }

            // 3. Add to admin_users
            try {
                await client.query('INSERT INTO public.admin_users (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);
                console.log(`✅  Admin access granted`);
            } catch (err) {
                console.error(`❌  Admin access failed: ${err.message}`);
            }

            // 4. Update tokens
            try {
                await client.query('INSERT INTO public.user_tokens (user_id, balance) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET balance = $2', [userId, admin.tokens]);
                console.log(`✅  Tokens updated to ${admin.tokens}`);
            } catch (err) {
                console.error(`❌  Tokens update failed: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

finalizeAdmins();
