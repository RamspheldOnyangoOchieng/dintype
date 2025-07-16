"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export type PageSeo = {
  title: string
  description: string
  keywords: string
  ogImage: string
}

export type GlobalSeo = {
  siteName: string
  siteUrl: string
  titleTemplate: string
  description: string
  keywords: string
  ogImage: string
  twitterHandle: string
}

export type SeoData = {
  global: GlobalSeo
  pages: Record<string, PageSeo>
}

// Get all SEO data from Supabase
export async function getAllSeoData(): Promise<SeoData> {
  try {
    console.log("[SEO] Fetching all SEO data from database")
    const supabase = createClient()

    // Get global settings from the seo_settings table
    const { data: seoSettings, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("[SEO] Error fetching SEO settings:", error)
      throw error
    }

    console.log("[SEO] Raw SEO settings from database:", seoSettings)

    // Map the database structure to our GlobalSeo type
    const global: GlobalSeo = {
      siteName: seoSettings.site_name || "AI Character Explorer",
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app",
      titleTemplate: `%s | ${seoSettings.site_name || "AI Character Explorer"}`,
      description: seoSettings.meta_description || "",
      keywords: seoSettings.meta_keywords || "",
      ogImage: seoSettings.og_image || "/og-image.jpg",
      twitterHandle: "@aicharacterexplorer", // Default since it's not in the table
    }

    console.log("[SEO] Mapped global SEO data:", global)

    // Get page-specific SEO from the database
    const { data: pageSettings, error: pageError } = await supabase
      .from("page_seo")
      .select("*")
      .order("updated_at", { ascending: false })

    if (pageError) {
      console.error("[SEO] Error fetching page SEO settings:", pageError)
    }

    // Initialize with default pages
    const pages: Record<string, PageSeo> = {
      "/": {
        title: seoSettings.meta_title || "AI Character Explorer",
        description:
          seoSettings.meta_description || "Explore and chat with AI characters in a fun and interactive way.",
        keywords: seoSettings.meta_keywords || "AI, characters, chat, virtual companions, artificial intelligence",
        ogImage: seoSettings.og_image || "/og-image.jpg",
      },
      "/characters": {
        title: "Browse Characters",
        description: "Browse our collection of AI characters and find your perfect virtual companion.",
        keywords: "AI characters, virtual companions, character gallery, browse characters",
        ogImage: seoSettings.og_image || "/characters-og.jpg",
      },
      "/chat": {
        title: "Chat with Characters",
        description: "Chat with your favorite AI characters in real-time.",
        keywords: "AI chat, character chat, virtual companions, conversation",
        ogImage: seoSettings.og_image || "/chat-og.jpg",
      },
    }

    // Override with page-specific SEO from database if available
    if (pageSettings && pageSettings.length > 0) {
      pageSettings.forEach((page) => {
        pages[page.path] = {
          title: page.title || "",
          description: page.description || "",
          keywords: page.keywords || "",
          ogImage: page.og_image || seoSettings.og_image || "/og-image.jpg",
        }
      })
    }

    return { global, pages }
  } catch (error) {
    console.error("[SEO] Error fetching SEO data:", error)
    return getDefaultSeoData()
  }
}

// Get page-specific SEO data merged with global defaults
export async function getPageSeo(pagePath: string) {
  try {
    console.log(`[SEO] Getting SEO data for page: ${pagePath}`)
    const seoData = await getAllSeoData()
    const globalSeo = seoData.global

    // Get page-specific SEO data if it exists, otherwise use global defaults
    const pageSeo = seoData.pages[pagePath] || {
      title: globalSeo.siteName,
      description: globalSeo.description,
      keywords: globalSeo.keywords,
      ogImage: globalSeo.ogImage,
    }

    // Return merged data
    const mergedData = {
      ...globalSeo,
      ...pageSeo,
    }

    console.log(`[SEO] Merged SEO data for page ${pagePath}:`, mergedData)
    return mergedData
  } catch (error) {
    console.error(`[SEO] Error getting SEO data for page ${pagePath}:`, error)

    // Return default values if there's an error
    const defaultData = getDefaultSeoData()
    return {
      ...defaultData.global,
      title: defaultData.global.siteName,
      description: defaultData.global.description,
      keywords: defaultData.global.keywords,
      ogImage: defaultData.global.ogImage,
    }
  }
}

