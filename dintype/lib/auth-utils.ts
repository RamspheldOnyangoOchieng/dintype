import { createClient } from "@/lib/supabase-client"
import { getAnonymousId } from "./anonymous-id"

export async function signInAnonymously() {
  try {
    const supabase = createClient()

    // Get the current anonymous ID
    const anonymousId = getAnonymousId()

    // Sign in with the anonymous ID
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "anonymous",
      idToken: anonymousId,
    })

    if (error) {
      console.error("Error signing in anonymously:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error signing in anonymously:", error)
    throw error
  }
}

export async function checkPremiumStatus(
  userId: string,
): Promise<{ isPremium: boolean; expiryDate?: string; error?: string }> {
  try {
    const supabase = createClient()

    // First, try to get premium status from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.warn("Error fetching profile:", profileError)
    }

    if (profile?.is_premium) {
      return { isPremium: true }
    }

    // If not found in profiles, try premium_profiles table
    const { data: premiumProfile, error: premiumProfileError } = await supabase
      .from("premium_profiles")
      .select("is_premium, plan_duration")
      .eq("user_id", userId)
      .single()

    if (premiumProfileError) {
      console.warn("Error fetching premium profile:", premiumProfileError)
    }

    if (premiumProfile?.is_premium) {
      return { isPremium: true }
    }

    return { isPremium: false }
  } catch (error) {
    console.error("Error checking premium status:", error)
    return { isPremium: false, error: "Failed to check premium status" }
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Try to check admin status via the users_view
    const { data: viewData, error: viewError } = await supabase
      .from("users_view")
      .select("is_admin")
      .eq("id", userId)
      .single()

    if (viewError) {
      console.error("Error checking admin status via view:", viewError)
      return false
    }

    return !!viewData?.is_admin
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
