import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "supabase/migrations/20240513_fix_profiles_id_type.sql")
    let sql

    try {
      sql = fs.readFileSync(sqlFilePath, "utf8")
    } catch (readError) {
      // If file doesn't exist, use inline SQL
      sql = `
      -- Check the current structure of the profiles table
      DO $$
      DECLARE
          column_type TEXT;
      BEGIN
          SELECT data_type INTO column_type
          FROM information_schema.columns
          WHERE table_name = 'profiles' AND column_name = 'id';
          
          RAISE NOTICE 'Current profiles.id type: %', column_type;
          
          -- If the id column is an integer, create a new function that handles this correctly
          IF column_type = 'integer' THEN
              -- Create a function that works with integer IDs
              CREATE OR REPLACE FUNCTION public.delete_user_by_uuid(user_uuid UUID)
              RETURNS BOOLEAN
              LANGUAGE plpgsql
              SECURITY DEFINER
              AS $$
              DECLARE
                  profile_id INTEGER;
              BEGIN
                  -- Find the profile ID that corresponds to this UUID
                  SELECT id INTO profile_id FROM public.profiles 
                  WHERE auth_id = user_uuid::text OR auth_id = user_uuid;
                  
                  IF profile_id IS NOT NULL THEN
                      -- Delete the profile using the integer ID
                      DELETE FROM public.profiles WHERE id = profile_id;
                      RETURN TRUE;
                  END IF;
                  
                  RETURN FALSE;
              END;
              $$;
              
              -- Grant execute permission
              GRANT EXECUTE ON FUNCTION public.delete_user_by_uuid(UUID) TO authenticated;
              GRANT EXECUTE ON FUNCTION public.delete_user_by_uuid(UUID) TO anon;
              
              RAISE NOTICE 'Created delete_user_by_uuid function for integer profile IDs';
          ELSE
              -- Create the standard function for UUID IDs
              CREATE OR REPLACE FUNCTION public.delete_user_direct(user_id UUID)
              RETURNS BOOLEAN
              LANGUAGE plpgsql
              SECURITY DEFINER
              AS $$
              BEGIN
                  -- Delete from profiles first
                  DELETE FROM public.profiles WHERE id = user_id;
                  RETURN TRUE;
              END;
              $$;
              
              -- Grant execute permission
              GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO authenticated;
              GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO anon;
              
              RAISE NOTICE 'Created delete_user_direct function for UUID profile IDs';
          END IF;
      END $$;
      `
    }

    // Execute the SQL
    const { error } = await supabaseAdmin.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error executing SQL:", error)

      // Try alternative method if exec_sql is not available
      try {
        const { error: directError } = await supabaseAdmin.rpc("exec", { query: sql })

        if (directError) {
          throw directError
        }
      } catch (directError) {
        console.error("Error with direct execution:", directError)
        return NextResponse.json({ error: "Failed to execute SQL: " + error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ message: "Migration completed successfully" })
  } catch (error: any) {
    console.error("Error in run-profiles-deletion-fix API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
