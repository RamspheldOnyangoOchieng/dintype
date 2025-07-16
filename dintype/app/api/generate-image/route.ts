import { type NextRequest, NextResponse } from "next/server"

// Define types for the API
type NovitaRequestBody = {
  extra: {
    response_image_type: string
  }
  request: {
    prompt: string
    model_name: string
    negative_prompt?: string
    width: number
    height: number
    image_num: number
    steps: number
    seed: number
    sampler_name: string
    guidance_scale: number
  }
}

type NovitaTaskResponse = {
  task_id: string
}

type NovitaTaskResultResponse = {
  task: {
    task_id: string
    status: string
    reason: string
  }
  images: {
    image_url: string
    image_type: string
  }[]
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, negativePrompt, imageCount, width, height, language = "sv" } = await req.json()

    console.log("[Image Generation] Starting generation with prompt:", prompt)
    console.log("[Image Generation] Language:", language)
    console.log("[Image Generation] Image count:", imageCount)

    // Get API key from environment variable
    const apiKey = process.env.NOVITA_API_KEY

    if (!apiKey) {
      console.error("[Image Generation] API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Enhance prompt for better results with Swedish context
    let enhancedPrompt = prompt
    if (language === "sv") {
      // Add quality enhancers for Swedish prompts
      enhancedPrompt = `${prompt}, high quality, detailed, professional photography, 8k resolution`
    } else {
      enhancedPrompt = `${prompt}, high quality, detailed, professional photography, 8k resolution`
    }

    // Set appropriate negative prompt based on language
    let finalNegativePrompt = negativePrompt || "bad quality, worst quality, low quality, blurry, distorted, deformed"

    if (language === "sv") {
      finalNegativePrompt =
        negativePrompt ||
        "dålig kvalitet, sämsta kvalitet, låg kvalitet, suddig, förvrängd, deformerad, bad quality, worst quality, low quality"
    }

    console.log("[Image Generation] Enhanced prompt:", enhancedPrompt)
    console.log("[Image Generation] Negative prompt:", finalNegativePrompt)

    // Create request body for Novita API
    const requestBody: NovitaRequestBody = {
      extra: {
        response_image_type: "jpeg",
      },
      request: {
        prompt: enhancedPrompt,
        model_name: "epicrealism_naturalSinRC1VAE_106430.safetensors",
        negative_prompt: finalNegativePrompt,
        width: width || 1024,
        height: height || 1024,
        image_num: Math.min(imageCount || 1, 4), // Limit to max 4 images
        steps: 30,
        seed: -1,
        sampler_name: "Euler a",
        guidance_scale: 7.5,
      },
    }

    console.log("[Image Generation] Making request to Novita API...")

    // Make request to Novita API to start generation
    const response = await fetch("https://api.novita.ai/v3/async/txt2img", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[Image Generation] Novita API error:", response.status, errorData)
      return NextResponse.json(
        {
          error: `Failed to generate image: ${response.status} ${response.statusText}`,
          details: errorData,
        },
        { status: response.status },
      )
    }

    const data = (await response.json()) as NovitaTaskResponse
    console.log("[Image Generation] Task created with ID:", data.task_id)

    // Return the task ID to the client
    return NextResponse.json({
      taskId: data.task_id,
      message: "Image generation started successfully",
    })
  } catch (error) {
    console.error("[Image Generation] Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
