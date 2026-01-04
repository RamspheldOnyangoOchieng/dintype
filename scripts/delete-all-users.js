#!/usr/bin/env node

/**
 * Delete All Users from Supabase Auth
 * CRITICAL: This will remove EVERY user including admins.
 */

require('dotenv').config();
const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabaseHost = new URL(SUPABASE_URL).hostname;

// Make HTTPS request helper
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    if (data.trim() === '') {
                        resolve({});
                        return;
                    }
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        console.error(`Status: ${res.statusCode}, Error: ${data}`);
                        reject(new Error(`API Error: ${parsed.message || parsed.msg || data}`));
                    }
                } catch (e) {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(`Failed to parse response: ${data}`));
                    }
                }
            });
        });

        req.on('error', reject);
        if (postData) req.write(JSON.stringify(postData));
        req.end();
    });
}

async function deleteAllUsers() {
    try {
        console.log('🛑 DELETING ALL USERS FROM SUPABASE AUTH...');

        // Step 1: List all users
        const listUsersOptions = {
            hostname: supabaseHost,
            path: '/auth/v1/admin/users',
            method: 'GET',
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
            }
        };

        console.log('📡 Fetching user list...');
        const usersData = await makeRequest(listUsersOptions);
        const users = usersData.users || [];

        if (users.length === 0) {
            console.log('✅ No users found to delete.');
            return;
        }

        console.log(`👤 Found ${users.length} users. Starting deletion...`);

        // Step 2: Delete each user
        for (const user of users) {
            const deleteUserOptions = {
                hostname: supabaseHost,
                path: `/auth/v1/admin/users/${user.id}`,
                method: 'DELETE',
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
                }
            };

            try {
                await makeRequest(deleteUserOptions);
                console.log(`🗑️ Deleted user: ${user.email} (${user.id})`);
            } catch (err) {
                console.error(`❌ Failed to delete user ${user.email}:`, err.message);
            }
        }

        console.log('\n✨ All users processed.');

    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        process.exit(1);
    }
}

deleteAllUsers();
