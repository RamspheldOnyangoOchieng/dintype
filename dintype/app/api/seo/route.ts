import { type NextRequest, NextResponse } from "next/server"
import { getPageSeo } from "@/lib/get-seo"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get("path") || "/"

  try {
    const seoData = await getPageSeo(path)
    return NextResponse.json({ success: true, data: seoData })
  } catch (error) {
    console.error("Error fetching SEO data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch SEO data" }, { status: 500 })
  }
}
