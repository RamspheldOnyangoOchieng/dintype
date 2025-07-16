import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Try to execute the SQL using exec_sql RPC
    try {
      const { data, error } = await supabaseAdmin.rpc("exec_sql", { sql })

      if (error) {
        console.error("Error executing SQL with exec_sql:", error)

        // Try alternative method
        try {
          const { error: directError } = await supabaseAdmin.rpc("exec", { query: sql })

          if (directError) {
            throw directError
          }

          return NextResponse.json({ success: true, message: "SQL executed successfully with exec" })
        } catch (directError) {
          console.error("Error with direct execution:", directError)
          return NextResponse.json({ error: "Failed to execute SQL: " + error.message }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true, data, message: "SQL executed successfully" })
    } catch (error: any) {
      console.error("Exception executing SQL:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error in execute-sql API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
