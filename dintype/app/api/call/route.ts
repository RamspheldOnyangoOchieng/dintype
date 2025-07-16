import { type NextRequest, NextResponse } from "next/server"
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { moderateContent } from '@/lib/moderation'

// Voice IDs for different character types
const VOICE_IDS = {
  female: "bbeabae6-ec8d-444f-92ad-c8e620d3de8d", // Default voice ID
  anime: "bbeabae6-ec8d-444f-92ad-c8e620d3de8d", // Default voice ID
  male: "bbeabae6-ec8d-444f-92ad-c8e620d3de8d", // Default voice ID
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, characterName, systemPrompt, characterType } = await request.json()
    const supabase = createClient(headers().get('cookie'))
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 })
    }

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Get API key from environment variable
    const apiKey = process.env.BLAND_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Determine which voice to use based on character type
    let voiceId = VOICE_IDS.male
    if (characterType === "female") {
      voiceId = VOICE_IDS.female
    } else if (characterType === "anime") {
      voiceId = VOICE_IDS.anime
    }

    // Check if voiceId is empty
    if (!voiceId) {
      console.error("No voice ID configured for character type:", characterType)
      return NextResponse.json({ error: "No voice ID configured for character type" }, { status: 500 })
    }

    // Prepare the request to Bland AI
    const blandAIRequest = {
      phone_number: phoneNumber,
      task: systemPrompt,
      voice: voiceId,
      first_sentence: `Hello, this is ${characterName}. It's nice to talk to you!`,
    }

    // Make the API call to Bland AI
    const response = await fetch("https://api.bland.ai/v1/calls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(blandAIRequest),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Bland AI API error:", data)
      return NextResponse.json({ error: data.error || "Failed to initiate call" }, { status: response.status })
    }

    const inputModerationResult = await moderateContent({
      userId: user.id,
      content: systemPrompt,
      contentType: 'user_input',
      isAgeRestrictedFeature: true
    })
    if (inputModerationResult.blocked) {
      return NextResponse.json({ error: inputModerationResult.message }, { status: 403 })
    }
    const moderatedPrompt = inputModerationResult.moderatedContent || systemPrompt
    let aiResponse: string
    try {
      aiResponse = `AI response to "${moderatedPrompt}".`
    } catch (aiError) {
      await supabase.from('moderation_logs').insert({
        user_id: user.id,
        content_type: 'ai_model_error',
        original_content: systemPrompt,
        policy_violation: 'ai_generation_failure',
        action_taken: 'blocked',
        triggered_rules: ['ai_error'],
        metadata: { error: JSON.stringify(aiError) }
      })
      return NextResponse.json({ error: "AI could not generate a response. Please try again." }, { status: 500 })
    }
    const outputModerationResult = await moderateContent({
      userId: user.id,
      content: aiResponse,
      contentType: 'chatbot_output',
      isAgeRestrictedFeature: true
    })
    if (outputModerationResult.blocked) {
      return NextResponse.json({ error: "I cannot generate a response for that. Please try something different." }, { status: 400 })
    }
    const finalAiResponse = outputModerationResult.moderatedContent || aiResponse
    return NextResponse.json({ success: true, callId: data.call_id, response: finalAiResponse })
  } catch (error) {
    console.error("Error in call API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
