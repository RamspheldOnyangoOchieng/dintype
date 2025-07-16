import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { getStripeInstance } from "@/lib/stripe-utils"
import { savePaymentTransaction } from "@/lib/payment-utils"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "100", 10)
    const startingAfter = searchParams.get("startingAfter")
    const endingBefore = searchParams.get("endingBefore")

    // Initialize Supabase admin client
    const supabaseAdmin = await createAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Failed to initialize admin client" }, { status: 500 })
    }

    // Get Stripe instance
    const stripe = await getStripeInstance()
    if (!stripe) {
      return NextResponse.json({ error: "Failed to initialize Stripe" }, { status: 500 })
    }

    // Prepare options for Stripe API call
    const options: any = { limit }
    if (startingAfter) options.starting_after = startingAfter
    if (endingBefore) options.ending_before = endingBefore

    // Get payment intents from Stripe
    const paymentIntents = await stripe.paymentIntents.list(options)

    // Filter by user ID if provided
    let filteredPaymentIntents = paymentIntents.data
    if (userId) {
      filteredPaymentIntents = paymentIntents.data.filter((pi) => pi.metadata && pi.metadata.userId === userId)
    }

    // Get checkout sessions if needed for more data
    const checkoutSessions = await stripe.checkout.sessions.list({ limit: 100 })

    // Combine data for a more complete picture
    const enrichedPaymentIntents = filteredPaymentIntents.map((pi) => {
      // Try to find a matching checkout session
      const matchingSession = checkoutSessions.data.find((session) => session.payment_intent === pi.id)

      return {
        ...pi,
        checkout_session: matchingSession
          ? {
              id: matchingSession.id,
              customer_email: matchingSession.customer_email,
              customer_details: matchingSession.customer_details,
              metadata: matchingSession.metadata,
            }
          : null,
      }
    })

    return NextResponse.json({
      success: true,
      paymentIntents: enrichedPaymentIntents,
      has_more: paymentIntents.has_more,
      pagination: {
        starting_after: paymentIntents.data.length > 0 ? paymentIntents.data[paymentIntents.data.length - 1].id : null,
        ending_before: paymentIntents.data.length > 0 ? paymentIntents.data[0].id : null,
      },
    })
  } catch (error) {
    console.error("Error in stripe-sync API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { paymentIntentIds, userId } = body

    if (!paymentIntentIds || !Array.isArray(paymentIntentIds) || paymentIntentIds.length === 0) {
      return NextResponse.json({ error: "Payment intent IDs are required" }, { status: 400 })
    }

    // Initialize Supabase admin client
    const supabaseAdmin = await createAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Failed to initialize admin client" }, { status: 500 })
    }

    // Get Stripe instance
    const stripe = await getStripeInstance()
    if (!stripe) {
      return NextResponse.json({ error: "Failed to initialize Stripe" }, { status: 500 })
    }

    // Get existing transactions from the database
    const { data: existingTransactions, error: dbError } = await supabaseAdmin
      .from("payments")
      .select("stripe_session_id, payment_intent_id")

    if (dbError) {
      console.error("Error fetching existing transactions:", dbError)
      return NextResponse.json({ error: "Failed to fetch existing transactions" }, { status: 500 })
    }

    // Create sets for faster lookup
    const existingSessionIds = new Set(existingTransactions.map((tx) => tx.stripe_session_id).filter(Boolean))
    const existingPaymentIntentIds = new Set(existingTransactions.map((tx) => tx.payment_intent_id).filter(Boolean))

    // Process each payment intent
    const results = []
    for (const piId of paymentIntentIds) {
      try {
        // Skip if already in database
        if (existingPaymentIntentIds.has(piId) || existingSessionIds.has(piId)) {
          results.push({
            id: piId,
            status: "skipped",
            message: "Payment already exists in database",
          })
          continue
        }

        // Get payment intent details from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(piId, {
          expand: ["customer", "payment_method"],
        })

        // Try to find a checkout session for this payment intent
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: piId,
          limit: 1,
        })
        const session = sessions.data.length > 0 ? sessions.data[0] : null

        // Determine user ID
        const effectiveUserId = userId || session?.metadata?.userId || paymentIntent.metadata?.userId || null

        if (!effectiveUserId) {
          results.push({
            id: piId,
            status: "error",
            message: "No user ID found for this payment",
          })
          continue
        }

        // Create payment record
        const paymentData = {
          user_id: effectiveUserId,
          stripe_session_id: session?.id || piId,
          payment_intent_id: piId,
          amount: paymentIntent.amount / 100, // Convert from cents
          currency: paymentIntent.currency,
          status: paymentIntent.status === "succeeded" ? "completed" : paymentIntent.status,
          payment_method: paymentIntent.payment_method_types?.[0] || "card",
          created_at: new Date(paymentIntent.created * 1000).toISOString(),
          _metadata: {
            paymentIntent: {
              description: paymentIntent.description,
              metadata: paymentIntent.metadata,
              receipt_email: paymentIntent.receipt_email,
            },
            session: session
              ? {
                  customer_email: session.customer_email,
                  customer_details: session.customer_details,
                  metadata: session.metadata,
                }
              : null,
          },
        }

        // Save to database
        await savePaymentTransaction(paymentData)

        // Update premium status if payment was successful
        if (paymentIntent.status === "succeeded") {
          // Update profiles table
          await supabaseAdmin.from("profiles").upsert(
            {
              id: effectiveUserId,
              is_premium: true,
            },
            { onConflict: "id" },
          )

          // Check if user already has a premium profile
          const { data: existingProfile } = await supabaseAdmin
            .from("premium_profiles")
            .select("*")
            .eq("user_id", effectiveUserId)
            .maybeSingle()

          if (existingProfile) {
            // Update existing profile
            await supabaseAdmin
              .from("premium_profiles")
              .update({
                is_premium: true,
                plan_name: "premium",
                plan_duration: 1,
              })
              .eq("user_id", effectiveUserId)
          } else {
            // Create new premium profile
            await supabaseAdmin.from("premium_profiles").insert({
              user_id: effectiveUserId,
              is_premium: true,
              plan_name: "premium",
              plan_duration: 1,
            })
          }
        }

        results.push({
          id: piId,
          status: "success",
          message: "Payment synced successfully",
          details: {
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            date: new Date(paymentIntent.created * 1000).toISOString(),
          },
        })
      } catch (error) {
        console.error(`Error processing payment intent ${piId}:`, error)
        results.push({
          id: piId,
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Error in stripe-sync API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
