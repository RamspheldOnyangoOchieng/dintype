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

    // First, check if the user exists in auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userError) {
      console.error("Error fetching user:", userError)
      return NextResponse.json({ error: "User not found: " + userError.message }, { status: 404 })
    }

    // Now, find the corresponding profile
    // First, check if there's a direct match by ID in profiles
    const profileQuery = supabaseAdmin.from("profiles").select("id")

    // Try to find the profile using a raw SQL query which is more flexible
    const { data: profileData, error: profileError } = await supabaseAdmin.rpc("find_profile_by_auth_id", {
      auth_user_id: userId,
    })

    if (profileError) {
      console.error("Error with find_profile_by_auth_id RPC:", profileError)

      // Fallback: Try a direct SQL query
      const rawSql = `
        SELECT id FROM profiles 
        WHERE id = ${isNaN(Number.parseInt(userId)) ? "NULL" : Number.parseInt(userId)}
        OR auth_id = '${userId}'
        OR auth_id = '${userId.toString()}'
        LIMIT 1
      `

      try {
        const { data: rawData, error: rawError } = await supabaseAdmin.rpc("exec_sql", {
          sql: rawSql,
        })

        if (rawError) {
          console.error("Error with raw SQL query:", rawError)
        } else if (rawData && rawData.length > 0) {
          // We found the profile, now delete it
          const profileId = rawData[0].id

          const { error: deleteError } = await supabaseAdmin.from("profiles").delete().eq("id", profileId)

          if (deleteError) {
            console.error("Error deleting profile:", deleteError)
            return NextResponse.json({ error: "Failed to delete profile: " + deleteError.message }, { status: 500 })
          }

          return NextResponse.json({ success: true, message: "Profile deleted successfully" })
        }
      } catch (sqlError) {
        console.error("Exception in raw SQL execution:", sqlError)
      }
    } else if (profileData) {
      // We found the profile using the RPC, now delete it
      const profileId = profileData.id

      const { error: deleteError } = await supabaseAdmin.from("profiles").delete().eq("id", profileId)

      if (deleteError) {
        console.error("Error deleting profile:", deleteError)
        return NextResponse.json({ error: "Failed to delete profile: " + deleteError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Profile deleted successfully" })
    }

    // If we get here, we couldn't find or delete the profile
    // Let's try to create the necessary function and try again
    try {
      // Create a function to find profiles by auth_id
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION public.find_profile_by_auth_id(auth_user_id UUID)
        RETURNS TABLE (id INTEGER)
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT id FROM profiles 
          WHERE auth_id = auth_user_id::text
          OR auth_id = auth_user_id
          LIMIT 1;
        $$;
        
        GRANT EXECUTE ON FUNCTION public.find_profile_by_auth_id(UUID) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.find_profile_by_auth_id(UUID) TO anon;
      `

      const { error: funcError } = await supabaseAdmin.rpc("exec_sql", { sql: createFunctionSql })

      if (funcError) {
        console.error("Error creating find_profile_by_auth_id function:", funcError)
      } else {
        // Try the function again
        const { data: retryData, error: retryError } = await supabaseAdmin.rpc("find_profile_by_auth_id", {
          auth_user_id: userId,
        })

        if (!retryError && retryData) {
          const profileId = retryData.id

          const { error: deleteError } = await supabaseAdmin.from("profiles").delete().eq("id", profileId)

          if (!deleteError) {
            return NextResponse.json({ success: true, message: "Profile deleted successfully after creating function" })
          }
        }
      }
    } catch (funcError) {
      console.error("Exception creating function:", funcError)
    }

    // Last resort: Try to delete the auth user directly
    try {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

      if (!authDeleteError) {
        return NextResponse.json({ success: true, message: "Auth user deleted successfully, but profile may remain" })
      }

      console.error("Error deleting auth user:", authDeleteError)
    } catch (authError) {
      console.error("Exception deleting auth user:", authError)
    }

    return NextResponse.json({ error: "Failed to delete user after trying all methods" }, { status: 500 })
  } catch (error: any) {
    console.error("Error in direct-delete-user API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
