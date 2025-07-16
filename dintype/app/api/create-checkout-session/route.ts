import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { getStripeInstance } from "@/lib/stripe-utils"

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, email, successUrl, cancelUrl } = await request.json()

    if (!planId) {
      return NextResponse.json({ success: false, error: "Plan ID is required" }, { status: 400 })
    }

    // Get authenticated user if userId not provided
    let authenticatedUserId = userId
    let userEmail = email

    if (!authenticatedUserId) {
      const cookieStore = cookies()
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        return NextResponse.json({ success: false, error: "not_authenticated" }, { status: 401 })
      }

      authenticatedUserId = session.user.id
      userEmail = session.user.email
    }

    const supabase = createClient()

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 })
    }

    // Calculate the price to use (discounted_price if available, otherwise original_price)
    const priceToUse = plan.discounted_price !== null ? plan.discounted_price : plan.original_price

    // Validate that we have a valid price
    if (typeof priceToUse !== "number" || isNaN(priceToUse)) {
      console.error("Invalid price value:", priceToUse, "for plan:", plan)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid price configuration",
          details: {
            planId: plan.id,
            originalPrice: plan.original_price,
            discountedPrice: plan.discounted_price,
          },
        },
        { status: 400 },
      )
    }

    const stripe = await getStripeInstance()
    if (!stripe) {
      return NextResponse.json({ success: false, error: "Stripe is not configured" }, { status: 500 })
    }

    // Create checkout session with validated price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description || `${plan.duration} month subscription`,
            },
            unit_amount: Math.round(priceToUse * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${request.nextUrl.origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/premium?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId: authenticatedUserId,
        planId: planId,
        planName: plan.name,
        planDuration: plan.duration.toString(),
        price: priceToUse.toString(),
      },
    })

    return NextResponse.json({ success: true, sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
