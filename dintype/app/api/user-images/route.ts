import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase/client"
import { getAnonymousUserId } from "@/lib/anonymous-user"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const anonymousId = searchParams.get("anonymous_id")

    console.log("[User Images] Fetching images for anonymous ID:", anonymousId)

    // Get user ID (authenticated or anonymous)
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    let userId: string

    if (session?.user?.id) {
      console.log("[User Images] User is authenticated:", session.user.id)
      userId = session.user.id
    } else if (anonymousId) {
      userId = anonymousId
      console.log("[User Images] Using provided anonymous ID:", userId)
    } else {
      userId = getAnonymousUserId()
      console.log("[User Images] Using generated anonymous ID:", userId)
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = await createAdminClient()
    if (!supabaseAdmin) {
      console.error("[User Images] Failed to create admin client")
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Fetch images for the user
    const { data: images, error } = await supabaseAdmin
      .from("generated_images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[User Images] Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`[User Images] Found ${images?.length || 0} images for user`)

    // Validate image URLs before returning
    const validatedImages = (images || []).map((image) => ({
      ...image,
      image_url: image.image_url || "/placeholder.svg", // Fallback for missing URLs
    }))

    return NextResponse.json({
      images: validatedImages,
      count: validatedImages.length,
      userId: userId,
    })
  } catch (error) {
    console.error("[User Images] Unexpected error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        images: [],
      },
      { status: 500 },
    )
  }
}
