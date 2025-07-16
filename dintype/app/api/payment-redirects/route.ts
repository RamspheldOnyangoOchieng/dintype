import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { isAdmin } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the session to check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user is admin
    const adminStatus = await isAdmin(userId)

    if (!adminStatus) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Fetch all payment redirects with user info
    const { data: redirects, error } = await supabase
      .from("payment_redirects")
      .select(`
        *,
        profiles:user_id (
          username,
          email
        )
      `)
      .order("redirect_timestamp", { ascending: false })

    if (error) {
      console.error("Error fetching payment redirects:", error)
      return NextResponse.json({ error: "Failed to fetch payment redirects" }, { status: 500 })
    }

    return NextResponse.json(
      {
        redirects,
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
    console.error("Error in payment-redirects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
