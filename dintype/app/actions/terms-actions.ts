"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Fetch terms content
export async function getTerms() {
  try {
    // Use direct client for public data
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase credentials")
      return { content: "# Terms of Service\n\nTerms content not available." }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from("terms").select("*").order("id", { ascending: false }).limit(1).single()

    if (error) {
      console.error("Error fetching terms:", error)
      return { content: "# Terms of Service\n\nTerms content not available." }
    }

    return data
  } catch (error) {
    console.error("Error in getTerms:", error)
    return { content: "# Terms of Service\n\nTerms content not available." }
  }
}

// Update terms content
export async function updateTerms(formData: FormData) {
  try {
    // Use direct client with service role for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials")
      return { success: false, message: "Server configuration error" }
    }

    // Create admin client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const content = formData.get("content") as string

    if (!content) {
      return { success: false, message: "Content is required" }
    }

    // Get the latest terms record
    const { data: existingTerms, error: fetchError } = await supabase
      .from("terms")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine - we'll create a new record
      console.error("Error fetching existing terms:", fetchError)
      return { success: false, message: "Failed to check existing terms" }
    }

    let result

    if (existingTerms) {
      // Update existing terms
      result = await supabase
        .from("terms")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", existingTerms.id)
    } else {
      // Create new terms if none exist
      result = await supabase.from("terms").insert({ content })
    }

    if (result.error) {
      console.error("Error updating terms:", result.error)
      return { success: false, message: "Failed to update terms" }
    }

    // Force revalidation of both pages
    revalidatePath("/terms", "page")
    revalidatePath("/admin/dashboard/terms", "page")

    return { success: true, message: "Terms updated successfully" }
  } catch (error) {
    console.error("Error in updateTerms:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
