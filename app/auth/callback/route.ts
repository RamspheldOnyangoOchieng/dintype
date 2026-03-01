import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  const supabase = await createClient()

  if (code) {
    // Check if we already have a session (e.g. if the user is already logged in)
    const { data: { session } } = await supabase.auth.getSession()

    // Only exchange code if no session exists to avoid "Already used" errors
    if (!session) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Auth callback error:', error)
        // If it's a "flow_state_not_found" error, it might be a pre-fetch or double click
        // If we still don't have a user, only then show the error
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          return NextResponse.redirect(`${origin}/logga-in?error=Invalid+or+expired+link`)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  const next = requestUrl.searchParams.get("next")
  if (next) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  // Default redirect to home with login=true to trigger the welcome/success toast
  return NextResponse.redirect(`${origin}/?login=true`)
}
