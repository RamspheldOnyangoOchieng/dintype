import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Query to get the structure of the profiles table
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "profiles")

    if (columnsError) {
      console.error("Error fetching profiles table structure:", columnsError)
      return NextResponse.json({ error: columnsError.message }, { status: 500 })
    }

    // Check if there's an auth_id column that might link to auth.users
    const authIdColumn = columns.find((col) => col.column_name === "auth_id")

    // Get a sample row to understand the data
    const { data: sampleRow, error: sampleError } = await supabaseAdmin.from("profiles").select("*").limit(1).single()

    if (sampleError && sampleError.code !== "PGRST116") {
      // PGRST116 is "No rows returned" which is fine
      console.error("Error fetching sample profile:", sampleError)
    }

    return NextResponse.json({
      columns,
      sampleRow: sampleRow || null,
      hasAuthIdColumn: !!authIdColumn,
    })
  } catch (error: any) {
    console.error("Error in inspect-profiles-table API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
