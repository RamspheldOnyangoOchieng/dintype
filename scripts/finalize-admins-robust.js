const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

const admins = [
  {
    email: "carlosdcastrosa@gmail.com",
    password: "Cars128321$",
    tokens: 300000
  },
  {
    email: "admin@pocketlove.ai",
    password: "Cars128321$",
    tokens: 300000
  },
  {
    email: "admin.support@pocketlove.ai",
    password: "Admin@pocketlove.ai2026",
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
      console.log(`Processing ${admin.email}...`);

      // 1. Get User ID
      let userId;
      const res = await client.query('SELECT id FROM auth.users WHERE email = $1', [admin.email]);
      
      if (res.rows.length === 0) {
        console.log(`   User missing, inserting into auth.users...`);
        // If user doesn't exist (e.g. if previous script failed completely), insert them correctly now
        const insertUser = await client.query(`
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
            is_sso_user
          ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            $1,
            crypt($2, gen_salt('bf')),
            now(),
            '{"provider": "email", "providers": ["email"], "role": "admin", "tokens": 300000}',
            '{"verified": true}',
            now(),
            now(),
            false
          ) RETURNING id
        `, [admin.email, admin.password]);
        userId = insertUser.rows[0].id;
        console.log(`   Created auth.user: ${userId}`);
      } else {
        userId = res.rows[0].id;
        console.log(`   Found auth.user: ${userId}`);
      }

      // 2. Insert/Update Identity
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
            $1::text, -- provider_id is same as user_id for email provider
            json_build_object('sub', $1::text, 'email', $2::text, 'email_verified', true, 'phone_verified', false),
            'email',
            now(),
            now(),
            now()
          ) ON CONFLICT (provider_id, provider) DO UPDATE SET 
            last_sign_in_at = now(),
            updated_at = now()
        `, [userId, admin.email]);
        console.log(`✅  Identity verified`);
      } catch (err) {
        console.error(`❌  Identity error:`, err.message);
      }

      // 3. Ensure Profile (Trigger might have done it, but let's be safe)
      await client.query(`
        INSERT INTO public.profiles (id, email, username, is_admin, is_premium)
        VALUES ($1, $2, split_part($2, '@', 1), true, true)
        ON CONFLICT (id) DO UPDATE SET is_admin = true, is_premium = true
      `, [userId, admin.email]);

      // 4. Admin Privileges
      await client.query('INSERT INTO public.admin_users (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);

      // 5. Tokens
      await client.query(`
        INSERT INTO public.user_tokens (user_id, balance) 
        VALUES ($1, $2) 
        ON CONFLICT (user_id) DO UPDATE SET balance = $2
      `, [userId, admin.tokens]);
      
      console.log(`✅  Fully configured: Admin + ${admin.tokens} tokens`);
    }

  } catch (err) {
    console.error('Fatal Error:', err);
  } finally {
    await client.end();
  }
}

finalizeAdmins();
