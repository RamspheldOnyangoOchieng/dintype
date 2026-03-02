import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

/**
 * GET - Fetch display settings for a character
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabaseAdmin = await createAdminClient()

        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        const { data: settings, error } = await supabaseAdmin
            .from("character_display_settings")
            .select("*")
            .eq("character_id", id)
            .maybeSingle()

        if (error) {
            console.error("Error fetching display settings:", error)
            return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
        }

        // Default settings if none exist
        if (!settings) {
            return NextResponse.json({
                character_id: id,
                show_age: true,
                show_occupation: true,
                show_personality: true,
                show_hobbies: true,
                show_body: true,
                show_ethnicity: true,
                show_language: true,
                show_relationship: true
            })
        }

        return NextResponse.json(settings)
    } catch (error: any) {
        console.error("Display Settings API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * POST - Save display settings for a character (Admin only)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const supabaseAdmin = await createAdminClient()
        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        // Check if user is admin
        const { data: adminRecord } = await supabaseAdmin
            .from("admin_users")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle()

        if (!adminRecord) {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
        }

        const { data: updatedSettings, error } = await supabaseAdmin
            .from("character_display_settings")
            .upsert({
                character_id: id,
                ...body,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error("Error saving display settings:", error)
            return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
        }

        return NextResponse.json(updatedSettings)
    } catch (error: any) {
        console.error("Display Settings API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
