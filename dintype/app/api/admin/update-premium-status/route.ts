import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    // Get the user ID and premium status from the request body
    const { userId, isPremium } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabaseAdmin = await createAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Failed to initialize admin client" }, { status: 500 })
    }

    // Update the user's premium status in the profiles table
    const { error: profilesError } = await supabaseAdmin
      .from("profiles")
      .update({ is_premium: isPremium })
      .eq("id", userId)

    if (profilesError) {
      console.error("Error updating profiles table:", profilesError)
      return NextResponse.json({ error: "Failed to update profiles table" }, { status: 500 })
    }

    // Check if premium_profiles table exists
    const { data: tableExists } = await supabaseAdmin
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "premium_profiles")
      .eq("table_schema", "public")
      .single()

    // If premium_profiles table exists, update it too
    if (tableExists) {
      try {
        // Check if the user already has a record in premium_profiles
        const { data: existingRecord } = await supabaseAdmin
          .from("premium_profiles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle()

        if (existingRecord) {
          // Update existing record
          await supabaseAdmin
            .from("premium_profiles")
            .update({
              is_premium: isPremium,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
        } else if (isPremium) {
          // Only insert a new record if making the user premium
          await supabaseAdmin.from("premium_profiles").insert({
            user_id: userId,
            is_premium: true,
            plan_duration: "monthly", // Default value
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      } catch (err) {
        console.error("Error updating premium_profiles table:", err)
        // Continue even if this fails, as the main profiles table was updated
      }
    }

    return NextResponse.json({
      success: true,
      message: `User ${userId} premium status updated to ${isPremium ? "premium" : "not premium"}`,
    })
  } catch (error) {
    console.error("Error in update-premium-status API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
