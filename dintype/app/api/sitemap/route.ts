import { NextResponse } from "next/server"
import { generateSitemap } from "@/lib/sitemap-generator"

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app"
    const result = await generateSitemap(baseUrl)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return new NextResponse(result.xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return NextResponse.json({ error: "Failed to generate sitemap" }, { status: 500 })
  }
}
