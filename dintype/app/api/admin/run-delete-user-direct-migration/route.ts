import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // SQL to create the delete_user_direct function
    const sql = `
    -- Create a function to delete users directly via SQL
    CREATE OR REPLACE FUNCTION public.delete_user_direct(user_id UUID)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER -- This makes the function run with the privileges of the creator
    AS $$
    BEGIN
      -- Delete from profiles first
      DELETE FROM public.profiles WHERE id = user_id;
      
      -- Try to delete from auth.users if possible
      BEGIN
        DELETE FROM auth.users WHERE id = user_id;
        EXCEPTION WHEN OTHERS THEN
          -- Ignore errors, we already tried to delete from profiles
          RAISE NOTICE 'Could not delete from auth.users: %', SQLERRM;
      END;
      
      RETURN TRUE;
    END;
    $$;

    -- Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO authenticated;
    -- Grant execute permission to anon users if needed
    GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO anon;
    `

    // Execute the SQL
    const { error } = await supabaseAdmin.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error creating delete_user_direct function:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Delete user direct function created successfully",
    })
  } catch (error: any) {
    console.error("Exception in run-delete-user-direct-migration:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
