"use server"

import { getAllSeoData } from "./seo-actions"
import { createClient } from "@/utils/supabase/server"

type WebsiteSchema = {
  "@context": string
  "@type": string
  name: string
  url: string
  potentialAction?: {
    "@type": string
    target: string
    "query-input": string
  }
  sameAs?: string[]
}

type OrganizationSchema = {
  "@context": string
  "@type": string
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
}

type BreadcrumbSchema = {
  "@context": string
  "@type": string
  itemListElement: {
    "@type": string
    position: number
    name: string
    item?: string
  }[]
}

export async function generateWebsiteSchema(): Promise<WebsiteSchema> {
  const seoData = await getAllSeoData()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app"

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoData.global.siteName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export async function generateOrganizationSchema(): Promise<OrganizationSchema> {
  const seoData = await getAllSeoData()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app"

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoData.global.siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: seoData.global.description,
    sameAs: ["https://twitter.com/aicharacterexplorer", "https://facebook.com/aicharacterexplorer"],
  }
}

export async function generateBreadcrumbSchema(path: string): Promise<BreadcrumbSchema> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app"
  const segments = path.split("/").filter(Boolean)

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ]

  let currentPath = ""

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`

    // For character pages, get the actual character name
    if (segments[i - 1] === "character" && segments[i]) {
      const supabase = createClient()
      const { data } = await supabase.from("characters").select("name").eq("slug", segments[i]).single()

      if (data) {
        itemListElement.push({
          "@type": "ListItem",
          position: i + 2,
          name: data.name,
          item: `${baseUrl}${currentPath}`,
        })
        continue
      }
    }

    // Default handling for other pages
    itemListElement.push({
      "@type": "ListItem",
      position: i + 2,
      name: segments[i].charAt(0).toUpperCase() + segments[i].slice(1).replace(/-/g, " "),
      item: `${baseUrl}${currentPath}`,
    })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  }
}
