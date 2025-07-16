import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { getStripeInstance } from "@/lib/stripe-utils"
import { savePaymentTransaction } from "@/lib/payment-utils"

export async function POST(request: Request) {
  try {
    // Get the user ID from the request body
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabaseAdmin = await createAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Failed to initialize admin client" }, { status: 500 })
    }

    // Get Stripe instance
    const stripe = await getStripeInstance()
    if (!stripe) {
      return NextResponse.json({ error: "Failed to initialize Stripe" }, { status: 500 })
    }

    // Get existing transactions for this user
    const { data: existingTransactions, error: dbError } = await supabaseAdmin
      .from("payments")
      .select("stripe_session_id")
      .eq("user_id", userId)

    if (dbError) {
      console.error("Error fetching existing transactions:", dbError)
      return NextResponse.json({ error: "Failed to fetch existing transactions" }, { status: 500 })
    }

    // Create a set of existing session IDs for faster lookup
    const existingSessionIds = new Set(existingTransactions.map((tx) => tx.stripe_session_id))

    // Get payment intents from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
    })

    // Filter payment intents for this user
    const userPaymentIntents = paymentIntents.data.filter(
      (pi) => pi.metadata && pi.metadata.user_id === userId && pi.status === "succeeded",
    )

    // Find payment intents that are not in our database
    const newPaymentIntents = userPaymentIntents.filter((pi) => !existingSessionIds.has(pi.id))

    // Save new payment intents to the database
    const savedTransactions = []
    for (const pi of newPaymentIntents) {
      try {
        const transaction = {
          id: pi.id,
          user_id: userId,
          stripe_session_id: pi.id,
          amount: pi.amount / 100, // Convert from cents
          status: "completed",
          payment_method: pi.payment_method_types?.[0] || "Credit Card",
          created_at: new Date(pi.created * 1000).toISOString(),
          currency: pi.currency,
        }

        const savedTransaction = await savePaymentTransaction(transaction)
        savedTransactions.push(savedTransaction)
      } catch (error) {
        console.error("Error saving transaction:", error)
      }
    }

    // Check if the user should be premium based on the transactions
    if (savedTransactions.length > 0) {
      // Update the user's premium status
      const { error: updateError } = await supabaseAdmin.from("profiles").update({ is_premium: true }).eq("id", userId)

      if (updateError) {
        console.error("Error updating premium status:", updateError)
      }
    }

    return NextResponse.json({
      success: true,
      syncedTransactions: savedTransactions.length,
      newTransactions: savedTransactions,
    })
  } catch (error) {
    console.error("Error in payment-sync API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
