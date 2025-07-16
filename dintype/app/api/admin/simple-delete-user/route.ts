import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Get the user ID from the request body
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Get the current user's session to verify admin status
    const cookieStore = cookies()
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to use the simple_delete_user function
    const { data, error } = await supabaseAdmin.rpc("simple_delete_user", {
      auth_id: userId,
    })

    if (error) {
      console.error("Error using simple_delete_user function:", error)
      return NextResponse.json({ error: `Error using simple_delete_user function: ${error.message}` }, { status: 500 })
    }

    if (data === true) {
      return NextResponse.json({ success: true, message: "User deleted successfully" })
    }

    // If the function returned false, try a direct delete from profiles
    try {
      // Try to delete directly from profiles using a raw SQL query
      const rawSql = `
        DELETE FROM profiles 
        WHERE id = ${isNaN(Number.parseInt(userId)) ? "NULL" : Number.parseInt(userId)}
        OR auth_id = '${userId}'
        OR id::text = '${userId}'
      `

      const { error: sqlError } = await supabaseAdmin.rpc("exec_sql", {
        sql: rawSql,
      })

      if (sqlError) {
        console.error("Error with direct SQL delete:", sqlError)
        return NextResponse.json({ error: `Error with direct SQL delete: ${sqlError.message}` }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "User deleted using direct SQL" })
    } catch (sqlError) {
      console.error("Exception in direct SQL delete:", sqlError)
      return NextResponse.json({ error: `Exception in direct SQL delete: ${String(sqlError)}` }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error in simple-delete-user API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
