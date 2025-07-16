import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Read the SQL file content
    const sql = `
    -- Create a function to delete users that bypasses RLS policies
    CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER -- This makes the function run with the privileges of the creator
    AS $$
    BEGIN
      -- Delete from auth.users (this will cascade to profiles if set up correctly)
      DELETE FROM auth.users WHERE id = user_id;
      
      -- If you need to delete from other tables, add those deletions here
      -- For example:
      -- DELETE FROM profiles WHERE id = user_id;
      
      -- Return nothing (void)
      RETURN;
    END;
    $$;

    -- Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION public.delete_user(UUID) TO authenticated;
    -- Grant execute permission to anon users if needed
    GRANT EXECUTE ON FUNCTION public.delete_user(UUID) TO anon;
    `

    // Execute the SQL
    const { error } = await supabaseAdmin.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error("Error running migration:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Delete user function created successfully" })
  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
