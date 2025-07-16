// A utility to force logout from anywhere in the app

import { createClient } from "@/lib/supabase-client"

export async function forceLogout() {
  console.log("Force logout initiated")

  try {
    // 1. Call Supabase auth signOut
    const supabase = createClient()
    await supabase.auth.signOut()

    // 2. Try global signout too
    try {
      await supabase.auth.signOut({ scope: "global" })
    } catch (e) {
      console.error("Global signOut error:", e)
    }

    // 3. Clear all localStorage
    localStorage.clear()

    // 4. Clear all sessionStorage
    sessionStorage.clear()

    // 5. Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.trim().split("=")[0] + "=;expires=" + new Date(0).toUTCString() + ";path=/"
    })

    return true
  } catch (error) {
    console.error("Error during force logout:", error)

    // Even if there's an error, clear everything
    localStorage.clear()
    sessionStorage.clear()

    document.cookie.split(";").forEach((c) => {
      document.cookie = c.trim().split("=")[0] + "=;expires=" + new Date(0).toUTCString() + ";path=/"
    })

    return false
  }
}
