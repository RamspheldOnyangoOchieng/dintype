import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(request: NextRequest) {
  try {
    console.log("Track payment redirect API called")

    // First try with server client
    let supabase = createClient()

    // Get the session to check if user is authenticated
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    let userId = session?.user?.id

    // If no session, try to get userId from request body
    if (!userId) {
      console.log("No authenticated session found, using userId from request body")
    }

    const { redirectPage, paymentIntentId, userId: bodyUserId } = await request.json()

    // Use userId from body if session doesn't have it
    if (!userId && bodyUserId) {
      userId = bodyUserId
      console.log("Using userId from request body:", userId)

      // Switch to admin client since we don't have an authenticated session
      try {
        const adminClient = await createAdminClient()
        if (adminClient) {
          supabase = adminClient
          console.log("Switched to admin client")
        }
      } catch (adminError) {
        console.error("Failed to create admin client:", adminError)
        // Continue with regular client
      }
    }

    if (!userId) {
      console.error("No user ID available")
      return NextResponse.json(
        {
          error: "User ID is required",
          success: false,
          workaround: true,
          message: "Payment was successful, but we couldn't track it to your account.",
        },
        { status: 200 },
      ) // Return 200 to not break the UI
    }

    if (!redirectPage) {
      console.error("No redirect page provided")
      return NextResponse.json(
        {
          error: "Redirect page is required",
          success: false,
          workaround: true,
          message: "Payment was successful, but tracking information was incomplete.",
        },
        { status: 200 },
      )
    }

    console.log("Processing payment redirect:", { userId, redirectPage, paymentIntentId })

    // Check if this is a success page redirect
    const isPremium = redirectPage.includes("/premium/success")
    const paymentStatus = isPremium ? "completed" : "pending"

    // Insert the redirect record
    const { data, error } = await supabase
      .from("payment_redirects")
      .insert({
        user_id: userId,
        redirect_page: redirectPage,
        payment_intent_id: paymentIntentId || null,
        payment_status: paymentStatus,
        is_premium: isPremium,
      })
      .select()
      .single()

    if (error) {
      console.error("Error tracking payment redirect:", error)

      // Try to update premium status anyway
      if (isPremium) {
        await updatePremiumStatus(supabase, userId)
      }

      return NextResponse.json(
        {
          error: "Failed to track payment redirect",
          details: error.message,
          success: false,
          workaround: true,
          message: "Payment was successful, but we couldn't save the tracking information.",
        },
        { status: 200 },
      )
    }

    // If this is a success page, update the user's premium status
    if (isPremium) {
      await updatePremiumStatus(supabase, userId)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in track-payment-redirect:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        success: false,
        workaround: true,
        message: "Payment was successful, but we encountered an error while processing.",
      },
      { status: 200 },
    )
  }
}

async function updatePremiumStatus(supabase, userId) {
  try {
    console.log("Updating premium status for user:", userId)

    // Update profiles table
    const { error: profileError } = await supabase.from("profiles").update({ is_premium: true }).eq("id", userId)

    if (profileError) {
      console.error("Error updating profile premium status:", profileError)
    } else {
      console.log("Successfully updated profile premium status")
    }

    // Check if user already has a premium profile
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("premium_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (profileCheckError) {
      console.error("Error checking for existing premium profile:", profileCheckError)
      return
    }

    if (existingProfile) {
      // Update existing profile
      const { error: updateProfileError } = await supabase
        .from("premium_profiles")
        .update({
          is_premium: true,
          plan_name: "premium",
          plan_duration: 1,
        })
        .eq("user_id", userId)

      if (updateProfileError) {
        console.error("Error updating premium profile:", updateProfileError)
      } else {
        console.log("Successfully updated existing premium profile")
      }
    } else {
      // Create new premium profile
      const { error: insertProfileError } = await supabase.from("premium_profiles").insert({
        user_id: userId,
        is_premium: true,
        plan_name: "premium",
        plan_duration: 1,
      })

      if (insertProfileError) {
        console.error("Error creating premium profile:", insertProfileError)
      } else {
        console.log("Successfully created new premium profile")
      }
    }
  } catch (error) {
    console.error("Error in updatePremiumStatus:", error)
  }
}
