"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { getGlobalSeoFromLocalStorage, getPageSeoFromLocalStorage, getDefaultSeoData } from "@/lib/local-storage-seo"

export default function SEO() {
  const pathname = usePathname()
  const [seo, setSeo] = useState({
    siteName: "AI Character Explorer",
    titleTemplate: "%s | AI Character Explorer",
    title: "AI Character Explorer",
    description: "Explore and chat with AI characters in a fun and interactive way.",
    keywords: "AI, characters, chat, virtual companions, artificial intelligence",
    ogImage: "/og-image.jpg",
    twitterHandle: "@aicharacterexplorer",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [formattedTitle, setFormattedTitle] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  // Force a refresh every 5 seconds to ensure we have the latest data from localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadSeo = async () => {
      try {
        setIsLoading(true)
        console.log("[SEO Component] Loading SEO data for path:", pathname)

        // Get global SEO data from localStorage
        const globalSeo = getGlobalSeoFromLocalStorage() || getDefaultSeoData().global

        // Get page-specific SEO data from localStorage
        const pageSeoData = getPageSeoFromLocalStorage() || getDefaultSeoData().pages
        const pageSeo = pageSeoData[pathname || "/"] || {
          title: globalSeo.siteName,
          description: globalSeo.description,
          keywords: globalSeo.keywords,
          ogImage: globalSeo.ogImage,
        }

        console.log("[SEO Component] Loaded data from localStorage:", { globalSeo, pageSeo })

        setSeo({
          siteName: globalSeo.siteName,
          titleTemplate: globalSeo.titleTemplate,
          title: pageSeo.title || globalSeo.siteName,
          description: pageSeo.description || globalSeo.description,
          keywords: pageSeo.keywords || globalSeo.keywords,
          ogImage: pageSeo.ogImage || globalSeo.ogImage,
          twitterHandle: globalSeo.twitterHandle,
        })
      } catch (error) {
        console.error("[SEO Component] Error loading SEO data:", error)

        // Use default values if there's an error
        const defaultData = getDefaultSeoData()
        setSeo({
          siteName: defaultData.global.siteName,
          titleTemplate: defaultData.global.titleTemplate,
          title: defaultData.global.siteName,
          description: defaultData.global.description,
          keywords: defaultData.global.keywords,
          ogImage: defaultData.global.ogImage,
          twitterHandle: defaultData.global.twitterHandle,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSeo()
  }, [pathname, refreshKey])

  useEffect(() => {
    if (!isLoading) {
      const newTitle = seo.titleTemplate.replace("%s", seo.title)
      console.log("[SEO Component] Setting document title to:", newTitle)
      setFormattedTitle(newTitle)
    }
  }, [seo, isLoading])

  // Since we can't use Next.js Head component in a Client Component,
  // we need to manually update the document head
  useEffect(() => {
    if (formattedTitle) {
      // Update title
      document.title = formattedTitle

      // Prepare image URL - ensure it's absolute
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app"
      const ogImageUrl = seo.ogImage.startsWith("http")
        ? seo.ogImage
        : `${siteUrl}${seo.ogImage.startsWith("/") ? seo.ogImage : `/${seo.ogImage}`}`

      // Update meta tags
      const metaTags = {
        description: seo.description,
        keywords: seo.keywords,
        "og:title": formattedTitle,
        "og:description": seo.description,
        "og:image": ogImageUrl,
        "og:site_name": seo.siteName,
        "twitter:card": "summary_large_image",
        "twitter:site": seo.twitterHandle,
        "twitter:title": formattedTitle,
        "twitter:description": seo.description,
        "twitter:image": ogImageUrl,
      }

      // Remove existing meta tags
      document.querySelectorAll('meta[data-seo="true"]').forEach((el) => el.remove())

      // Add new meta tags
      Object.entries(metaTags).forEach(([name, content]) => {
        if (!content) return

        const meta = document.createElement("meta")
        meta.setAttribute("data-seo", "true")

        if (name.startsWith("og:")) {
          meta.setAttribute("property", name)
        } else if (name.startsWith("twitter:")) {
          meta.setAttribute("name", name)
        } else {
          meta.setAttribute("name", name)
        }

        meta.setAttribute("content", content)
        document.head.appendChild(meta)
      })

      // Log for debugging
      console.log("[SEO Component] Updated document head with:", {
        title: formattedTitle,
        ogImage: ogImageUrl,
        description: seo.description,
      })
    }
  }, [seo, formattedTitle])

  return null
}
