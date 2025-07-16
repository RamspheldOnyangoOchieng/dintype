"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Verify SEO settings by directly querying the database
export async function verifySeoSettings() {
  try {
    const supabase = createClient()

    console.log("[VERIFY SEO] Verifying SEO settings - direct database query")

    // Get the first SEO settings record
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("[VERIFY SEO] Error verifying SEO settings:", error)
      return { success: false, error: error.message }
    }

    console.log("[VERIFY SEO] SEO settings verified successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[VERIFY SEO] Error verifying SEO settings:", error)
    return { success: false, error: String(error) }
  }
}

// Update SEO settings directly in the database using our custom SQL function
export async function updateSeoSettingsDirect(data: Record<string, any>) {
  try {
    const supabase = createClient()

    console.log("[VERIFY SEO] Updating SEO settings directly with data:", data)

    // Get the first SEO settings record
    const { data: existingSettings, error: fetchError } = await supabase
      .from("seo_settings")
      .select("id")
      .limit(1)
      .single()

    if (fetchError) {
      console.error("[VERIFY SEO] Error fetching existing SEO settings:", fetchError)
      return { success: false, error: fetchError.message }
    }

    const seoId = existingSettings?.id

    if (!seoId) {
      console.error("[VERIFY SEO] No existing SEO settings found")
      return { success: false, error: "No existing SEO settings found" }
    }

    // Add updated_at timestamp
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    }

    console.log("[VERIFY SEO] Updating SEO settings with ID:", seoId)
    console.log("[VERIFY SEO] Update data:", updateData)

    // Execute direct SQL update
    const sql = `
      UPDATE seo_settings 
      SET 
        site_name = '${escapeSQL(updateData.site_name || "")}',
        meta_title = '${escapeSQL(updateData.meta_title || "")}',
        meta_description = '${escapeSQL(updateData.meta_description || "")}',
        meta_keywords = '${escapeSQL(updateData.meta_keywords || "")}',
        og_title = '${escapeSQL(updateData.og_title || "")}',
        og_description = '${escapeSQL(updateData.og_description || "")}',
        og_image = '${escapeSQL(updateData.og_image || "")}',
        updated_at = NOW()
      WHERE id = '${seoId}'
    `

    console.log("[VERIFY SEO] Executing SQL:", sql)

    // Execute the SQL query
    const { error: updateError } = await supabase.rpc("execute_admin_sql", {
      sql_query: sql,
    })

    if (updateError) {
      console.error("[VERIFY SEO] Error updating SEO settings:", updateError)
      return { success: false, error: updateError.message }
    }

    // Verify the update by fetching the updated record
    const { data: updatedSettings, error: verifyError } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("id", seoId)
      .single()

    if (verifyError) {
      console.error("[VERIFY SEO] Error verifying SEO settings update:", verifyError)
      return { success: false, error: verifyError.message }
    }

    console.log("[VERIFY SEO] Direct update result:", { success: true, data: updatedSettings })

    // Revalidate paths to ensure fresh data
    revalidatePath("/")
    revalidatePath("/admin/seo")
    revalidatePath("/admin/debug-seo")

    return { success: true, data: updatedSettings }
  } catch (error) {
    console.error("[VERIFY SEO] Error updating SEO settings directly:", error)
    return { success: false, error: String(error) }
  }
}

// Helper function to escape SQL strings
function escapeSQL(str: string): string {
  if (!str) return ""
  return str.replace(/'/g, "''")
}
