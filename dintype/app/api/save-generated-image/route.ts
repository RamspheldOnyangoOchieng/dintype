import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase/client"
import { getAnonymousUserId } from "@/lib/anonymous-user"

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrl, modelUsed = "novita", language = "sv" } = await request.json()

    console.log("[Save Image] Starting save process...")
    console.log("[Save Image] Prompt:", prompt)
    console.log("[Save Image] Image URL:", imageUrl)
    console.log("[Save Image] Language:", language)

    if (!prompt || !imageUrl) {
      console.error("[Save Image] Missing required fields")
      return NextResponse.json({ error: "Missing required fields: prompt and imageUrl" }, { status: 400 })
    }

    // Validate image URL format
    if (!imageUrl.startsWith("http")) {
      console.error("[Save Image] Invalid image URL format:", imageUrl)
      return NextResponse.json({ error: "Invalid image URL format" }, { status: 400 })
    }

    // Get user ID (authenticated or anonymous)
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    let userId: string

    if (session?.user?.id) {
      console.log("[Save Image] User is authenticated:", session.user.id)
      userId = session.user.id
    } else {
      userId = getAnonymousUserId()
      console.log("[Save Image] Using anonymous ID:", userId)
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = await createAdminClient()
    if (!supabaseAdmin) {
      console.error("[Save Image] Failed to create admin client")
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Check if this image URL already exists for this user to prevent duplicates
    const { data: existingImages } = await supabaseAdmin
      .from("generated_images")
      .select("id")
      .eq("user_id", userId)
      .eq("image_url", imageUrl)
      .limit(1)

    if (existingImages && existingImages.length > 0) {
      console.log("[Save Image] Image already exists for this user:", existingImages[0].id)
      return NextResponse.json(
        {
          message: "Image already saved",
          imageId: existingImages[0].id,
          success: true,
        },
        { status: 200 },
      )
    }

    // Insert the new image with language metadata
    const { data, error } = await supabaseAdmin
      .from("generated_images")
      .insert({
        user_id: userId,
        prompt,
        image_url: imageUrl,
        model_used: modelUsed,
        language: language, // Store the language used for generation
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[Save Image] Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[Save Image] Image saved successfully:", data.id)

    return NextResponse.json({
      success: true,
      image: data,
      message: "Image saved successfully",
    })
  } catch (error) {
    console.error("[Save Image] Unexpected error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to save image to collection",
      },
      { status: 500 },
    )
  }
}
