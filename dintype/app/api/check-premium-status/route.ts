import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter instead of auth session
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    // If no userId provided, return not premium but don't error
    if (!userId) {
      console.log("No userId provided in check-premium-status")
      return NextResponse.json({ isPremium: false, message: "No user ID provided" })
    }

    const supabase = createClient()

    // Check if the user has premium status - don't rely on auth
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_premium, premium_expires_at")
      .eq("id", userId)
      .single()

    if (error) {
      console.warn("Error fetching premium status:", error)
      // Don't return an error, just return not premium
      return NextResponse.json({ isPremium: false, message: "Could not verify premium status" })
    }

    // Check if premium has expired
    let isPremium = false
    if (profile?.is_premium && profile?.premium_expires_at) {
      const expiryDate = new Date(profile.premium_expires_at)
      isPremium = expiryDate > new Date()
    } else {
      isPremium = !!profile?.is_premium
    }

    return NextResponse.json({
      isPremium,
      expiryDate: profile?.premium_expires_at || null,
      userId: userId,
    })
  } catch (error) {
    console.error("Error checking premium status:", error)
    // Don't return an error status code, just return not premium
    return NextResponse.json({
      isPremium: false,
      message: "Error checking premium status",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
