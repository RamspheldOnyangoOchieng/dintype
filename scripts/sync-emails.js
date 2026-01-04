const { Client } = require('pg');
require('dotenv').config();

const POSTGRES_URL = process.env.POSTGRES_URL;

async function syncEmails() {
  const client = new Client({
    connectionString: POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    console.log('🔄 Syncing emails to public.profiles...');
    const profilesResult = await client.query(`
      UPDATE public.profiles p
      SET email = u.email,
          username = COALESCE(p.username, split_part(u.email, '@', 1)),
          is_admin = (CASE WHEN u.email IN ('carlosdcastrosa@gmail.com', 'admin@pocketlove.ai', 'admin.support@pocketlove.ai') THEN true ELSE p.is_admin END),
          is_premium = (CASE WHEN u.email IN ('carlosdcastrosa@gmail.com', 'admin@pocketlove.ai', 'admin.support@pocketlove.ai') THEN true ELSE p.is_premium END)
      FROM auth.users u
      WHERE p.id = u.id
      RETURNING p.id, p.email, p.username;
    `);
    console.log(`✅ Updated ${profilesResult.rowCount} profiles.`);

    console.log('🔄 Syncing emails to public.admin_users...');
    const adminUsersResult = await client.query(`
      UPDATE public.admin_users au
      SET email = u.email
      FROM auth.users u
      WHERE au.user_id = u.id
      RETURNING au.user_id, au.email;
    `);
    console.log(`✅ Updated ${adminUsersResult.rowCount} admin_users.`);
    
    // Also ensure they are in the 'admins' table if that table is used
    console.log('🔄 Syncing public.admins table...');
    await client.query(`
      INSERT INTO public.admins (user_id)
      SELECT id FROM auth.users 
      WHERE email IN ('carlosdcastrosa@gmail.com', 'admin@pocketlove.ai', 'admin.support@pocketlove.ai')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Updated public.admins table.');

  } catch (err) {
    console.error('Fatal Error:', err);
  } finally {
    await client.end();
  }
}

syncEmails();
