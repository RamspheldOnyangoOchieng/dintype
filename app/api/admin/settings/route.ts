import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { isUserAdmin } from "@/lib/admin-auth"

export async function GET(request: Request) {
    try {
        const supabase = await createServerClient()
        if (!supabase) return NextResponse.json({ error: "DB fail" }, { status: 500 })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = await isUserAdmin(supabase, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')

        let query = supabase.from('settings').select('*')

        if (key) {
            query = query.eq('key', key)
            const { data: settings, error } = await query.single()
            if (error && error.code !== 'PGRST116') throw error
            return NextResponse.json({ success: true, value: settings?.value || null })
        }

        const { data: settings } = await query

        return NextResponse.json({ success: true, settings })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createServerClient()
        if (!supabase) return NextResponse.json({ error: "DB fail" }, { status: 500 })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = await isUserAdmin(supabase, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const { key, value } = await request.json()

        if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 })

        const { createAdminClient } = await import("@/lib/supabase-admin")
        const supabaseAdmin = await createAdminClient()

        const { error } = await supabaseAdmin
            .from('settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

        if (error) throw error

        return NextResponse.json({ success: true, message: `Setting ${key} updated` })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