// Update global SEO settings
export async function updateGlobalSeo(data: Partial<GlobalSeo>) {
  console.log("[SEO] Updating global SEO with data:", data)

  try {
    const supabase = createClient()

    // Get the first SEO settings record
    const { data: existingSettings, error: fetchError } = await supabase
      .from("seo_settings")
      .select("id")
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("[SEO] Error fetching existing SEO settings:", fetchError)
      throw fetchError
    }

    const seoId = existingSettings?.id

    if (!seoId) {
      console.error("[SEO] No existing SEO settings found")
      throw new Error("No existing SEO settings found")
    }

    // Map our GlobalSeo type to the database structure
    const updateData = {
      site_name: data.siteName,
      meta_title: data.siteName, // Use siteName for meta_title
      meta_description: data.description,
      meta_keywords: data.keywords,
      og_title: data.siteName, // Use siteName for og_title
      og_description: data.description,
      og_image: data.ogImage,
      updated_at: new Date().toISOString(),
    }

    console.log("[SEO] Updating SEO settings with:", updateData)
    console.log("[SEO] SEO ID:", seoId)

    // Update existing record
    const { error: updateError } = await supabase.from("seo_settings").update(updateData).eq("id", seoId)

    if (updateError) {
      console.error("[SEO] Error updating SEO settings:", updateError)
      throw updateError
    }

    // Verify the update by fetching the updated record
    const { data: updatedSettings, error: verifyError } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("id", seoId)
      .single()

    if (verifyError) {
      console.error("[SEO] Error verifying SEO settings update:", verifyError)
      throw verifyError
    }

    console.log("[SEO] SEO settings updated successfully. Updated record:", updatedSettings)

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin/seo")
    revalidatePath("/admin/debug-seo")

    return { success: true, message: "Global SEO settings updated successfully" }
  } catch (error) {
    console.error("[SEO] Error updating global SEO data:", error)
    return { success: false, error: "Failed to update global SEO settings: " + String(error) }
  }
}

// Update page-specific SEO settings
export async function updatePageSeo(pagePath: string, data: Partial<PageSeo>) {
  try {
    console.log(`[SEO] Updating SEO data for page ${pagePath}:`, data)
    const supabase = createClient()

    // Check if page SEO already exists
    const { data: existingPage, error: fetchError } = await supabase
      .from("page_seo")
      .select("id")
      .eq("path", pagePath)
      .maybeSingle()

    if (fetchError) {
      console.error(`[SEO] Error checking existing page SEO for ${pagePath}:`, fetchError)
      throw fetchError
    }

    let result

    if (existingPage?.id) {
      // Update existing page SEO
      const { error: updateError } = await supabase
        .from("page_seo")
        .update({
          title: data.title,
          description: data.description,
          keywords: data.keywords,
          og_image: data.ogImage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPage.id)

      if (updateError) {
        console.error(`[SEO] Error updating page SEO for ${pagePath}:`, updateError)
        throw updateError
      }

      result = { success: true, message: `SEO settings for ${pagePath} updated successfully` }
    } else {
      // Insert new page SEO
      const { error: insertError } = await supabase.from("page_seo").insert({
        path: pagePath,
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        og_image: data.ogImage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error(`[SEO] Error inserting page SEO for ${pagePath}:`, insertError)
        throw insertError
      }

      result = { success: true, message: `SEO settings for ${pagePath} created successfully` }
    }

    // Revalidate paths
    revalidatePath(pagePath)
    revalidatePath("/admin/seo")

    return result
  } catch (error) {
    console.error(`[SEO] Error updating SEO data for page ${pagePath}:`, error)
    return { success: false, error: `Failed to update SEO settings for ${pagePath}: ${String(error)}` }
  }
}

// Add page-specific SEO settings
export async function addPageSeo(pagePath: string, data: PageSeo) {
  return updatePageSeo(pagePath, data)
}

// Delete page-specific SEO settings
export async function deletePageSeo(pagePath: string) {
  try {
    console.log(`[SEO] Deleting SEO data for page ${pagePath}`)
    const supabase = createClient()

    const { error } = await supabase.from("page_seo").delete().eq("path", pagePath)

    if (error) {
      console.error(`[SEO] Error deleting page SEO for ${pagePath}:`, error)
      throw error
    }

    // Revalidate paths
    revalidatePath(pagePath)
    revalidatePath("/admin/seo")

    return { success: true, message: `SEO settings for ${pagePath} deleted successfully` }
  } catch (error) {
    console.error(`[SEO] Error deleting SEO data for page ${pagePath}:`, error)
    return { success: false, error: `Failed to delete SEO settings for ${pagePath}: ${String(error)}` }
  }
}

// Get default SEO data
function getDefaultSeoData(): SeoData {
  return {
    global: {
      siteName: "AI Character Explorer",
      siteUrl: "https://ai-character-explorer.vercel.app",
      titleTemplate: "%s | AI Character Explorer",
      description: "Explore and chat with AI characters in a fun and interactive way.",
      keywords: "AI, characters, chat, virtual companions, artificial intelligence",
      ogImage: "/og-image.jpg",
      twitterHandle: "@aicharacterexplorer",
    },
    pages: {
      "/": {
        title: "AI Character Explorer",
        description: "Explore and chat with AI characters in a fun and interactive way.",
        keywords: "AI, characters, chat, virtual companions, artificial intelligence",
        ogImage: "/og-image.jpg",
      },
      "/characters": {
        title: "Browse Characters",
        description: "Browse our collection of AI characters and find your perfect virtual companion.",
        keywords: "AI characters, virtual companions, character gallery, browse characters",
        ogImage: "/characters-og.jpg",
      },
      "/chat": {
        title: "Chat with Characters",
        description: "Chat with your favorite AI characters in real-time.",
        keywords: "AI chat, character chat, virtual companions, conversation",
        ogImage: "/chat-og.jpg",
      },
    },
  }
}
