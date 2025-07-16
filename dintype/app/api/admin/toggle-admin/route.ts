import { createClient } from "@/lib/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, isAdmin } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Create a Supabase client with admin privileges
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Update the user's admin status directly in the users_view table
    // This assumes users_view is updatable and has an is_admin column
    const { error } = await supabaseAdmin.from("users_view").update({ is_admin: isAdmin }).eq("id", userId)

    if (error) {
      console.error("Error toggling admin status:", error)
      return NextResponse.json({ error: "Failed to toggle admin status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in toggle-admin API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
