import { type NextRequest, NextResponse } from "next/server"
import { generateWebsiteSchema, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/schema-markup"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get("path") || "/"

    const [website, organization, breadcrumb] = await Promise.all([
      generateWebsiteSchema(),
      generateOrganizationSchema(),
      generateBreadcrumbSchema(path),
    ])

    return NextResponse.json(
      {
        website,
        organization,
        breadcrumb,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    )
  } catch (error) {
    console.error("Error generating schema markup:", error)
    return NextResponse.json({ error: "Failed to generate schema markup" }, { status: 500 })
  }
}
