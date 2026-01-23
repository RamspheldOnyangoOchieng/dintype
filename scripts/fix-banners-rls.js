
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixBannersRLS() {
    console.log('Fixing Banners RLS policies...');

    const sql = `
    -- Drop existing restrictive policies
    DROP POLICY IF EXISTS "Admins can insert banners" ON public.banners;
    DROP POLICY IF EXISTS "Admins can update banners" ON public.banners;
    DROP POLICY IF EXISTS "Admins can delete banners" ON public.banners;

    -- Create new policies without the non-existent is_active column check
    CREATE POLICY "Admins can insert banners"
      ON public.banners
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users 
          WHERE user_id = auth.uid()
        )
      );

    CREATE POLICY "Admins can update banners"
      ON public.banners
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users 
          WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users 
          WHERE user_id = auth.uid()
        )
      );

    CREATE POLICY "Admins can delete banners"
      ON public.banners
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users 
          WHERE user_id = auth.uid()
        )
      );
  `;

    const { data, error } = await supabase.rpc('execute_sql', { sql_query: sql });

    if (error) {
        console.error('Error applying SQL:', error);
    } else {
        console.log('Successfully updated Banner RLS policies.');
    }
}

fixBannersRLS();
