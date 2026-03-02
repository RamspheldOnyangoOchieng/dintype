import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

/**
 * GET - Fetch carousel images for a character
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

        const { data: images, error } = await supabaseAdmin
            .from("character_carousel")
            .select("*")
            .eq("character_id", id)
            .eq("is_active", true)
            .order("sort_order", { ascending: true })

        if (error) {
            console.error("Error fetching carousel images:", error)
            return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
        }

        return NextResponse.json(images)
    } catch (error: any) {
        console.error("Carousel API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * POST - Add a new carousel image (Admin only)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { imageUrl, sortOrder = 0 } = body

        if (!imageUrl) {
            return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
        }

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

        const { data: newImage, error } = await supabaseAdmin
            .from("character_carousel")
            .insert([
                {
                    character_id: id,
                    image_url: imageUrl,
                    sort_order: sortOrder,
                    is_active: true
                }
            ])
            .select()
            .single()

        if (error) {
            console.error("Error adding carousel image:", error)
            return NextResponse.json({ error: "Failed to add image" }, { status: 500 })
        }

        return NextResponse.json(newImage)
    } catch (error: any) {
        console.error("Carousel API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * DELETE - Remove a carousel image (Admin only)
 * URL should have ?imageId=...
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: characterId } = await params
        const { searchParams } = new URL(request.url)
        const imageId = searchParams.get("imageId")

        if (!imageId) {
            return NextResponse.json({ error: "imageId is required" }, { status: 400 })
        }

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

        const { error } = await supabaseAdmin
            .from("character_carousel")
            .delete()
            .eq("id", imageId)
            .eq("character_id", characterId) // Extra safety check

        if (error) {
            console.error("Error deleting carousel image:", error)
            return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Carousel API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
