import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { isUserAdmin } from "@/lib/admin-auth"

export async function GET(request: Request) {
    try {
        const { createAdminClient } = await import("@/lib/supabase-admin")
        const supabaseAdmin = await createAdminClient()
        if (!supabaseAdmin) return NextResponse.json({ error: "DB fail" }, { status: 500 })

        // Cookie client only for auth.getUser()
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Admin check via service-role client (bypasses RLS on admin_users)
        const isAdmin = await isUserAdmin(supabaseAdmin, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')

        if (key) {
            const { data: setting, error } = await supabaseAdmin
                .from('settings')
                .select('*')
                .eq('key', key)
                .single()
            if (error && error.code !== 'PGRST116') throw error
            return NextResponse.json({ success: true, value: setting?.value ?? null })
        }

        const { data: settings } = await supabaseAdmin.from('settings').select('*')
        return NextResponse.json({ success: true, settings })
    } catch (error: any) {
        console.error("[GET /api/admin/settings] error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        // Use admin client for all DB operations — bypasses RLS entirely
        const { createAdminClient } = await import("@/lib/supabase-admin")
        const supabaseAdmin = await createAdminClient()
        if (!supabaseAdmin) return NextResponse.json({ error: "DB fail" }, { status: 500 })

        // Cookie client only for getUser() — reading the JWT
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Admin check via service-role client so RLS on admin_users never blocks us
        const isAdmin = await isUserAdmin(supabaseAdmin, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const { key, value } = await request.json()
        if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 })

        // Only upsert columns that actually exist on the settings table (key + value)
        const { error } = await supabaseAdmin
            .from('settings')
            .upsert({ key, value }, { onConflict: 'key' })

        if (error) throw error

        return NextResponse.json({ success: true, message: `Setting ${key} updated` })
    } catch (error: any) {
        console.error("[POST /api/admin/settings] error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
