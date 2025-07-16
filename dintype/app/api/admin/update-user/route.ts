import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    const { userId, username, email } = requestData

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check if the current user is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: currentUserData, error: currentUserError } = await supabase
      .from("users_view")
      .select("is_admin")
      .eq("id", session.user.id)
      .single()

    if (currentUserError || !currentUserData?.is_admin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    // Update the user in the database
    const updates = {}

    if (username !== undefined) {
      updates["username"] = username
    }

    if (email !== undefined) {
      // If email is being updated, we need to update it in auth.users
      const { error: updateAuthError } = await supabase.auth.admin.updateUserById(userId, { email })

      if (updateAuthError) {
        return NextResponse.json({ error: `Failed to update email: ${updateAuthError.message}` }, { status: 500 })
      }
    }

    // Only update the profiles table if we have updates to make
    if (Object.keys(updates).length > 0) {
      const { error: updateProfileError } = await supabase.from("profiles").update(updates).eq("id", userId)

      if (updateProfileError) {
        return NextResponse.json({ error: `Failed to update profile: ${updateProfileError.message}` }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
