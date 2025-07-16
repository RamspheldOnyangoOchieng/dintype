"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function forceSeoRefresh() {
  try {
    console.log("[SEO] Forcing SEO data refresh")

    // Revalidate all paths
    revalidatePath("/", "layout")
    revalidatePath("/admin/seo", "layout")
    revalidatePath("/admin/debug-seo", "layout")

    // Clear any potential cache by fetching fresh data
    const supabase = createClient()
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("[SEO] Error refreshing SEO data:", error)
      return { success: false, error: error.message }
    }

    console.log("[SEO] Refresh successful, latest data:", data)
    return { success: true, message: "SEO data refreshed successfully" }
  } catch (error) {
    console.error("[SEO] Error during force refresh:", error)
    return { success: false, error: String(error) }
  }
}
