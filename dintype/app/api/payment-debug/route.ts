import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    const days = Number.parseInt(url.searchParams.get("days") || "30")
    const includeStripe = url.searchParams.get("stripe") !== "false"

    // Get current user if no userId is provided
    let currentUserId = userId
    if (!currentUserId) {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      currentUserId = user?.id
    }

    if (!currentUserId) {
      return NextResponse.json({ error: "No user ID provided" }, { status: 400 })
    }

    // Initialize admin client for database operations
    const supabaseAdmin = await createAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Failed to initialize admin client" }, { status: 500 })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch transactions from database
    const { data: transactions, error: txError } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("user_id", currentUserId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false })

    if (txError) {
      console.error("Error fetching transactions:", txError)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    // Fetch payment redirects if the table exists
    let redirects = []
    try {
      const { data: tableExists } = await supabaseAdmin
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_name", "payment_redirects")
        .eq("table_schema", "public")
        .single()

      if (tableExists) {
        const { data: redirectData } = await supabaseAdmin
          .from("payment_redirects")
          .select("*")
          .eq("user_id", currentUserId)
          .order("redirect_timestamp", { ascending: false })

        redirects = redirectData || []
      }
    } catch (err) {
      console.log("Could not fetch payment redirects:", err.message)
    }

    // Check premium status
    let isPremium = false
    try {
      // Check profiles table
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("is_premium")
        .eq("id", currentUserId)
        .single()

      if (profile?.is_premium) {
        isPremium = true
      } else {
        // Check premium_profiles table if it exists
        const { data: premiumTableExists } = await supabaseAdmin
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_name", "premium_profiles")
          .eq("table_schema", "public")
          .single()

        if (premiumTableExists) {
          const { data: premiumProfile } = await supabaseAdmin
            .from("premium_profiles")
            .select("*")
            .eq("user_id", currentUserId)
            .single()

          if (premiumProfile) {
            isPremium = true
          }
        }
      }
    } catch (err) {
      console.log("Error checking premium status:", err.message)
    }

    // Return the data
    return NextResponse.json(
      {
        userId: currentUserId,
        transactions: transactions || [],
        redirects,
        isPremium,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Error in payment-debug API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
