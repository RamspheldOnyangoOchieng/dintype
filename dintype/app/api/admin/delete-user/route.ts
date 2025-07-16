import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(request: Request) {
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

    // Get the current user's session
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

    // Check if the profiles table has an auth_id column that links to auth.users
    const { data: profileSchema, error: schemaError } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "profiles")
      .eq("column_name", "auth_id")
      .single()

    const hasAuthIdColumn = !schemaError && profileSchema

    // Try multiple approaches to delete the user
    let success = false
    let message = ""

    // First try: Delete the profile using the appropriate method based on schema
    try {
      if (hasAuthIdColumn) {
        // If profiles has auth_id column, delete by auth_id
        const { error: profileError } = await supabaseAdmin.from("profiles").delete().eq("auth_id", userId)

        if (!profileError) {
          success = true
          message = "User profile deleted successfully by auth_id"
        } else {
          console.error("Error deleting profile by auth_id:", profileError)
        }
      } else {
        // Try to use the delete_user_by_uuid function if it exists
        try {
          const { data, error } = await supabaseAdmin.rpc("delete_user_by_uuid", { user_uuid: userId })

          if (!error && data) {
            success = true
            message = "User profile deleted successfully using delete_user_by_uuid function"
          } else {
            console.error("Error using delete_user_by_uuid function:", error)

            // Fallback: Try direct delete from profiles
            const { error: directError } = await supabaseAdmin.from("profiles").delete().eq("id", userId)

            if (!directError) {
              success = true
              message = "User profile deleted successfully by direct delete"
            } else {
              console.error("Error with direct profile delete:", directError)
            }
          }
        } catch (funcError) {
          console.error("Function delete_user_by_uuid failed:", funcError)
        }
      }
    } catch (profileError) {
      console.error("Exception in profile deletion:", profileError)
    }

    // If we successfully deleted the profile, return success
    if (success) {
      return NextResponse.json({ success: true, message })
    }

    // If we get here, all deletion methods failed
    return NextResponse.json({ error: "Failed to delete user after trying all methods" }, { status: 500 })
  } catch (error: any) {
    console.error("Error in delete-user API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
