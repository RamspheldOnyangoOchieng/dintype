"use server"

import { createClient } from "@/utils/supabase/server"
import { getAllSeoData } from "./seo-actions"

type SitemapUrl = {
  loc: string
  lastmod?: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

export async function generateSitemap(baseUrl: string) {
  try {
    console.log("[Sitemap] Generating sitemap for", baseUrl)

    // Get all SEO data to find pages
    const seoData = await getAllSeoData()

    // Get all characters for dynamic pages
    const supabase = createClient()
    const { data: characters, error } = await supabase
      .from("characters")
      .select("id, slug, updated_at")
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("[Sitemap] Error fetching characters:", error)
    }

    // Start with static pages from SEO data
    const urls: SitemapUrl[] = Object.keys(seoData.pages).map((page) => ({
      loc: `${baseUrl}${page}`,
      changefreq: "weekly",
      priority: page === "/" ? 1.0 : 0.8,
    }))

    // Add character pages
    if (characters && characters.length > 0) {
      characters.forEach((character) => {
        urls.push({
          loc: `${baseUrl}/character/${character.slug}`,
          lastmod: character.updated_at ? new Date(character.updated_at).toISOString() : undefined,
          changefreq: "weekly",
          priority: 0.7,
        })
      })
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`

    return { success: true, xml }
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error)
    return { success: false, error: String(error) }
  }
}
