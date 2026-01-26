import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET() {
    try {
        const supabase = await createAdminClient()
        if (!supabase) {
            return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
        }

        // Get total tokens balance across all users
        const { data: tokensData, error: tokensError } = await supabase
            .from("user_tokens")
            .select("balance")

        const totalTokens = (tokensData || []).reduce((sum, item) => sum + (item.balance || 0), 0)

        // Get total credits balance across all users
        const { data: creditsData, error: creditsError } = await supabase
            .from("user_credits")
            .select("balance")

        const totalCredits = (creditsData || []).reduce((sum, item) => sum + (Number(item.balance) || 0), 0)

        // Get count of premium members
        const { count: premiumCount, error: premiumError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("is_premium", true)

        // Get monthly API costs from cost_logs
        const today = new Date()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const { data: costData, error: costError } = await supabase
            .from("cost_logs")
            .select("api_cost")
            .gte("created_at", firstDayOfMonth.toISOString())

        const monthlyApiCost = (costData || []).reduce((sum, item) => sum + (item.api_cost || 0), 0)

        return NextResponse.json({
            totalTokens,
            totalCredits,
            premiumCount: premiumCount || 0,
            monthlyApiCost
        })
    } catch (error: any) {
        console.error("Stats API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
