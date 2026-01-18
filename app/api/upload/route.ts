import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as string
        const folder = (formData.get("folder") as string) || "storylines"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Upload to Cloudinary using the server-side SDK
        // This is more reliable than direct client-side fetch due to credentials and CORS
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: "auto",
        })

        return NextResponse.json({
            secure_url: result.secure_url,
            public_id: result.public_id,
        })
    } catch (error: any) {
        console.error("Cloudinary upload error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to upload to Cloudinary" },
            { status: 500 }
        )
    }
}
