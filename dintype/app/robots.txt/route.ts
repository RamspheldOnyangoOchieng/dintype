import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    // Get robots.txt content from the app_settings table
    const supabase = createClient()
    const { data, error } = await supabase.from("app_settings").select("value").eq("id", "robots_txt").single()

    let robotsContent = ""

    if (error || !data) {
      // If no robots.txt is stored, provide a default one
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app"
      robotsContent = `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml`
    } else {
      robotsContent = data.value
    }

    return new NextResponse(robotsContent, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating robots.txt:", error)

    // Return a basic robots.txt in case of error
    return new NextResponse("User-agent: *\nAllow: /", {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
