
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { isUserAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET(request: Request) {
    try {
        const supabase = await createServerClient()
        if (!supabase) return NextResponse.json({ error: "DB connection failed" }, { status: 500 })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = await isUserAdmin(supabase as any, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const adminClient = await createAdminClient()
        if (!adminClient) return NextResponse.json({ error: "Admin client failed" }, { status: 500 })

        const { data: banners, error } = await adminClient
            .from('banners')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ success: true, banners })
    } catch (error: any) {
        console.error("API Banners GET error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createServerClient()
        if (!supabase) return NextResponse.json({ error: "DB connection failed" }, { status: 500 })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = await isUserAdmin(supabase as any, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const { banner, id } = await request.json()
        const adminClient = await createAdminClient()
        if (!adminClient) return NextResponse.json({ error: "Admin client failed" }, { status: 500 })

        if (id) {
            // Update
            const { error } = await adminClient
                .from('banners')
                .update(banner)
                .eq('id', id)
            if (error) throw error
            return NextResponse.json({ success: true, message: "Banner updated" })
        } else {
            // Insert
            const { data, error } = await adminClient
                .from('banners')
                .insert([banner])
                .select()
            if (error) throw error
            return NextResponse.json({ success: true, banner: data[0] })
        }
    } catch (error: any) {
        console.error("API Banners POST error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        const supabase = await createServerClient()
        if (!supabase) return NextResponse.json({ error: "DB connection failed" }, { status: 500 })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = await isUserAdmin(supabase as any, user.id)
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const adminClient = await createAdminClient()
        if (!adminClient) return NextResponse.json({ error: "Admin client failed" }, { status: 500 })

        const { error } = await adminClient.from('banners').delete().eq('id', id)
        if (error) throw error

        return NextResponse.json({ success: true, message: "Banner deleted" })
    } catch (error: any) {
        console.error("API Banners DELETE error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
