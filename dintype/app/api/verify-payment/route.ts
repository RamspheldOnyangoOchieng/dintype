import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { getStripeInstance } from "@/lib/stripe-utils"
import { savePaymentTransaction } from "@/lib/payment-utils"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    const stripe = await getStripeInstance()
    if (!stripe) {
      return NextResponse.json({ success: false, error: "Stripe is not configured" }, { status: 500 })
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer", "line_items"],
    })

    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    const supabase = await createAdminClient()

    if (!supabase) {
      return NextResponse.json({ success: false, error: "Failed to initialize Supabase client" }, { status: 500 })
    }

    // Get user ID from metadata or customer email
    const userId = session.metadata?.userId || null

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID not found in session metadata" }, { status: 400 })
    }

    // Get payment details
    const paymentIntent = session.payment_intent as any
    const paymentMethod = paymentIntent?.payment_method as any

    // Check if this payment has already been processed
    const { data: existingPayment, error: checkError } = await supabase
      .from("payments")
      .select("id, status")
      .eq("stripe_session_id", session.id)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking for existing payment:", checkError)
      return NextResponse.json({ success: false, error: checkError.message }, { status: 500 })
    }

    // If payment exists, just update the status
    if (existingPayment) {
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: session.payment_status || "unknown",
        })
        .eq("id", existingPayment.id)

      if (updateError) {
        console.error("Error updating payment status:", updateError)
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
      }
    } else {
      // Save payment transaction
      try {
        await savePaymentTransaction({
          userId,
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
          amount: session.amount_total ? session.amount_total / 100 : undefined, // Convert from cents
          currency: session.currency?.toUpperCase(),
          status: session.payment_status || "unknown",
          paymentMethod: session.payment_method_types?.[0],
          paymentMethodDetails: paymentMethod,
          subscriptionId: session.subscription as string,
          planName: session.metadata?.planName,
          planDuration: session.metadata?.planDuration ? Number.parseInt(session.metadata.planDuration) : undefined,
          metadata: {
            sessionMode: session.mode,
            sessionStatus: session.status,
            customerDetails: session.customer_details,
            lineItems: session.line_items?.data,
          },
        })
      } catch (error) {
        console.error("Error saving payment transaction:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
    }

    // Update user's premium status
    if (session.payment_status === "paid") {
      const planName = session.metadata?.planName || "premium"
      const planDuration = session.metadata?.planDuration ? Number.parseInt(session.metadata.planDuration) : 1

      // Update both profiles and premium_profiles tables to ensure consistency

      // Update profiles table
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          is_premium: true,
        },
        { onConflict: "id" },
      )

      if (profileError) {
        console.error("Error updating profile:", profileError)
        return NextResponse.json({ success: false, error: profileError.message }, { status: 500 })
      }

      // Check if user already has a premium profile
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("premium_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle()

      if (profileCheckError) {
        console.error("Error checking for existing premium profile:", profileCheckError)
        return NextResponse.json({ success: false, error: profileCheckError.message }, { status: 500 })
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateProfileError } = await supabase
          .from("premium_profiles")
          .update({
            is_premium: true,
            plan_name: planName,
            plan_duration: planDuration,
          })
          .eq("user_id", userId)

        if (updateProfileError) {
          console.error("Error updating premium profile:", updateProfileError)
          return NextResponse.json({ success: false, error: updateProfileError.message }, { status: 500 })
        }
      } else {
        // Create new premium profile
        const { error: insertProfileError } = await supabase.from("premium_profiles").insert({
          user_id: userId,
          is_premium: true,
          plan_name: planName,
          plan_duration: planDuration,
        })

        if (insertProfileError) {
          console.error("Error creating premium profile:", insertProfileError)
          return NextResponse.json({ success: false, error: insertProfileError.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({
      success: true,
      isPaid: session.payment_status === "paid",
      sessionDetails: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
      },
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
