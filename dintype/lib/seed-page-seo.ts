"use server"

import { createClient } from "@/utils/supabase/server"

export async function seedPageSeo() {
  try {
    const supabase = createClient()

    // Check if we already have page SEO data
    const { count, error: countError } = await supabase.from("page_seo").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking page SEO count:", countError)
      return { success: false, error: countError.message }
    }

    // If we already have data, don't seed
    if (count && count > 0) {
      console.log("Page SEO data already exists, skipping seed")
      return { success: true, message: "Page SEO data already exists" }
    }

    // Get global SEO settings for defaults
    const { data: seoSettings, error: seoError } = await supabase
      .from("seo_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (seoError) {
      console.error("Error fetching SEO settings:", seoError)
      return { success: false, error: seoError.message }
    }

    // Default pages to seed
    const defaultPages = [
      {
        path: "/",
        title: seoSettings.meta_title || "AI Character Explorer",
        description:
          seoSettings.meta_description || "Explore and chat with AI characters in a fun and interactive way.",
        keywords: seoSettings.meta_keywords || "AI, characters, chat, virtual companions, artificial intelligence",
        og_image: seoSettings.og_image || "/og-image.jpg",
      },
      {
        path: "/characters",
        title: "Browse Characters",
        description: "Browse our collection of AI characters and find your perfect virtual companion.",
        keywords: "AI characters, virtual companions, character gallery, browse characters",
        og_image: seoSettings.og_image || "/characters-og.jpg",
      },
      {
        path: "/chat",
        title: "Chat with Characters",
        description: "Chat with your favorite AI characters in real-time.",
        keywords: "AI chat, character chat, virtual companions, conversation",
        og_image: seoSettings.og_image || "/chat-og.jpg",
      },
    ]

    // Insert default pages
    const { error: insertError } = await supabase.from("page_seo").insert(defaultPages)

    if (insertError) {
      console.error("Error seeding page SEO data:", insertError)
      return { success: false, error: insertError.message }
    }

    console.log("Successfully seeded page SEO data")
    return { success: true, message: "Successfully seeded page SEO data" }
  } catch (error) {
    console.error("Error in seedPageSeo:", error)
    return { success: false, error: String(error) }
  }
}
