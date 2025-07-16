import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user credits
    const { data: credits, error: creditsError } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (creditsError) {
      console.error("Error fetching credits:", creditsError)
      return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    return NextResponse.json({
      credits: credits || { total_credits: 0, used_credits: 0, remaining_credits: 0 },
      transactions: transactions || [],
    })
  } catch (error) {
    console.error("Error in credits API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
