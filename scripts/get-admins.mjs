import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAdmins() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_admin', true);

  if (error) {
    console.error('Error fetching admins:', error.message);
    process.exit(1);
  }

  console.log('\n=== Admin Users ===\n');
  
  if (data && data.length > 0) {
    data.forEach((admin, i) => {
      console.log(`${i + 1}. ${admin.email || admin.username || admin.full_name || 'No identifier'}`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   Username: ${admin.username || 'N/A'}`);
      console.log(`   Full Name: ${admin.full_name || 'N/A'}`);
      console.log(`   Email: ${admin.email || 'N/A'}`);
      console.log(`   Created: ${admin.created_at}`);
      console.log('');
    });
    console.log(`Total: ${data.length} admin(s)`);
  } else {
    console.log('No admin users found.');
  }
}

getAdmins();
