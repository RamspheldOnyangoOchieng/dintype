import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "100", 10)

    const supabase = createClient()

    // Build query with filters
    let query = supabase.from("payments").select("*").order("created_at", { ascending: false })

    // Apply date filters if provided
    if (from) {
      query = query.gte("created_at", from)
    }

    if (to) {
      // Add one day to include the end date fully
      const toDate = new Date(to)
      toDate.setDate(toDate.getDate() + 1)
      query = query.lt("created_at", toDate.toISOString())
    }

    // Apply user filter if provided
    if (userId) {
      query = query.eq("user_id", userId)
    }

    // Apply limit
    query = query.limit(limit)

    // Execute query
    const { data: transactions, error } = await query

    if (error) {
      console.error("Error fetching payment transactions:", error)
      return NextResponse.json({ error: "Failed to fetch payment transactions" }, { status: 500 })
    }

    // Check if payment_redirects table exists without causing an error
    const { data: tableExists } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "payment_redirects")
      .eq("table_schema", "public")
      .single()

    // Only try to fetch from payment_redirects if the table exists
    let redirects = []
    if (tableExists) {
      try {
        let redirectsQuery = supabase
          .from("payment_redirects")
          .select("*")
          .eq("is_premium", true)
          .order("redirect_timestamp", { ascending: false })

        // Apply date filters if provided
        if (from) {
          redirectsQuery = redirectsQuery.gte("redirect_timestamp", from)
        }

        if (to) {
          // Add one day to include the end date fully
          const toDate = new Date(to)
          toDate.setDate(toDate.getDate() + 1)
          redirectsQuery = redirectsQuery.lt("redirect_timestamp", toDate.toISOString())
        }

        // Apply user filter if provided
        if (userId) {
          redirectsQuery = redirectsQuery.eq("user_id", userId)
        }

        // Apply limit
        redirectsQuery = redirectsQuery.limit(limit)

        const { data } = await redirectsQuery
        redirects = data || []
      } catch (err) {
        // Silently handle any errors with payment_redirects
        console.log("Could not fetch payment redirects:", err.message)
      }
    }

    // Combine transactions with any payment redirects that aren't already in the transactions list
    const combinedTransactions = [...transactions]

    // If we have redirects, check if any need to be added to the transactions list
    if (redirects.length > 0) {
      const existingIds = new Set(transactions.map((t) => t.stripe_session_id || t.payment_intent_id))

      for (const redirect of redirects) {
        if (redirect.payment_intent_id && !existingIds.has(redirect.payment_intent_id)) {
          // This is a successful payment redirect that's not in the transactions table yet
          combinedTransactions.push({
            id: redirect.id,
            user_id: redirect.user_id,
            amount: 0, // We don't know the amount yet
            currency: "SEK",
            status: "completed",
            payment_method: "Credit Card",
            created_at: redirect.redirect_timestamp,
            stripe_session_id: redirect.payment_intent_id,
            payment_intent_id: redirect.payment_intent_id,
            _source: "redirect", // Mark this as coming from redirects
          })
        }
      }
    }

    return NextResponse.json(
      {
        transactions: combinedTransactions,
        hasRedirectsTable: !!tableExists,
        timestamp: new Date().toISOString(),
        filters: {
          from: from || null,
          to: to || null,
          userId: userId || null,
          limit,
        },
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
    console.error("Error in payment-transactions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
