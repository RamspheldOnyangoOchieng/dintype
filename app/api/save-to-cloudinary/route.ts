import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Fetch the image directly
    const imageResponse = await fetch(imageUrl)

    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch image from source" }, { status: 500 })
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    // Use Cloudinary SDK instead of direct fetch with presets
    const { v2: cloudinary } = await import("cloudinary")

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "ai-characters",
      resource_type: "image",
    })

    return NextResponse.json({
      secureUrl: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("Error in save-to-cloudinary API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
