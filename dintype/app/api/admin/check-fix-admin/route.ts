import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get user from session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      return NextResponse.json({
        success: false,
        message: "No active session found",
        error: sessionError?.message,
      })
    }

    const userId = sessionData.session.user.id
    const userEmail = sessionData.session.user.email

    // Check if user exists in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      // If error is not "no rows returned", it's a real error
      return NextResponse.json({
        success: false,
        message: "Error checking profile",
        error: profileError.message,
      })
    }

    // If profile doesn't exist, create it
    if (!profileData) {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          email: userEmail,
          is_admin: true, // Make this user an admin
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        return NextResponse.json({
          success: false,
          message: "Failed to create profile",
          error: insertError.message,
        })
      }
    } else {
      // Profile exists, update admin status
      const { error: updateError } = await supabase.from("profiles").update({ is_admin: true }).eq("id", userId)

      if (updateError) {
        return NextResponse.json({
          success: false,
          message: "Failed to update admin status",
          error: updateError.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin status verified and fixed if needed",
      userId,
      userEmail,
    })
  } catch (error) {
    console.error("Error in check-fix-admin:", error)
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
