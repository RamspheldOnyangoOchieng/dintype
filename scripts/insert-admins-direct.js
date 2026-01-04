const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

const admins = [
    {
        email: "carlosdcastrosa@gmail.com",
        password: "Cars128321$",
        role: "admin",
        tokens: 300000
    },
    {
        email: "admin@pocketlove.ai",
        password: "Cars128321$",
        role: "admin",
        tokens: 300000
    },
    {
        email: "admin.support@pocketlove.ai",
        password: "Admin@pocketlove.ai2026",
        role: "admin",
        tokens: 300000
    }
];

async function insertAdminsDirect() {
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Ensure pgcrypto extension is available for password hashing
        await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

        for (const admin of admins) {
            console.log(`Processing ${admin.email}...`);

            try {
                // 1. Insert into auth.users using pgcrypto for password hashing
                // instance_id is typically '00000000-0000-0000-0000-000000000000' for default instance
                const insertUserQuery = `
          INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
          ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            $1,
            crypt($2, gen_salt('bf')), 
            now(),
            $3,
            $4,
            now(),
            now(),
            '',
            '',
            '',
            ''
          )
          RETURNING id;
        `;

                const appMeta = {
                    provider: "email",
                    providers: ["email"],
                    role: admin.role,
                    tokens: admin.tokens
                };

                const userMeta = {
                    verified: true
                };

                const res = await client.query(insertUserQuery, [
                    admin.email,
                    admin.password,
                    JSON.stringify(appMeta),
                    JSON.stringify(userMeta)
                ]);

                const userId = res.rows[0].id;
                console.log(`✅ Inserted auth.user: ${userId}`);

                // 2. Insert into auth.identities (GoTrue needs this for login to work properly usually)
                const insertIdentityQuery = `
          INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
          ) VALUES (
            $1,
            $1,
            json_build_object('sub', $1::text, 'email', $2::text),
            'email',
            now(),
            now(),
            now()
          );
        `;
                await client.query(insertIdentityQuery, [userId, admin.email]);
                console.log(`✅ Inserted auth.identity`);

                // 3. Ensure admin_users and user_tokens (Trigger might have done this, but we force correct values)
                await client.query('INSERT INTO public.admin_users (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);
                await client.query('INSERT INTO public.user_tokens (user_id, balance) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET balance = $2', [userId, admin.tokens]);
                console.log(`✅ Configured admin privileges and tokens`);

            } catch (err) {
                console.error(`❌ Failed to process ${admin.email}:`, err.message);
                if (err.detail) console.error(`   Detail: ${err.detail}`);
                if (err.hint) console.error(`   Hint: ${err.hint}`);
                if (err.where) console.error(`   Where: ${err.where}`);
            }
        }

    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

insertAdminsDirect();
