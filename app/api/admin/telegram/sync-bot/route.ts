import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { isUserAdmin } from "@/lib/admin-auth"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export async function POST(request: Request) {
    try {
        const supabase = await createServerClient()
        if (!supabase) return NextResponse.json({ error: "DB fail" }, { status: 500 })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = await isUserAdmin(supabase as any, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const { name, short_description, description } = await request.json()

        if (!TELEGRAM_BOT_TOKEN) {
            return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN is not configured" }, { status: 500 })
        }

        const results = []

        // Set Bot Name
        if (name) {
            const res = await fetch(`${API_URL}/setMyName`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            results.push({ action: 'setMyName', status: res.ok, data: await res.json() })
        }

        // Set Short Description (About)
        if (short_description) {
            const res = await fetch(`${API_URL}/setMyShortDescription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ short_description })
            })
            results.push({ action: 'setMyShortDescription', status: res.ok, data: await res.json() })
        }

        // Set Description (What can this bot do?)
        if (description) {
            const res = await fetch(`${API_URL}/setMyDescription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            })
            results.push({ action: 'setMyDescription', status: res.ok, data: await res.json() })
        }

        return NextResponse.json({
            success: true,
            message: "Sync request processed",
            results
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
