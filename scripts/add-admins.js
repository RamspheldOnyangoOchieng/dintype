#!/usr/bin/env node

require('dotenv').config();
const https = require('https');
const { Client } = require('pg');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
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

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`API Error ${res.statusCode}: ${parsed.message || data}`));
                    }
                } catch (e) {
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
                    else reject(new Error(`Parse Error ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        if (postData) req.write(JSON.stringify(postData));
        req.end();
    });
}

async function addAdmins() {
    const dbClient = new Client({
        connectionString: POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await dbClient.connect();
        const supabaseHost = new URL(SUPABASE_URL).hostname;

        for (const admin of admins) {
            console.log(`🚀 Adding admin: ${admin.email}`);

            const options = {
                hostname: supabaseHost,
                path: '/auth/v1/admin/users',
                method: 'POST',
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                    'Content-Type': 'application/json'
                }
            };

            const payload = {
                email: admin.email,
                password: admin.password,
                email_confirm: true,
                app_metadata: {
                    role: admin.role,
                    tokens: admin.tokens
                },
                user_metadata: {
                    verified: true
                }
            };

            try {
                const user = await makeRequest(options, payload);
                const userId = user.id;
                console.log(`✅ Created user ${admin.email} (ID: ${userId})`);

                // Add to public.admin_users
                await dbClient.query('INSERT INTO admin_users (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);
                console.log(`✅ Added ${admin.email} to admin_users table`);

                // Add to public.user_tokens
                await dbClient.query('INSERT INTO user_tokens (user_id, balance) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET balance = $2', [userId, admin.tokens]);
                console.log(`✅ Initialized ${admin.tokens} tokens for ${admin.email}`);

            } catch (err) {
                console.error(`❌ Error adding ${admin.email}: ${err.message}`);
            }
        }
    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await dbClient.end();
    }
}

addAdmins();
