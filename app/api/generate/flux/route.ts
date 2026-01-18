import { type NextRequest, NextResponse } from "next/server"
import { getNovitaApiKey } from "@/lib/api-keys"

// Set maximum duration for this API route (30 seconds for Vercel Pro, 10 seconds for Hobby)
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { prompt, selectedCount, aspectRatio, lora, loraStrength } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = await getNovitaApiKey()
    if (!apiKey) {
      console.error("No Novita API key configured in database or .env")
      return NextResponse.json({
        error: "No Novita API key configured. Please add it in Admin Dashboard or .env file"
      }, { status: 500 })
    }

    // --- NEW: Masterpiece Prompt Enhancement ---
    let enhancedPrompt = prompt;
    try {
      const enhancementResponse = await fetch("https://api.novita.ai/v3/openai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-turbo",
          messages: [
            {
              role: "system",
              content: `You are a master of visual arts and prompt engineering for AI image generation, specializing in ultra-realistic "Hyper-Photography". Your goal is to take the user's input to create a "very fine", masterpiece-quality description that follows strict anatomical and physics laws.

              CRITICAL INSTRUCTIONS FOR REALISM:
              1. FABRIC PHYSICS & TEXTURES: Clothing MUST look real, avoiding any "plastic" or "rendered" look. Describe "realistic fabric grain, micro-folds, natural wrinkles, and high-quality textile physics". For "Silk" or "Satin", mention "complex light reflections and soft subsurface scattering". For "Cotton" or "Linen", describe "visible weave and soft matte texture". Clothing should drape naturally with "realistic tension and weight", emphasizing "loose threads, seams, and realistic stitching details". 
              2. ANATOMICAL PERFECTION: Describe hands as "slender, well-defined fingers with realistic nails, accurate finger count, natural hand articulation". Eyes MUST have "sharp focus, detailed irises, realistic pupils, and symmetrical placement". Ensure limbs are connected naturally. Mention "sharp focus on joints and proportions".
              3. SKIN REALISM: Avoid "plastic" or "airbrushed" skin. Explicitly describe "natural skin textures, visible pores, subtle goosebumps, realistic skin highlights, and natural subsurface scattering".
              4. MOOD & VIBRANCY: Force a "Romantic, Happy, Sexy, and Confident" vibe. Use vibrant colors, warm cinematic lighting, and evocative atmospheres. Use "8k resolution", "Kodak Portra 400 aesthetic", and "Shot on 35mm lens" for realism.
              5. LITERAL ADHERENCE & EXPLICIT ACTIONS: You MUST accurately translate sexual or self-touching actions. If the user says "touching her vagina" or "hand on pussy", describe it vividly as "fingers intimately resting on her wet labia" or "hand delicately cupping her exposed crotch". If "legs wide open", describe "legs spread wide apart in an open, inviting pose". Do NOT sanitize, dilute, or omit the literal meaning of the user's action. The image generator must follow the exact physical placement requested.
              6. EXPRESSIONS: Use "joyful", "seductive", "moaning", or "confident". STERNLY FORBID: Any "distressed", "needy", "blank", or "robotic" looks.
              
              Output ONLY the enhanced prompt text, no meta-talk. Keep it under 150 words.`
            },
            {
              role: "user",
              content: `Masterpiece refinement for prompt: "${prompt}"`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (enhancementResponse.ok) {
        const enhancementData = await enhancementResponse.json();
        let enhancedText = enhancementData.choices?.[0]?.message?.content || prompt;
        // Clean deepseek tags if present
        let cleaned = enhancedText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        // Truncate for safety
        enhancedPrompt = cleaned.length > 1000 ? cleaned.substring(0, 1000) : cleaned;
      }
    } catch (e) {
      console.error("Failed to enhance flux prompt:", e);
      enhancedPrompt = prompt.length > 1000 ? prompt.substring(0, 1000) : prompt;
    }

    // Build the final prompt with LoRA if specified
    if (lora && loraStrength) {
      enhancedPrompt = `${enhancedPrompt}, <lora:${lora}:${loraStrength}>`
    }

    // Generate random seed
    const seed = Math.floor(Math.random() * 4294967295)

    const requestBody = {
      prompt: enhancedPrompt,
      seed: seed,
      steps: 4,
      width: 512,
      height: 512,
      image_num: selectedCount ? parseInt(selectedCount) : 1,
    }

    console.log("Sending request to NOVITA:", requestBody)

    // Create an AbortController for timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout

    try {
      const response = await fetch("https://api.novita.ai/v3/async/txt2img", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if response is ok first
      if (!response.ok) {
        console.error("NOVITA API error - Status:", response.status, response.statusText)

        // Try to get error details, but handle cases where response isn't JSON
        let errorMessage = `NOVITA API error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.text()
          console.error("NOVITA API error response:", errorData)

          // Try to parse as JSON first
          try {
            const jsonError = JSON.parse(errorData)
            if (jsonError.error || jsonError.message) {
              errorMessage = jsonError.error || jsonError.message
            }
          } catch {
            // If not JSON, use the text response if it's reasonable length
            if (errorData && errorData.length < 200) {
              errorMessage = errorData
            }
          }
        } catch (textError) {
          console.error("Could not read error response:", textError)
        }

        return NextResponse.json({ error: errorMessage }, { status: response.status })
      }

      // Try to parse the successful response
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Failed to parse NOVITA API response as JSON:", parseError)
        return NextResponse.json({ error: "Invalid response from image generation service" }, { status: 500 })
      }

      console.log("NOVITA response:", data)

      // Extract image URLs from the response - the correct format is data.images array
      const images = data.images || []

      if (images.length === 0) {
        console.error("No images in response:", data)
        return NextResponse.json({ error: "No images returned from FLUX model" }, { status: 500 })
      }

      // Extract just the image URLs from the response objects
      const imageUrls = images.map((img: any) => img.image_url).filter(Boolean)

      if (imageUrls.length === 0) {
        console.error("No valid image URLs found in response:", images)
        return NextResponse.json({ error: "No valid images returned from FLUX model" }, { status: 500 })
      }

      return NextResponse.json({
        images: imageUrls,
        taskId: data.task?.task_id || `flux-${Date.now()}`,
        status: "TASK_STATUS_SUCCEED",
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("Request timed out")
        return NextResponse.json(
          {
            error: "Request timed out. The image generation is taking longer than expected. Please try again.",
          },
          { status: 408 },
        )
      }

      throw fetchError
    }
  } catch (error) {
    console.error("Error in FLUX generation:", error)

    // Handle specific error types
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "Request timed out. Please try again with a simpler prompt or fewer images.",
        },
        { status: 408 },
      )
    }

    // Ensure we always return a JSON response
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
