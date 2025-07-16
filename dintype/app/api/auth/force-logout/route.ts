import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Attempt to sign out on the server side
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Server-side logout error:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
      })
    }

    // Clear all cookies
    cookies()
      .getAll()
      .forEach((cookie) => {
        cookies().delete(cookie.name)
      })

    return NextResponse.json({
      success: true,
      message: "Server-side logout successful",
    })
  } catch (error) {
    console.error("Error in force-logout:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during logout",
      },
      { status: 500 },
    )
  }
}
