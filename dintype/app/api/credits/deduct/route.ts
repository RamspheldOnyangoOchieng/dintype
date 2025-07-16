import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { credits, transactionType, description, conversationId, characterId } = await request.json()

    if (!credits || credits <= 0) {
      return NextResponse.json({ error: "Invalid credits amount" }, { status: 400 })
    }

    // Call the deduct_credits function
    const { data, error } = await supabase.rpc("deduct_credits", {
      user_uuid: user.id,
      credits_to_deduct: credits,
      transaction_type_param: transactionType || "message",
      description_param: description,
      conversation_id_param: conversationId,
      character_id_param: characterId,
    })

    if (error) {
      console.error("Error deducting credits:", error)
      return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 })
    }

    // If deduction failed (insufficient credits)
    if (!data) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "INSUFFICIENT_CREDITS",
        },
        { status: 402 },
      )
    }

    // Get updated credits
    const { data: updatedCredits, error: creditsError } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({
      success: true,
      credits: updatedCredits,
    })
  } catch (error) {
    console.error("Error in deduct credits API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
