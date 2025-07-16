import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { isAdmin } from "@/lib/auth-utils"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the session to check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user is admin
    const adminStatus = await isAdmin(userId)

    if (!adminStatus) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "supabase/migrations/20240510_create_payment_redirects.sql")
    const sql = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      console.error("Error running payment redirects migration:", error)
      return NextResponse.json({ error: "Failed to run migration" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in run-payment-redirects-migration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
