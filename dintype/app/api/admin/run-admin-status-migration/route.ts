import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Create a Supabase client with admin privileges
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "supabase/migrations/20240512_create_update_admin_status_function.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    const { error } = await supabaseAdmin.rpc("exec_sql", { sql_query: sqlQuery })

    if (error) {
      console.error("Error running migration:", error)
      return NextResponse.json({ error: "Failed to run migration" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Migration executed successfully" })
  } catch (error) {
    console.error("Error in run-admin-status-migration API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
